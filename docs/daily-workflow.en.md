# Daily workflow

[中文](daily-workflow.md) · [Stepwise](../README.en.md)

“Daily” means everyday use, not one Part per day. Users mainly state outcomes, forward suitable instructions, and bring back deliveries. The coordinator maintains machine fields from evidence.

## Find the current action

| Situation | Ask the coordinator | Expected result |
|---|---|---|
| An idea only | Define an acceptance-based plan | Scope, responsibilities, dependencies, Parts, acceptance |
| Current Part not dispatched | Prepare the first executable task | Archived full prompt and a usable handoff |
| Prompt exists, receipt missing | Check dispatch before creating another task | A real receipt or an explicit pending handoff |
| Role working | Continue the existing task | Actual progress, blockers, and next action |
| Delivery received | Review only this delivery | Independent review without automatically dispatching the next Part |
| Review incomplete | Correct the same Part's issues | Stable issue IDs and an appended revision |
| Technically accepted, not integrated | Integrate under existing authorization and verify | Source-to-main mapping and actual mainline evidence |
| All tasks passed | Check the whole-Part gate | Whole-Part review, then STATUS advancement if eligible |
| Interrupted or on another device | Recover from authoritative files and Git | Completed, ongoing, unknown, and one clear next action |

## One collaboration cycle

The coordinator assigns a single file owner and archives a prompt with goals, mandatory constraints, writable paths, and observable acceptance. The implementer reads it, checks the baseline, and chooses the implementation method within scope. Continue through implementation, necessary validation, and relevant fixes without asking permission for every ordinary step.

When a dependency crosses ownership, submit the smallest change request and continue authorized work that does not depend on it. Deliver a complete report. The coordinator checks actual differences and full affected code paths against the original requirement, not only green tests.

Keep issue IDs, original commits, and failures when correcting work. Append revisions; new defects get new IDs. “Changed” is not the same as “closed.” After technical acceptance, integrate only under actual authorization, avoid replaying equivalent commits, and verify the resulting mainline. One role's PASS does not close the whole Part.

## Read less repetition without losing evidence

Store complete materials on disk and share conclusions, issue IDs, precise paths, commits, and next actions in chat. For each new Part, recheck authoritative STATUS, Git, governance versions, the previous Part, and current dependencies. Trace older history when the current issue requires it, rather than repeating every old daily/prompt/review record.

Reuse an original document only while its full text remains in the current task context, the source, role, and root are the same, and its actual SHA-256 is unchanged. New sessions, compressed context, handoffs, device changes, changed content, or uncertainty require the role's mandatory originals to be read again. Milestones and final acceptance require full governance rereading. Indexes, timestamps, or an unchanged HEAD do not prove reading or unchanged content. Stricter project rules still apply.

`inputs` helps locate adjacent Part and role records. It does not enumerate every referenced contract, open request, or evidence file. Follow the prompt's references and read any truncated output in additional sections.

## Leave implementation choices open

Set observable invariants: cancellation cannot report success; a resource limit applies to the whole task; fixed inputs can reproduce results. Define ownership and contracts. Label algorithm or organization suggestions as adjustable unless correctness truly requires an order.

Templates help cover essential information. Their prose and layout can adapt, while acceptance, responsibility, authorization, and machine-state formats remain intact.

## Use precise status language

Archived, dispatched, executing, delivered, technically accepted, integrated, and final mainline PASS describe different facts. State who is doing which task, against which file or commit, what actually happened, and what remains missing. An idle role is not permission to start a future Part.

## Recovery and closure

Move source, Git history, governance, task/review records, and required sanitized evidence separately from the installed skill. Rediscover paths, tools, task IDs, and permissions. Confirm one active coordinator; if automatic task tools are absent, use a manual handoff without inventing IDs or delivery receipts.

After the last Part passes, use `READY_FOR_ACCEPTANCE`. Complete the user's actual workflow, installation, operation, upgrade/rollback, limitations, and requirement mapping. Mark `COMPLETE` only after user confirmation or the objectively verifiable acceptance method previously delegated by the user. Keep missing evidence missing; never invent historical success.
