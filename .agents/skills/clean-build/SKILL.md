---
name: clean-build
description: Validate this project's committed or staged Git snapshot in a fresh temporary directory before committing or pushing. Reproduce the GitHub Pages build with the workflow Node.js version, fresh npm ci, build checks and money regression tests. Use for clean-checkout validation and diagnosing builds that work locally but fail in CI.
---

# Clean build before release

Run from this repository's root. The reusable runner is
[`scripts/check-clean-build.mjs`](../../../scripts/check-clean-build.mjs).
It obtains the Node.js major from the **selected snapshot's**
`.github/workflows/deploy.yml`, uses `npm exec` to run that version, then runs
`npm ci`, `npm run build`, and `npm run test:money` when present.
Git, tar, npm and network access for uncached packages are required on macOS/Linux.

## Choose the content to verify

- Already committed changes / proposed push: `npm run check:clean` checks `HEAD`.
- Before an authorized commit: stage only the intended files, then run
  `npm run check:clean -- --staged`. Do not stage unrelated work to make a build pass.
- Specific commit/tag: `npm run check:clean -- --ref <commit-or-tag>`.
- Project-site paths: append `--base-path /review/`; use `/` for this site's normal deployment.
- To inspect a successful export, append `--keep`.

The default excludes **all** uncommitted changes. Staged mode exports the index,
so unstaged edits and untracked files remain excluded. Neither mode copies local
`node_modules` or `dist`. The runner does not stage, commit, push or deploy.
Changes to the runner or package command themselves must be staged/committed to
include them in the candidate snapshot; if that command is absent in an old
checkout, invoke `node scripts/check-clean-build.mjs` from the current checkout.

## Read the result

Exit code 0 means installation and every selected check passed; nonzero means
failure. The final `Report:` path points to `report.json` beside `build.log` in a
new system temporary directory. The report identifies the commit or index digest,
Node.js version, base path, commands and result. Successful source copies are
removed unless `--keep` was requested; failed copies remain for diagnosis.

A missing file in a failed clean copy often means an import, asset or test helper
was never tracked, or is accidentally ignored. Fix the actual dependency or Git
inclusion, then rerun the same mode. Do not copy ignored working-tree files into
the snapshot or skip failing checks. If files change after validation, rerun for
the final candidate before reporting or performing an authorized commit/push.

Report which snapshot passed and the log/report paths. This validates a fresh
local build, not Ubuntu-specific behavior, browser interactions, GitHub Pages
permissions or service availability. Actual deployment is confirmed by the
existing GitHub Actions build/deploy jobs; running this skill grants no
permission to trigger a push or deployment.
