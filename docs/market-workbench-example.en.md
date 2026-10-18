# Market-data example: progress without repeated loops

[����](market-workbench-example.md) �� [Stepwise](../README.en.md)

This anonymized teaching example draws on collaboration patterns in OKX-style order-book, collection, and replay development. Modules, task IDs, scenarios, and data are teaching constructs. It reproduces no real project's configuration, implementation, trading data, or acceptance results. It is a workflow example, not current exchange documentation, account instructions, or trading advice.

## A small goal and clear owners

Imagine an offline research tool that rebuilds a simplified order book from synthetic events, persists confirmed events, and supports queries and replay. Its first stage has no network access, account integration, or orders. Define visible behavior: flag out-of-order input, never report cancellation as success, and avoid double counting after recovery.

| Role | Teaching responsibility | At a boundary |
|---|---|---|
| director | Plan, dispatch, independent review, mainline gates | Assign a change request to the actual owner |
| contract | Shared event contract, root build and dependencies | Change shared files only through a formal task |
| ingest | Receive, validate, coordinate, replay | Request a missing storage API rather than editing storage |
| storage | Persistence, recovery, migrations | Do not rewrite the consumer on its behalf |

These roles are examples, not defaults for every project. Small projects can combine implementation responsibilities while preserving independent review.

Plan one Part for event contracts and offline inputs, another for receive-to-storage-to-query behavior, and another for cancellation, stopping, and cross-process recovery. Final acceptance covers installation, real user operations, limitations, and confirmation. Accept a shared prerequisite before its consumer; a same-Part prerequisite need not become a new Part. A future schedule is not authorization to start it.

## Make a correction precise

Suppose a recovery delivery says ��the process exited�� but does not prove unfinished derived work can resume. Separate process exit, raw-event durability, derived-work completion, and final data quality. Tests that cover only one cannot close all four.

Keep the task and issue IDs. Record the failing scenario, expected invariant, evidence, permitted paths, and closure condition. First determine whether existing APIs can express the durable work boundary. If not, route a minimal request to the storage owner. Preserve prior accepted history; accept the new prerequisite on the mainline before the consumer integrates it and verifies the full chain.

A missing durable boundary may be an implementation or contract defect. Failure to archive instructions is a workflow problem. Inaccessible original data is an environment boundary. Stopping in the same Part does not make these the same kind of problem.

## Why A/B comparisons can mislead

Here A/B means a controlled comparison between software approaches. Fix input sets, commits, build type, actual executable, configuration, machine load, and measurement boundaries. Change a meaningful variable at a time.

��Source ready to processed�� and ��application read to processed�� are different intervals. Moving a wait outside the measured interval can improve a reported number without improving the user's end-to-end experience. Explain the hypothesis, controls, changed variable, comparability, failure behavior, observations, and unknowns. Do not claim a speedup ratio from different conditions.

After failure, inspect original evidence and the smallest relevant code/timing path. Add a bounded witness only if evidence is missing. Preserve failures rather than looping a complete suite until it turns green. Normal completion, correct protective stopping, local unit success, and full capacity acceptance are different results. Independent review must also check whether test expectations are wrong.

## Coordinate measurements and evidence

Authorized independent development may run concurrently. Coordinate expensive measurements so CPU or disk contention does not masquerade as a product bottleneck, and isolate build outputs.

Keep logs and evidence indexes in the project; chat carries results and locations. Previously bound large historical fixtures that an operation cannot affect need not be rehashed every round. Protect inputs, programs, and fixed outputs that might be overwritten, and retain final commit binding and necessary independent verification. Equal hashes demonstrate checked byte identity, not correctness.

## Apply the pattern to a real project

Use its actual contracts, data authorization, requirements, and current state. Public-market access, private accounts, simulation, live trading, and remote uploads have separate boundaries. This offline example authorizes none of them. Check current protocols, regional availability, and account permissions at implementation time.

The example does not assert that a real project still has these historical defects or that its code, capacity, trading behavior, or returns have been verified.
