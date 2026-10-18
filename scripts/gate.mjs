#!/usr/bin/env node
// Read-only workflow checks. No installs, task creation, merges, or ledger writes.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const demand = (condition, message) => { if (!condition) throw new Error(message); };
const partDir = n => `Part-${String(n).padStart(2, '0')}`;
const statuses = new Set(['NOT_STARTED', 'ARCHIVED_NOT_SENT', 'IN_PROGRESS',
  'REVIEW_REQUIRED', 'CONDITIONAL_PASS', 'FAIL', 'TECHNICALLY_ACCEPTED', 'PASS', 'BLOCKED']);
const fullSha = s => typeof s === 'string' && /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(s);
const list = (x, label) => { demand(Array.isArray(x), `${label}: expected array`); return x; };
const object = (x, label) => {
  demand(x && typeof x === 'object' && !Array.isArray(x), `${label}: expected object`);
  return x;
};
const nonempty = (x, label) => demand(typeof x === 'string' && x.trim(), `${label}: missing text`);

export function context(projectRoot, configPath = '.engineering/project.json') {
  const root = fs.realpathSync(projectRoot);
  function relative(p) {
    demand(typeof p === 'string' && p.length > 0 && !p.includes('\\') &&
      !p.includes(':') && !p.includes('\0') && !path.posix.isAbsolute(p) &&
      p.split('/').every(s => s !== '..' && s !== '.'), `unsafe relative path: ${p}`);
    return p;
  }
  function file(p) {
    relative(p);
    const real = fs.realpathSync(path.resolve(root, p));
    const rel = path.relative(root, real);
    demand(rel && !rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel),
      `path escapes project: ${p}`);
    demand(fs.statSync(real).isFile(), `not a file: ${p}`);
    return real;
  }
  const read = p => fs.readFileSync(file(p), 'utf8').replace(/^\uFEFF/, '');
  const json = p => JSON.parse(read(p));
  function record(p) {
    const matches = [...read(p).matchAll(/^```json\s*\r?\n([\s\S]*?)^```\s*$/gm)];
    demand(matches.length === 1, `${p}: need exactly one JSON fence`);
    return object(JSON.parse(matches[0][1]), p);
  }
  function git(...args) {
    return execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
      env: {...process.env, GIT_OPTIONAL_LOCKS: '0'},
    }).trim();
  }
  const cfg = json(configPath);
  demand(cfg.schema_version === 2, 'config schema v2 required; preserve legacy records and follow recovery.md');
  nonempty(cfg.primary_branch, 'primary_branch');
  git('check-ref-format', '--branch', cfg.primary_branch);
  const primary = git('rev-parse', '--verify', `refs/heads/${cfg.primary_branch}^{commit}`);
  function commit(sha) {
    demand(fullSha(sha), `need full commit SHA: ${sha}`);
    demand(git('rev-parse', '--verify', `${sha}^{commit}`) === sha, `missing commit: ${sha}`);
  }
  function ancestor(older, newer = primary) {
    commit(older); commit(newer);
    try { git('merge-base', '--is-ancestor', older, newer); }
    catch { throw new Error(`commit not integrated / not ancestor: ${older} -> ${newer}`); }
  }
  function under(p, prefix) { relative(p); demand(p.startsWith(prefix), `${p}: expected under ${prefix}`); }
  function owned(p, owner) {
    return owner.paths.some(s => s.endsWith('/') ? p.startsWith(s) : p === s);
  }
  const owners = list(cfg.owners, 'owners');
  demand(owners.length > 0, 'fill project owners before checking');
  const ids = new Set();
  const prefixes = [];
  for (const owner of owners) {
    demand(/^[a-z0-9][a-z0-9-]*$/.test(owner.id) && !ids.has(owner.id), 'invalid/duplicate owner');
    ids.add(owner.id);
    demand(list(owner.paths, 'owner.paths').length > 0, `no paths: ${owner.id}`);
    for (const p of owner.paths) {
      relative(p);
      demand(!/[?*\[\]{}]/.test(p), `ownership uses exact paths, not globs: ${p}`);
      for (const q of prefixes) demand(!(p === q || (p.endsWith('/') && q.startsWith(p)) ||
        (q.endsWith('/') && p.startsWith(q))), `overlapping ownership: ${p}, ${q}`);
      prefixes.push(p);
    }
  }
  return {root, cfg, primary, file, read, record, git, commit, ancestor, under, owned, owners, ids};
}

export function check(projectRoot, configPath) {
  const c = context(projectRoot, configPath);
  const {cfg, file, record, ancestor, commit, under} = c;
  for (const p of [cfg.plan, cfg.rules, cfg.privacy, cfg.roles, `${cfg.progress}/README.md`]) file(p);
  const state = record(`${cfg.progress}/STATUS.md`);
  demand(state.schema_version === 2, 'STATUS schema v2 required; do not reset legacy progress');
  demand(['ACTIVE', 'READY_FOR_ACCEPTANCE', 'COMPLETE'].includes(state.project_status), 'project_status invalid');
  const tasks = list(cfg.tasks, 'tasks');
  demand(tasks.length > 0, 'fill planned tasks before dispatch');
  const byId = new Map();
  for (const task of tasks) {
    demand(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(task.id) && !byId.has(task.id), 'invalid/duplicate task ID');
    demand(Number.isInteger(task.part) && task.part > 0, `invalid part: ${task.id}`);
    demand(c.ids.has(task.owner), `unknown task owner: ${task.id}`);
    list(task.depends_on, `${task.id}.depends_on`);
    byId.set(task.id, task);
  }
  const plannedParts = [...new Set(tasks.map(t => t.part))].sort((a, b) => a - b);
  demand(plannedParts.every((d, i) => d === i + 1), 'planned parts must be contiguous from 1');
  const visiting = new Set(), visited = new Set();
  function visit(t) {
    demand(!visiting.has(t.id), `dependency cycle: ${t.id}`);
    if (visited.has(t.id)) return;
    visiting.add(t.id);
    for (const id of t.depends_on) {
      const dep = byId.get(id);
      demand(dep && dep.part <= t.part, `missing/future dependency: ${t.id} -> ${id}`);
      visit(dep);
    }
    visiting.delete(t.id); visited.add(t.id);
  }
  tasks.forEach(visit);
  const milestones = list(cfg.milestones, 'milestones');
  const mids = new Set();
  for (const m of milestones) {
    nonempty(m.id, 'milestone id');
    demand(!mids.has(m.id) && plannedParts.includes(m.end_part), 'invalid/duplicate milestone');
    mids.add(m.id); file(m.prompt);
  }
  const last = state.last_completed_part;
  demand(Number.isInteger(last) && last >= 0 && last <= plannedParts.length, 'invalid last_completed_part');
  demand(state.next_part === last + 1, 'next_part must equal last_completed_part + 1');
  const completed = list(state.completed_parts, 'completed_parts');
  demand(completed.length === last && completed.every((d, i) => d.part === i + 1),
    'completed part prefix has a gap, duplicate, or disagreement');
  const accepted = new Map();

  function checks(r, p) {
    demand(list(r.checks, `${p}.checks`).length > 0, `${p}: no mainline verification`);
    for (const test of r.checks) {
      nonempty(test.command, `${p}.command`);
      demand(test.exit_code === 0 && test.commit === r.primary_commit,
        `${p}: failing or stale verification`);
      file(test.log);
    }
  }
  function taskReview(p, task) {
    under(p, `${cfg.progress}/${partDir(task.part)}/`);
    const r = record(p);
    demand(r.kind === 'task' && r.task_id === task.id && r.part === task.part && r.role === task.owner,
      `${p}: wrong task/part/role`);
    demand(r.decision === 'PASS', `${p}: not final PASS`);
    demand(c.ids.has(r.reviewer) && r.reviewer !== r.role, `${p}: missing independent reviewer`);
    demand(r.acceptance_checked === true && r.scope_checked === true, `${p}: missing scope/acceptance review`);
    demand(list(r.blocking_issues, `${p}.blocking_issues`).length === 0, `${p}: unresolved blockers`);
    under(r.prompt, `${cfg.progress}/${partDir(task.part)}/`); file(r.prompt);
    commit(r.source_commit); ancestor(r.primary_commit); checks(r, p);
    return r;
  }
  function milestoneReview(p, m, partCommit) {
    const r = record(p);
    demand(r.kind === 'milestone' && r.id === m.id && r.decision === 'PASS', `${p}: milestone not PASS`);
    demand(r.prompt === m.prompt, `${p}: wrong milestone prompt`);
    file(r.prompt); ancestor(r.primary_commit, partCommit); checks(r, p);
  }
  for (const entry of completed) {
    under(entry.review, `${cfg.progress}/${partDir(entry.part)}/`);
    const r = record(entry.review);
    demand(r.kind === 'part' && r.part === entry.part && r.decision === 'PASS', `${entry.review}: part not PASS`);
    demand(r.primary_commit === entry.primary_commit, 'part commit disagrees with STATUS');
    ancestor(r.primary_commit);
    const expected = tasks.filter(t => t.part === entry.part);
    const entries = list(r.tasks, 'part.tasks');
    demand(entries.length === expected.length && new Set(entries.map(x => x.id)).size === entries.length &&
      entries.every(x => expected.some(t => t.id === x.id)), `${entry.review}: incomplete part task set`);
    for (const x of entries) {
      const task = byId.get(x.id), tr = taskReview(x.review, task);
      ancestor(tr.primary_commit, r.primary_commit); accepted.set(task.id, tr);
    }
    for (const t of expected) for (const dep of t.depends_on) {
      demand(accepted.has(dep), `prerequisite not PASS: ${dep}`);
      ancestor(accepted.get(dep).primary_commit, accepted.get(t.id).primary_commit);
    }
    const due = milestones.filter(m => m.end_part === entry.part);
    const mr = list(r.milestone_reviews, 'milestone_reviews');
    demand(mr.length === due.length && new Set(mr.map(x => x.id)).size === mr.length &&
      mr.every(x => due.some(m => m.id === x.id)), 'missing/duplicate due milestone review');
    for (const x of mr) milestoneReview(x.review, due.find(m => m.id === x.id), r.primary_commit);
  }

  const active = object(state.active_items, 'active_items');
  for (const [id, a] of Object.entries(active)) {
    const task = byId.get(id);
    demand(task && task.part === state.next_part, `active task is not on next_part: ${id}`);
    demand(statuses.has(a.status), `invalid active status: ${id}`);
    if (a.status !== 'NOT_STARTED') {
      under(a.prompt, `${cfg.progress}/${partDir(task.part)}/`); file(a.prompt);
    }
    if (a.review) file(a.review);
    if (a.delivery) file(a.delivery);
    if (a.status === 'PASS') {
      const r = taskReview(a.review, task);
      demand(r.prompt === a.prompt, `PASS refers to stale prompt: ${id}`);
      accepted.set(id, r);
    }
  }
  for (const [id, a] of Object.entries(active)) {
    if (a.status === 'NOT_STARTED') continue;
    for (const dep of byId.get(id).depends_on) {
      demand(accepted.has(dep), `active task started before prerequisite PASS: ${id} -> ${dep}`);
      if (a.status === 'PASS') ancestor(accepted.get(dep).primary_commit, accepted.get(id).primary_commit);
    }
  }
  for (const issue of list(state.open_issues, 'open_issues')) {
    nonempty(issue.id, 'issue.id');
    demand(c.ids.has(issue.owner), `unknown issue owner: ${issue.id}`);
    demand(Number.isInteger(issue.due_part) && issue.due_part >= 1 && issue.due_part <= plannedParts.length,
      `invalid issue deadline: ${issue.id}`);
    demand(issue.due_part > last, `overdue issue: ${issue.id}`);
    for (const id of list(issue.blocks, 'issue.blocks')) {
      demand(byId.has(id), `unknown blocked task: ${id}`);
      demand(!accepted.has(id) && (!active[id] || active[id].status === 'NOT_STARTED'),
        `task started while issue blocks it: ${issue.id} -> ${id}`);
    }
  }
  if (state.project_status !== 'ACTIVE') {
    demand(last === plannedParts.length && Object.keys(active).length === 0, 'project has unfinished parts');
  }
  if (state.project_status === 'COMPLETE') {
    demand(state.open_issues.length === 0, 'COMPLETE with unresolved issues');
    const r = record(state.final_review);
    demand(r.kind === 'project' && r.decision === 'PASS' && r.requirements_verified === true,
      'final acceptance not PASS');
    demand(list(r.blocking_issues, 'final blocking_issues').length === 0, 'final blockers remain');
    file(r.prompt); file(r.user_acceptance); ancestor(r.primary_commit); checks(r, state.final_review);
    ancestor(completed.at(-1).primary_commit, r.primary_commit);
  }
  return {ok: true, last_completed_part: last, next_part: state.next_part,
    project_status: state.project_status, note: 'Structural checks only; independent technical review still required.'};
}

export function ownership(projectRoot, role, base, head) {
  const c = context(projectRoot);
  c.commit(base); c.commit(head);
  const owner = c.owners.find(o => o.id === role);
  demand(owner, `unknown owner: ${role}`);
  const files = c.git('diff', '--no-renames', '--name-only', '-z', base, head, '--').split('\0').filter(Boolean);
  const violations = files.filter(p => !c.owned(p, owner));
  demand(violations.length === 0, `ownership violations: ${violations.join(', ')}`);
  return {ok: true, role, changed_files: files,
    note: 'Committed diff only; inspect uncommitted/untracked files and prompt-specific narrower scope separately.'};
}

export function inputs(projectRoot, role = 'director') {
  const c = context(projectRoot);
  demand(c.ids.has(role), `unknown role: ${role}`);
  const {cfg} = c;
  const statePath = `${cfg.progress}/STATUS.md`;
  const state = c.record(statePath);
  demand(state.schema_version === 2 && Number.isInteger(state.next_part) && state.next_part > 0,
    'invalid STATUS: inputs cannot infer progress');
  const names = new Set(['.engineering/project.json', cfg.plan, cfg.rules, cfg.privacy, cfg.roles,
    `${cfg.progress}/README.md`, statePath]);
  const roleTasks = cfg.tasks.filter(t => t.part === state.next_part && (role === 'director' || t.owner === role));
  const active = object(state.active_items, 'active_items');
  for (const t of roleTasks) {
    const a = active[t.id];
    for (const field of ['prompt', 'review', 'delivery']) if (a?.[field]) names.add(a[field]);
  }
  const previous = list(state.completed_parts, 'completed_parts').at(-1);
  if (previous) names.add(previous.review);
  // Enumerate only the adjacent Part's governance files, never whole-repository content.
  for (const n of [state.next_part, previous?.part].filter(Number.isInteger)) {
    const rel = `${cfg.progress}/${partDir(n)}`;
    const directory = path.resolve(c.root, rel);
    if (!fs.existsSync(directory)) continue;
    const real = fs.realpathSync(directory), inside = path.relative(c.root, real);
    demand(inside && inside !== '..' && !inside.startsWith(`..${path.sep}`) && !path.isAbsolute(inside),
      `directory escapes project: ${rel}`);
    for (const entry of fs.readdirSync(real, {withFileTypes: true})) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      if (role === 'director' || entry.name === 'review-part.md' ||
        new RegExp(`^(prompt|review|delivery)-${role}(?:[-.])`).test(entry.name)) {
        names.add(`${rel}/${entry.name}`);
      }
    }
  }
  const documents = [...names].sort().map(p => {
    const data = fs.readFileSync(c.file(p));
    return {path: p, sha256: createHash('sha256').update(data).digest('hex'), bytes: data.length};
  });
  return {scope: {root: c.root, role, primary_commit: c.primary}, next_part: state.next_part,
    tasks: roleTasks.map(t => ({id: t.id, depends_on: t.depends_on, status: active[t.id]?.status ?? 'NOT_STARTED'})),
    documents, note: 'Index only, not proof of reading or gate approval. Open task-referenced contracts and evidence as needed.'};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [mode, root, ...rest] = process.argv.slice(2);
    demand(root && ['check', 'ownership', 'inputs'].includes(mode),
      'Usage: gate.mjs check ROOT [CONFIG] | ownership ROOT ROLE BASE_SHA HEAD_SHA | inputs ROOT [ROLE]');
    const result = mode === 'check' ? check(root, rest[0]) :
      mode === 'inputs' ? inputs(root, rest[0]) : ownership(root, ...rest);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`Gate blocked: ${error.message}\n`);
    process.exitCode = 1;
  }
}
