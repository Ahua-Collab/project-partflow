# Quick start: finish one small, checkable piece

[����](quickstart.md) �� [Stepwise](../README.en.md)

## 1. Check the installation

Keep `SKILL.md`, `references/`, `assets/`, `scripts/`, and `agents/` together under the `project-partflow` skill directory. Invoke `$project-partflow` explicitly. If the host cannot discover the skill, provide its actual location and use supported file-reading tools; do not claim it has loaded without evidence.

The text workflow does not require Node.js. Use the optional scripts only when Node.js and Git are available. Otherwise perform the required checks manually and label them as manual, not an automated PASS. See [installation](../INSTALL.en.md).

## 2. Describe the result you want

Tell the coordinator who will use the tool, one realistic input-to-output operation, the target device, existing materials, boundaries, and how you will judge completion. You need not choose a technology first. Ask for a reasoned proposal and clearly marked assumptions.

```text
Use $project-partflow to build an offline note search tool.
I choose text files, enter a keyword, and see matching paragraphs and file locations.
Only process the selected directory; do not upload files.
Define a small usable version with observable acceptance criteria.
Act as coordinator and plan ownership; let the implementing role choose its method.
```

The plan should connect requirement IDs, interfaces, file ownership, data boundaries, continuous Parts, milestones, and final acceptance. The [project-plan template](../assets/PROJECT_PLAN.md) is a starting point, not evidence that the user has approved every field.

## 3. Establish project records

Create records within the approved scope for a new project. For an existing project, recover first instead of replacing its governance.

```text
PROJECT_PLAN.md               Requirements, ownership, schedule, acceptance
AGENTS.md                    Project-specific role and reading rules
docs/privacy-boundaries.md   Data use, transfer, retention, deletion
.engineering/project.json    Schema v2 plan and path mapping
.engineering/roles.md        Role locations, active relationships, delivery receipts
progress/README.md           Recording conventions
progress/STATUS.md           Single entry point for progress
progress/Part-01/            Instructions, delivery, review for the current Part
```

The coordinator fills ownership, tasks, and dependencies from facts, leaving incomplete work incomplete. Discover the actual main branch; do not rename an existing one merely to match a template. Initialize Git and create persistent role tasks only within actual authorization.

## 4. Dispatch the first ready task

Check authoritative STATUS, Git, governance versions, and accepted prerequisites. Archive the complete task prompt before sending it. Define observable goals, precise writable paths, contracts, failure behavior, acceptance, and the delivery location. Separate mandatory constraints from adjustable implementation suggestions.

If shared files are readable, a short handoff can identify the role, task, authoritative root, and prompt path. The recipient must read the original files and check the actual baseline. If files cannot be shared, provide complete text to copy rather than asking the user to assemble fragments.

## 5. Deliver, then review independently

The implementer reports the real baseline and final commits, exact changes, necessary validation and logs, unknowns, and cross-module requests. The coordinator reads the full delivery and actual differences, checks requirements, and performs necessary independent verification.

Corrections append revisions within the same Part. Technical acceptance is followed by authorized integration and verification on the actual mainline. Only when all required tasks, prerequisites, and due milestones have final PASS may the whole-Part review close and STATUS advance. The last Part still requires product acceptance and user confirmation.

## 6. Continue next time

```text
Resume this project from authoritative files and Git.
Reconcile the current task, open issues, and latest review.
Do not repeat completed installation, dispatch, or integration.
Continue the next authorized action and pause only work affected by a real boundary.
```

Do not paste the entire plan into every message. Do not replace required recovery reading with a summary either. See [reading rules](../references/context-budget.md) and the [daily workflow](daily-workflow.en.md).
