---
name: upload-materials
description: Add PDF, PPTX and DOCX teaching materials to this site's resource categories with the upload-materials CLI. Use for 上架教材, adding editable versions, or opening a pending material category; automate file checks, copying, category HTML and build validation.
---

# Upload teaching materials

Use the repository's executable from its root:

```sh
./upload-materials '/path/to/教材.pdf' '/path/to/教材_可編輯版.pptx' '/path/to/教材.docx'
```

The script performs preflight checks before copying files. Do not copy inputs
into `files/` beforehand: that would trigger the collision checks. Original
input files are preserved. Run `./upload-materials --help` for current usage;
[README-materials.md](../../../README-materials.md) documents behavior and recovery.

## Category selection

Read the live categories in `src/content/resource-categories.json`; do not hardcode
menu numbers. Use the category already named by the user. Otherwise present the
script's category choices instead of guessing from a filename. A PTY execution
can receive the selected number through stdin. Selecting a pending category
activates it and generates its missing HTML.

Same-stem files are grouped into one material, ignoring editable suffixes such as
`_可編輯版` and `-editable`; different names become separate materials. The script
also supports editable-only uploads and later companions/PDFs. PPTX and DOCX are
labeled editable. It does not convert formats or change the documents' contents.

## Finish and diagnose

The script updates the shared JSON catalog, copies downloads, generates category
HTML, adds one news entry per material in `src/content/updates.json`, and runs
`npm run build` (including uploader and news regression tests). Missing
installed dependencies trigger `npm ci`. Existing authored category descriptions
remain; site counts, availability and search derive from the shared catalog.
Material news titles use `教材類別「教材名稱」上架`; remove a repeated category
prefix/separator and editable suffix from the filename. Later formats update
the original announcement instead of publishing another.
News links target the matching material card. Removed materials are hidden from
the news feed. [README-news.md](../../../README-news.md) explains freeform notices,
featured news, expiry and manual announcements.

If a conflict is reported, inspect its cause rather than bypassing checks or
silently replacing existing materials. Normal build failure/interruption rolls
back source changes (including news) and the prior `dist`; the printed temporary directory keeps
the build log, before-files and plan. Concurrent source edits are preserved for
manual diagnosis rather than overwritten. A stale-lock error includes its path;
verify the original process has stopped before removing it.

Report success only after the build succeeds. Check the resulting category,
format labels and download links, using desktop/mobile rendering when new formats
or pages are involved. `npm run test:materials` exercises pairing, actual CLI
interaction, collisions, generated HTML, build failure and rollback in fixtures.

By default the command does not stage or commit. When the user has authorized
committing this upload, use `./upload-materials --commit <files...>`: it builds,
stages only the shared catalog, news, changed category HTML and new downloads, runs
`npm run check:clean -- --staged` when available, then commits. It never pushes
or deploys. Do not add `--commit` without existing Git authorization.

Auto-commit requires an empty index and no existing uncommitted changes to the
shared catalog, news file or target HTML; handle earlier uploads separately rather than
folding them into this commit. Other unstaged/untracked work is excluded. HEAD,
index and source changes during validation stop the commit. A build failure
rolls back the upload; a later clean-check/Git failure keeps the successful
upload and removes only uploader staging so it can be reviewed and committed
manually. For manual commits, stage only intended files and use `$clean-build`
to validate that exact snapshot. Leave unrelated changes out of the commit.
