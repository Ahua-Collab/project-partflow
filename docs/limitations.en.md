# Known limitations and validation boundaries

[中文](limitations.md) · [Stepwise](../README.en.md)

## A workflow, not an execution platform

Stepwise contains rules, templates, and checkers, not a task server. It cannot independently create windows, send cross-host messages, merge code, connect to exchanges, or grant system permissions. Actual tools and authorization control execution; manual handoffs remain possible.

File ownership in instructions is not an operating-system ACL. Roles can misunderstand, omit, or make mistakes. Independent review does not guarantee zero hallucinations, zero defects, fixed delivery speed, or a measured token reduction.

The package is designed for Codex. Adapting it to another AI tool requires user-managed tool interfaces, role dispatch, file permissions, and validation. Other-tool compatibility has not been tested. The display brand does not rename the `project-partflow` skill identifier.

## Partial structural checks

`gate.mjs` checks selected configuration, Part continuity, dependencies, review fields, file existence, and commit ancestry. `ownership` covers committed changes between two commits against configuration; it does not automatically inspect uncommitted/untracked files or derive narrower prompt permissions.

The checker does not prove that logs are genuine, commands produced them, content matches its claims, implementations are correct, or requirements are reasonable. It does not run product tests and cannot detect every fabricated record with valid structure. `inputs` is a local path/hash index for the specified root, not certification of the latest governance, complete references, or prior reading.

Checks require available Git objects and the configured main branch. Shallow history can prevent ancestry checks. There is no automatic repair, migration, or reading cache valid across sessions.

## Instantiate templates and preserve existing governance

Placeholders, empty mappings, and incomplete states in `assets/` are intentional. Fill them from approved requirements and actual Git state. A template's Part number or boolean is not evidence. These templates are not a runnable business project.

Use task-ID suffixes for multiple tasks owned by the same role in one Part. Discover an existing project's paths and rules rather than silently replacing them. Legacy Day/schema 1 records need manual reconciliation or explicitly authorized migration under [recovery rules](../references/recovery.md).

## Scope of validation

This release checks packaging, links, privacy patterns, original-file identity, and synthetic checker behavior. See [validation](validation.en.md) for actual versions and results. It has not verified all business code, host operations, other systems or tool versions, real cross-device recovery, market capacity, accounts, or end-to-end trading.

The teaching example is a limited synthesis of accessible collaboration records, not a rerun or independent certification of their reported tests. Later evidence may close historical defects. No token, speed, or cost comparison was measured.

## Publication and licensing

Publishing a skill does not publish projects that use it. Private requirements, contracts, logs, conversations, data, and account details are excluded. Pattern scanning plus manual review is not a formal proof that no secret can exist.

No license was selected on the rights holder's behalf. Public visibility alone does not specify an open-source license. Account identity, repository ownership, and write permission must be checked at publication time; no credentials are embedded.
