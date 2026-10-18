# Install and use Stepwise

[中文安装说明](INSTALL.md) · [English overview](README.en.md)

The display name is **阶梯工坊 · Stepwise**. The skill name and installation directory remain **`project-partflow`**. Always invoke **`$project-partflow`**. The original Chinese skill rules, templates, and scripts are unchanged.

## Install the complete directory

1. Download the repository or its ZIP. Find the directory containing `SKILL.md`, `references/`, `assets/`, `scripts/`, and `agents/`.
2. Name that directory `project-partflow`. A downloaded repository may have a branch suffix; the installation directory should not.
3. Place the complete directory under your configured Codex skills directory: `CODEX_HOME/skills/` when `CODEX_HOME` is configured, otherwise `.codex/skills/` in your user home.
4. If the same skill already exists, keep a backup before choosing to replace it. Do not overwrite a version in active use without preserving it.
5. Reload the skills list or start a new conversation, and confirm that the skill can be found. Do not create a duplicate nested directory.

This is a standalone skill. It does not require another personal skill or the project used to develop these examples. Copying the skill does not copy or migrate any project. Documentation alone is not a claim that it has been installed on your machine.

## Start a project

```text
Use $project-partflow. I want a tool that does … for … on … .
Help me clarify the important choices, write an acceptance-based project plan,
assign module ownership, and progress through reviewed Parts.
```

A Part is a logical unit of accepted work, not a calendar day. You can ask to continue, review a delivery, correct the latest issues, or recover after an interruption. The coordinator maintains machine fields from evidence; users do not need to fill them in manually.

When tasks can read shared files, the coordinator sends a short instruction with the role, task, authoritative root, and archived prompt path. Otherwise it supplies complete text to copy. It should not ask users to assemble fragments themselves. Creating persistent role tasks still requires explicit authorization and host support.

## Resume or migrate an existing project

First reconcile its original governance. Do not overwrite it with templates or reset progress. Legacy `daily/Day-NN` records remain historical records; the v2 checker rejects legacy schemas rather than silently migrating them. See [recovery rules](references/recovery.md) and [troubleshooting](docs/troubleshooting.en.md).

On another device, separately copy or clone the project's source, Git history, plan, AGENTS, progress records, role register, and the sanitized evidence referenced by acceptance. Rediscover local tools, worktrees, task IDs, and permissions. Do not copy credentials, private conversation databases, or dependency caches as part of the skill.

## Optional checkers

The text workflow does not require a runtime. The optional deterministic checks need installed Node.js and Git, with no npm dependencies:

```text
node <skill-directory>/scripts/self-test.mjs
node <skill-directory>/scripts/gate.mjs inputs <authoritative-project-root> <role-id>
node <skill-directory>/scripts/gate.mjs check <authoritative-project-root>
```

The self-test writes synthetic temporary repositories and cleans them. The checker commands do not modify the project or run its product tests. A passing checker cannot prove evidence authenticity or correct behavior; independent review is still required. See [validation](docs/validation.en.md) for actual tested versions and limits.

## Everyday use and updates

Start with the [quick start](docs/quickstart.en.md), then use the [daily workflow](docs/daily-workflow.en.md). Keep full records on disk and concise handoffs in chat. Conditional reading reuse applies only while the required original text remains fully in the current context and the actual source hash is unchanged. New sessions, compression, handoffs, changes, and milestones trigger the specified rereads. Existing stricter project rules remain effective.

Updates do not automatically rewrite project governance or historical decisions. There is no promise of zero errors, a fixed speed increase, or a measured token-saving percentage. Keep the previous skill version for rollback and review changes before replacing it.
