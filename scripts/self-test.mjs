#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {check, ownership, inputs} from './gate.mjs';

// Entirely synthetic repositories; never reads or alters the user's project.
const tempBase = fs.realpathSync(os.tmpdir());
const root = fs.mkdtempSync(path.join(tempBase, 'project-partflow-test-'));
let count = 0;
function write(p, data) {
  const dest = path.join(root, p);
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, data, 'utf8');
}
const json = (p, data) => write(p, JSON.stringify(data));
const rec = (p, data) => write(p, `# Synthetic evidence\n\n\x60\x60\x60json\n${JSON.stringify(data, null, 2)}\n\x60\x60\x60\n`);
const git = (...args) => execFileSync('git', ['-C', root, ...args], {
  encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
}).trim();
try {
  git('init', '-b', 'main');
  git('config', 'user.name', 'Synthetic Workflow Test');
  git('config', 'user.email', 'workflow-test@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  write('src/sample.txt', 'initial\n');
  git('add', '.'); git('commit', '-m', 'synthetic baseline');
  const base = git('rev-parse', 'HEAD');
  write('src/sample.txt', 'changed\n');
  git('add', '.'); git('commit', '-m', 'synthetic implementation');
  const sha = git('rev-parse', 'HEAD');
  git('checkout', '-b', 'unintegrated');
  write('src/sample.txt', 'unintegrated\n');
  git('add', '.'); git('commit', '-m', 'unintegrated implementation');
  const unmerged = git('rev-parse', 'HEAD');
  git('checkout', 'main');
  for (const p of ['PROJECT_PLAN.md', 'AGENTS.md', 'docs/privacy.md', '.engineering/roles.md',
    'progress/README.md', 'progress/Part-01/prompt-builder.md', 'progress/Part-02/prompt-builder.md',
    'progress/Part-01/log.txt', 'progress/Milestone-01/prompt-milestone.md',
    'progress/Final/prompt-acceptance.md', 'progress/Final/user-acceptance.md']) write(p, 'synthetic evidence\n');
  const cfg = {
    schema_version: 2, plan: 'PROJECT_PLAN.md', rules: 'AGENTS.md', privacy: 'docs/privacy.md',
    roles: '.engineering/roles.md', progress: 'progress', primary_branch: 'main',
    owners: [{id: 'director', paths: ['PROJECT_PLAN.md', 'AGENTS.md', 'docs/', '.engineering/', 'progress/']},
      {id: 'builder', paths: ['src/']}],
    tasks: [{id: 'build-1', part: 1, owner: 'builder', depends_on: []},
      {id: 'build-2', part: 2, owner: 'builder', depends_on: ['build-1']}], milestones: [],
  };
  const review = {
    kind: 'task', task_id: 'build-1', part: 1, role: 'builder', reviewer: 'director',
    decision: 'PASS', prompt: 'progress/Part-01/prompt-builder.md', source_commit: sha, primary_commit: sha,
    checks: [{command: 'synthetic verification', exit_code: 0, log: 'progress/Part-01/log.txt', commit: sha}],
    acceptance_checked: true, scope_checked: true, blocking_issues: [],
  };
  const partReview = {
    kind: 'part', part: 1, decision: 'PASS', primary_commit: sha,
    tasks: [{id: 'build-1', review: 'progress/Part-01/review-builder.md'}], milestone_reviews: [],
  };
  const state = {schema_version: 2, project_status: 'ACTIVE', last_completed_part: 1, next_part: 2,
    completed_parts: [{part: 1, review: 'progress/Part-01/review-part.md', primary_commit: sha}],
    active_items: {}, open_issues: [], final_review: null};
  function fixture(change = () => {}) {
    const f = structuredClone({cfg, review, partReview, state}); change(f);
    json('.engineering/project.json', f.cfg);
    rec('progress/STATUS.md', f.state); rec('progress/Part-01/review-builder.md', f.review);
    rec('progress/Part-01/review-part.md', f.partReview);
    return f;
  }
  function test(name, mutate, pattern) {
    fixture(mutate);
    if (pattern) assert.throws(() => check(root), pattern, name);
    else assert.equal(check(root).ok, true, name);
    count++; process.stdout.write(`ok ${count} - ${name}\n`);
  }
  test('valid completed part allows part 2', () => {});
  test('legacy config is rejected without resetting progress', f => {f.cfg.schema_version = 1;}, /schema v2 required/);
  test('legacy ledger is rejected without resetting progress', f => {f.state.schema_version = 1;}, /do not reset/);
  test('no automatic advancement from a partial part', f => {
    f.state.last_completed_part = 0; f.state.next_part = 1; f.state.completed_parts = [];
    f.state.active_items = {'build-1': {status: 'CONDITIONAL_PASS', prompt: review.prompt,
      review: 'progress/Part-01/review-builder.md'}};
    f.review.decision = 'CONDITIONAL_PASS';
  });
  test('next_part cannot jump', f => {f.state.next_part = 3;}, /next_part/);
  test('completed prefix cannot skip a part', f => {f.state.completed_parts[0].part = 2;}, /prefix/);
  test('conditional review cannot pass gate', f => {f.review.decision = 'CONDITIONAL_PASS';}, /not final PASS/);
  test('technical acceptance is not final PASS', f => {f.review.decision = 'TECHNICALLY_ACCEPTED';}, /not final PASS/);
  test('self review is rejected', f => {f.review.reviewer = 'builder';}, /independent reviewer/);
  test('missing prompt is rejected', f => {f.review.prompt = 'progress/Part-01/missing.md';}, /ENOENT/);
  test('unintegrated source cannot be called primary result', f => {
    f.review.primary_commit = unmerged;
  }, /not integrated/);
  test('stale binary/commit evidence is rejected', f => {f.review.checks[0].commit = base;}, /stale verification/);
  test('failed mainline test is rejected', f => {f.review.checks[0].exit_code = 1;}, /failing/);
  test('empty checks do not count as proof', f => {f.review.checks = [];}, /no mainline/);
  test('missing final log is rejected', f => {f.review.checks[0].log = 'progress/missing.log';}, /ENOENT/);
  test('unresolved reviewer issue is rejected', f => {f.review.blocking_issues = ['D1-01'];}, /unresolved blockers/);
  test('omitted prerequisite task prevents whole-part PASS', f => {
    f.cfg.tasks.push({id: 'prereq', part: 1, owner: 'builder', depends_on: []});
  }, /incomplete part task set/);
  test('future part cannot start while current part is open', f => {
    f.state.last_completed_part = 0; f.state.next_part = 1; f.state.completed_parts = [];
    f.state.active_items = {'build-2': {status: 'IN_PROGRESS', prompt: 'progress/Part-02/prompt-builder.md'}};
  }, /not on next_part/);
  test('same-part prerequisite must be accepted first', f => {
    f.cfg.tasks[1].part = 1; f.state.last_completed_part = 0; f.state.next_part = 1; f.state.completed_parts = [];
    f.state.active_items = {'build-2': {status: 'IN_PROGRESS', prompt: review.prompt}};
  }, /before prerequisite PASS/);
  test('dependency cycle is rejected', f => {
    f.cfg.tasks[1].part = 1; f.cfg.tasks[0].depends_on = ['build-2'];
  }, /cycle/);
  test('overlapping ownership is rejected', f => {f.cfg.owners[0].paths.push('src/');}, /overlapping/);
  test('path traversal is rejected', f => {f.review.checks[0].log = '../outside';}, /unsafe relative/);
  test('missing due milestone blocks part', f => {
    f.cfg.milestones = [{id: 'M1', end_part: 1, prompt: 'progress/Milestone-01/prompt-milestone.md'}];
  }, /milestone review/);
  test('independent milestone evidence permits closure', f => {
    f.cfg.milestones = [{id: 'M1', end_part: 1, prompt: 'progress/Milestone-01/prompt-milestone.md'}];
    f.partReview.milestone_reviews = [{id: 'M1', review: 'progress/Milestone-01/review-milestone.md'}];
    rec('progress/Milestone-01/review-milestone.md', {kind: 'milestone', id: 'M1', decision: 'PASS',
      prompt: 'progress/Milestone-01/prompt-milestone.md', primary_commit: sha, checks: review.checks});
  });
  test('same-part accepted prerequisite releases its consumer', f => {
    f.cfg.tasks[1].part = 1; f.state.last_completed_part = 0; f.state.next_part = 1; f.state.completed_parts = [];
    f.state.active_items = {
      'build-1': {status: 'PASS', prompt: review.prompt, review: 'progress/Part-01/review-builder.md'},
      'build-2': {status: 'IN_PROGRESS', prompt: review.prompt},
    };
  });
  test('overdue nonblocking issue cannot vanish', f => {
    f.state.open_issues = [{id: 'I1', owner: 'builder', due_part: 1, blocks: []}];
  }, /overdue/);
  test('active task cannot ignore blocking issue', f => {
    f.state.open_issues = [{id: 'I1', owner: 'builder', due_part: 2, blocks: ['build-2']}];
    f.state.active_items = {'build-2': {status: 'IN_PROGRESS', prompt: 'progress/Part-02/prompt-builder.md'}};
  }, /issue blocks/);
  test('unfinished project cannot be complete', f => {f.state.project_status = 'COMPLETE';}, /unfinished parts/);
  test('missing user acceptance cannot complete project', f => {
    f.cfg.tasks.pop(); f.state.project_status = 'COMPLETE'; f.state.final_review = 'progress/Final/review-acceptance.md';
    rec(f.state.final_review, {kind: 'project', decision: 'PASS', requirements_verified: true,
      blocking_issues: [], prompt: 'progress/Final/prompt-acceptance.md', primary_commit: sha,
      checks: review.checks, user_acceptance: 'progress/Final/missing.md'});
  }, /ENOENT/);
  test('final acceptance closes a completed project', f => {
    f.cfg.tasks.pop(); f.state.project_status = 'COMPLETE'; f.state.final_review = 'progress/Final/review-acceptance.md';
    rec(f.state.final_review, {kind: 'project', decision: 'PASS', requirements_verified: true,
      blocking_issues: [], prompt: 'progress/Final/prompt-acceptance.md', primary_commit: sha,
      checks: review.checks, user_acceptance: 'progress/Final/user-acceptance.md'});
  });
  fixture();
  assert.equal(ownership(root, 'builder', base, sha).ok, true); count++;
  assert.throws(() => ownership(root, 'director', base, sha), /ownership violations/); count++;
  const snapshot = fs.readFileSync(path.join(root, 'progress/STATUS.md'), 'utf8');
  check(root);
  assert.equal(fs.readFileSync(path.join(root, 'progress/STATUS.md'), 'utf8'), snapshot); count++;
  const beforeInputs = inputs(root, 'director');
  const beforeHash = beforeInputs.documents.find(d => d.path === 'PROJECT_PLAN.md').sha256;
  write('PROJECT_PLAN.md', 'private-sentinel-plan-content\n');
  const afterInputs = inputs(root, 'director');
  assert.notEqual(afterInputs.documents.find(d => d.path === 'PROJECT_PLAN.md').sha256, beforeHash); count++;
  assert.equal(beforeInputs.scope.primary_commit, afterInputs.scope.primary_commit); count++;
  assert.ok(!JSON.stringify(afterInputs).includes('private-sentinel-plan-content')); count++;
  const builderInputs = inputs(root, 'builder');
  assert.notEqual(builderInputs.scope.role, afterInputs.scope.role); count++;
  assert.throws(() => inputs(root, 'unknown'), /unknown role/); count++;
  assert.equal(fs.readFileSync(path.join(root, 'progress/STATUS.md'), 'utf8'), snapshot); count++;
  const moved = fs.mkdtempSync(path.join(tempBase, 'project-partflow-test-moved-'));
  try {
    fs.cpSync(root, moved, {recursive: true});
    assert.equal(check(moved).ok, true); count++;
    assert.notEqual(inputs(moved, 'director').scope.root, afterInputs.scope.root); count++;
  } finally {
    const resolved = fs.realpathSync(moved);
    assert.equal(path.dirname(resolved), tempBase);
    assert.ok(path.basename(resolved).startsWith('project-partflow-test-moved-'));
    fs.rmSync(resolved, {recursive: true, force: true});
  }
  process.stdout.write(`All ${count} synthetic checks passed.\n`);
} finally {
  const resolved = fs.realpathSync(root);
  assert.equal(path.dirname(resolved), tempBase);
  assert.ok(path.basename(resolved).startsWith('project-partflow-test-'));
  fs.rmSync(resolved, {recursive: true, force: true});
}
