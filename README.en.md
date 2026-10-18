# ���ݹ��� �� Stepwise

English �� [����](README.md)

**A Codex workflow for staged, collaborative development, built for people without a professional software background and for independent developers. You can adapt it to other AI tools as needed.** Start with an idea, turn it into manageable pieces, and keep records that support handoffs, recovery, and acceptance.

Stepwise is the display name. The repository directory and skill identifier remain `project-partflow`. Invoke **`$project-partflow`**; existing installation paths and projects keep their names.

The package is designed for Codex. Using it with another AI tool requires you to adapt tool interfaces, role dispatch, and file permissions, then validate the actual behavior. Ready-to-use compatibility with other AI tools has not been tested.

## What it helps with

You can describe the outcome in everyday language: who will use it, what they will do, and how you will know it works. You do not need to start with a detailed technical prompt. The coordinating role helps turn that description into a project plan, responsibilities, dependencies, and observable acceptance criteria.

| A common difficulty | How Stepwise helps |
|---|---|
| An idea with no clear starting point | Define a useful first version and a small deliverable you can check |
| Managing product and engineering work alone | Keep requirements, ownership, dependencies, and acceptance in project files |
| Different AI tasks giving inconsistent answers | Use archived task instructions, one file owner, and stable issue IDs |
| Interrupted conversations or a move to another device | Reconcile files and Git rather than rebuilding progress from memory |
| Uncertainty about whether the work is finished | Separate delivery, independent review, mainline verification, and user acceptance |

These are workflow conveniences, not measured promises about speed, token savings, cost, or error rates. People still make product decisions, exercise judgment, and confirm acceptance. Tools can carry out authorized steps where the host supports them.

## How it works

A **Part** is a unit of work with an acceptance gate, not a day. A Part may span several days, and corrections stay in the same Part. The workflow defines goals, interfaces, ownership, and evidence while leaving implementation choices to the person or agent doing the task.

```text
Idea �� project plan and ownership �� current Part tasks �� implementation and delivery
                                                            ��
Next Part �� whole-Part PASS �� mainline verification �� independent review
                                                            �� if incomplete
                                                    same-Part correction
Last Part �� READY_FOR_ACCEPTANCE �� product acceptance and user confirmation �� COMPLETE
```

This is useful for projects with several modules, explicit responsibilities, and work that needs to resume later. A small project may use one coordinator and one implementing role. An ordinary single-file edit usually does not need the full process.

The package contains Markdown instructions, templates, and optional local checkers. It does not install software, create background services, grant permissions, or guarantee a correct product. Task creation, messaging, and external actions depend on the host's tools and the user's authorization.

## Install

Download the complete repository or ZIP. The repository root is the skill directory. Name that directory `project-partflow` and place it in your configured Codex skills directory: under `skills/` in `CODEX_HOME` when configured, otherwise under `.codex/skills/` in your user home.

```text
<Codex skills directory>/project-partflow/
  SKILL.md
  INSTALL.md
  agents/openai.yaml
  references/
  assets/
  scripts/
  README.md
  README.en.md
  docs/
```

Copy the complete folder, not only `SKILL.md`. Avoid a duplicate nested `project-partflow/project-partflow` directory. Back up an existing version before choosing to replace it. Reload skills or start a new conversation and check that the skill is available. Installing the skill does not migrate a project.

See [English installation](INSTALL.en.md) and [quick start](docs/quickstart.en.md). The original skill rules and templates remain in Chinese, unchanged. The English guides explain the same workflow; they do not create separate rules or change existing project governance.

## Your first instruction

```text
Use $project-partflow. I want an offline tool to organize my personal documents.
First clarify questions that would change the plan, then define requirements,
module ownership, observable acceptance criteria, and Parts.
Use this conversation as the coordinator. Create persistent role tasks only
where I have explicitly authorized them and the host supports them.
```

For an existing project:

```text
Use $project-partflow to resume this project. First reconcile the authoritative
plan, AGENTS, STATUS, the previous Part and current task's prompts/reviews,
open issues, and Git. Report completed, ongoing, missing, and next actions.
Keep existing records; do not initialize the project again or integrate twice.
```

For everyday work, ask to continue the current Part, review a delivery, correct the issues in the latest review, or recover on a new device. See the [daily workflow](docs/daily-workflow.en.md).

## Existing mechanisms

| Mechanism | Purpose |
|---|---|
| One active coordinator | Maintains governance, dispatches work, and reviews independently; file owners implement and test |
| File-based handoffs | Archive full instructions, deliveries, and reviews; share precise paths and short summaries when files are accessible |
| Reading by role and stage | Check current state and relevant dependencies; trace older history when needed; retain recovery and milestone reading requirements |
| Implementation freedom | Set goals, contracts, boundaries, and acceptance; label implementation suggestions as adjustable |
| Same-Part corrections and change requests | Keep issue IDs and append revisions; route changes across module boundaries to the owner |
| Mainline gates | Record dispatch, delivery, technical acceptance, integration, and final PASS separately |
| Evidence boundaries | Distinguish requirements, code support, observations, and inference; do not pass missing mandatory evidence |
| Recovery from disk | Use project files and Git rather than old conversations or stale role worktrees as the source of progress |

These mechanisms already exist in [SKILL.md](SKILL.md) and [the reading rules](references/context-budget.md). Stricter rules in an existing project still apply.

## Tools and dependencies

The text workflow needs only a host that can read project files. Optional checkers use **Node.js and Git**, with no third-party npm packages, network access, or account requirements. Tested versions and scope are in [validation](docs/validation.en.md); compatibility with other versions has not been established.

```text
node <skill-directory>/scripts/self-test.mjs
node <skill-directory>/scripts/gate.mjs inputs <authoritative-project-root> <role-id>
node <skill-directory>/scripts/gate.mjs check <authoritative-project-root>
node <skill-directory>/scripts/gate.mjs ownership <project-root> <role-id> <base-sha> <delivery-sha>
```

`inputs` supplies a path/hash index, not proof of reading or an up-to-date source. `check` validates selected structural relationships. `ownership` checks committed differences against configured ownership; uncommitted files and narrower task permissions still need review. None replaces independent technical review or product tests.

The self-test creates and cleans synthetic Git repositories in a temporary directory. The three checker commands read project state without modifying it. Instantiate templates from real facts; empty templates are not completed, passing projects.

## Guides

- [Quick start](docs/quickstart.en.md)
- [Daily workflow](docs/daily-workflow.en.md)
- [Anonymized market-data example](docs/market-workbench-example.en.md)
- [Troubleshooting](docs/troubleshooting.en.md)
- [Known limitations](docs/limitations.en.md)
- [Privacy and publishing](docs/privacy-and-publishing.en.md)
- [Validation](docs/validation.en.md) and [complete file list](FILELIST.md)

`references/` contains workflow rules, `assets/` contains unfilled templates, `scripts/` contains optional checkers, and `agents/` contains interface metadata. Placeholders, empty task lists, and incomplete states are intentional template content.

## License and publication scope

This distribution preserves the original skill files and adds bilingual guides and anonymized examples. It does not include business project code, real market or account data, credentials, conversations, or private work logs. No new license has been selected on the owner's behalf. The rights holder can add an explicit reuse license later.
