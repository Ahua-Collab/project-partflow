# Validation of this distribution

[����](validation.md) �� [Stepwise](../README.en.md)

Date: 2026-10-18. The object checked is the skill distribution, not any business product built with it.

## Checks actually performed

| Check | Result and scope |
|---|---|
| Original-file integrity | All 27 original skill files retain the snapshot's exact SHA-256; added guides do not replace workflow rules |
| Dependencies | Both scripts use Node.js built-ins and local Git; no third-party npm packages; text use does not require running scripts |
| Script syntax | `node --check` on both `.mjs` files exited 0 |
| Original synthetic self-test | `node scripts/self-test.mjs` exited 0 with `All 41 synthetic checks passed.` |
| Synthetic scope | Part continuity, legacy rejection, state/gates, independence, missing/stale evidence, ancestry, dependencies, ownership, paths, deadlines, acceptance, input hashes, and directory movement |
| Documentation and archive | Relative links, full inventory, archive entries, and byte identity are checked after bilingual guide updates; exact totals are in the file list and local publication report |
| Privacy | Pattern scanning and manual content review; the original test's only sample email uses `example.invalid`, not a real account |

Environment: Windows, Node.js `v24.16.0`, Git `2.54.0.windows.1`. Other tool versions are not certified.

The 41 counted checks belong entirely to the unchanged original `self-test.mjs`. Its first 30 are named scenarios; the remaining 11 check ownership, read-only behavior, input hashes/scope, and movement. They are not 41 separate commands. Documentation, syntax, packaging, and privacy checks are additional and are not included in that count.

The first sandbox attempt could not write a synthetic repository's `.git/config`, so it did not pass. Following normal host permission approval, the same unmodified script passed all 41 checks in an isolated temporary directory. The original script cleaned its synthetic repositories and did not touch a business project. Later bilingual changes affect added documentation only; the script result is reused with unchanged script bytes, not claimed as a new run.

## Reproduce the script checks

```text
node --check scripts/gate.mjs
node --check scripts/self-test.mjs
node scripts/self-test.mjs
```

Run from the skill root. The self-test creates temporary synthetic repositories, does not download software or use the network, and is not a check of your real project. Record missing tools or permissions accurately.

`MANIFEST.sha256` lists file hashes except its own. Regenerate it after content changes. Hashes detect byte changes; they do not certify identity, genuine evidence, or absence of defects.

## Not verified

No business-product tests, market collection, or account actions were run. This does not verify all product code, operations on other hosts, or other AI tools. No token, speed, or cost improvement was measured. Teaching examples do not turn historical reported tests into new independent observations.

Account details and publication receipts stay in private local handoff records, not this public package. This page does not itself assert that uploading or publishing has completed.
