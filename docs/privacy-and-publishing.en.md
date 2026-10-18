# Privacy and publishing

[����](privacy-and-publishing.md) �� [Stepwise](../README.en.md)

## Include the skill, not its users' projects

Distribute `SKILL.md`, interface metadata, general references, unfilled templates, checkers, and anonymized guides together. A complete inventory prevents losing dependencies by copying only the main instructions.

Keep business projects separate. Do not bundle project directories, Git history, role worktrees, daily/progress records, local machine mappings, conversation exports, or dependency caches. `.gitignore` affects future tracking; it does not erase already committed content or history.

## Anonymize examples

Use invented projects, task IDs, paths, and synthetic inputs. Explain methods such as fixed inputs for comparisons, ownership for cross-module work, and distinguishing protective stopping from successful completion. Do not copy real task links, usernames, emails, accounts, private interfaces, business thresholds, run data, commit SHAs, or identifiable private requirements.

An exchange-style example does not need real user configuration, credentials, or private responses. Check current API details separately during implementation. An example confers no account permissions.

## Before publication

1. Make an independent copy from an explicit skill-file allowlist, keeping the source skill and business project read-only.
2. Check relative references, imports, external commands, and download/upload behavior.
3. Scan credential formats and literals, private paths, emails, accounts, and task identifiers. Manually distinguish rule text and synthetic examples from real secrets.
4. Exclude databases, market/order data, logs, conversations, binaries, caches, links, and repository history. Inspect actual archive entries.
5. Run available synthetic checks and record permission failures, successful reruns, and untested areas separately. Verify source files were not changed.
6. Generate final inventory and hashes. Keep private audit evidence outside the published directory.
7. Verify the destination account, repository, visibility, and authorization. Read any existing same-name content before deciding; do not overwrite or force-push it.

These checks do not authorize publishing new data. If a real secret is found, exclude it and address any actual exposure without repeating its value in a public report.

## Maintain a public release

For each update, use an identified version, review differences and added documents, and keep an older version for rollback. Skill updates do not automatically migrate project rules or past decisions. A Git tag may identify a stable version, but version names and licenses should reflect real decisions, not invented examples.
