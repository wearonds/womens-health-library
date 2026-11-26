# RG-02 — Static release artifact and build-path reconciliation (implementation candidate)

**Status:** Draft PR / HOLD. This does **not** approve a production release, Cloudflare configuration change, medical content, or deployment.

## Source and scope

- Existing application: Next.js / Payload CMS / PostgreSQL; keep the local authoring workflow.
- Public delivery: Cloudflare Pages `womens-health-library` at the domain root, using **manually promoted static files**.
- RG-01 already disabled Git-triggered production and preview deployments. This change does not alter that setting.
- Do **not** use the Cloudflare Git-connected project's old `exit 0` / `.` build path as a release artifact. The only intended release input is the inspected `out/` directory from this builder.
- Source control is PUBLIC. Never commit identifiable ultrasound, patient information, credentials, secrets, local DB, CMS uploads, or private review records.

## What changed

1. `scripts/snapshot-static.ts` omits editorial-only articles from the **public** snapshot; draft preview remains staff/local only.
2. `scripts/build-static.tsx` additionally filters non-medical articles defensively. Public builds omit `/recovery-demo`, its home-page link, and illustration assets belonging only to excluded articles. Preview builds retain the demo for local review.
3. Public snapshot validation requires medical review class, a matching approved content fingerprint, an identified reviewer, review date, summary, urgent advice, sections, and HTTPS references. The fingerprint detects later content drift but **does not authenticate a real physician**.
4. The builder checks its exact emitted-file allowlist and writes a deterministic `release-files.json` containing the SHA-256 of each emitted file, the input snapshot SHA-256, and an optional source SHA.
5. `--release` is fail-closed if the input contains editorial-only articles, no medically approved article, a missing/incorrect `RELEASE_SOURCE_SHA` (must match `git rev-parse HEAD`), or no `STATIC_SITE_URL`. This option **does not** deploy.
6. Existing unit/static/browser checks were updated for the secure behavior. Root-domain path behavior is covered by a synthetic fixture.

## Release candidate (future authorization only)

After a physician has genuinely reviewed the article(s), approved evidence has been checked outside the public repository, and the input snapshot contains **only medical-approved revisions**, the following is an example of a local *build*, not a deployment:

```sh
STATIC_BASE_PATH= STATIC_SITE_URL=https://womens-health-library.pages.dev RELEASE_SOURCE_SHA=<exact-40-character-source-commit> node --import tsx scripts/build-static.tsx --release
```

A candidate is NOT eligible for publication merely because this command passes. Match `RELEASE_SOURCE_SHA` to the actual checkout; preserve the exact source and snapshot, and independently verify medical reviewer identity, image/ultrasound permission and privacy, clinical references, release-file hashes, and Owner approval.

Current checked-in `content/static-site.json` contains two **editorial-only** starter articles; an explicit `--release` must **fail** until those articles have undergone an authorized medical review and the snapshot is regenerated from the trusted CMS. Ordinary `npm run build:static` creates a safe public preview without these articles; it is not a production release authorization. An empty candidate is not automatically approved.

## Mandatory acceptance gates

| Gate | Required evidence | Fail-closed case |
| --- | --- | --- |
| Artifact Integrity | Exact `out/` file allowlist; no `/admin`, `/api`, draft/demo routes, hidden inputs or private image; `release-files.json` hashes independently recomputed | Extra file, unapproved image, or mismatch |
| Medical Content Safety | Authenticated human medical review of same revision, nonempty safety content, appropriate references, verified image/ultrasound licensing/privacy review | Editorial-only, changed after approval, missing independent clinician record |
| Build Reproducibility | Two clean independent builds from identical commit, lockfile, Node/runtime, env, and snapshot, with matching emitted-file SHA-256; content and links at Cloudflare root | Any unexpected diff or untracked input |
| Production Release Control | Verified RG-01 disabled auto deploy; explicit Owner approval for exact commit + snapshot + artifact; no merges or deploy until authorized; rollback candidate identified | Unapproved publish, drift, absent rollback |

## QA / negative-test coverage

- `npm run test:static`: medical vs editorial, draft, post-review modifications, missing urgent advice, unsafe links, absence of public demo, repeatable hashes, root-relative assets.
- `npm run build:static`: safe static build from the current editorial baseline (zero medically approved articles). Never interpret this as medical approval or a release candidate.
- `.github/workflows/checks.yml` now explicitly prepares static preview/public outputs (synthetic test data) and runs the existing `npm run test:static:browser` suite: mobile reading, image links for preview, draft/demo not public, 404 private paths.
- Existing `npm run typecheck`, `npm test`, and `npm run build`: reuse the checks from `.github/workflows/checks.yml`. Scope CI results by exact tested SHA. Do not rerun unrelated tests without evidence drift.
- With a synthetic clinical fixture only, verify `--release` fails if review data, source SHA, canonical site URL, or input integrity is missing, or if the release would have no medically reviewed articles.
- Real ultrasound or identifiable medical images are **not permitted** in QA.

## Known risks / unresolved gates

- `reviewCategory = medical` and a checksum in JSON can be forged. This implementation cannot establish the clinical credentials of a person or validate signed medical approval. **Before any production release**, require a trustworthy CMS reviewer audit/export record and human clinical approval, with any image-specific permissions separately confirmed.
- The old, currently served Cloudflare production content is not modified by this PR and has not thereby gained medical approval.
- `/recovery-demo` and example files already committed to the PUBLIC GitHub repository remain publicly visible as source/history; removing a route from a new artifact does not erase old links or snapshots.
- Images from real patients, including ultrasound, remain OUT OF SCOPE; don't use them for QA.
- Existing GitHub Pages manual workflow is not the canonical Cloudflare release flow and must not be used as a workaround for Owner approval.
- Cloudflare `build_command=exit 0`, `destination_dir=.` remain unchanged. No Wrangler, GitHub Pages, or Cloudflare deployment is part of RG-02.

## Rollback / stop

- **Before merge:** keep Draft PR on its feature branch; reject/revert scoped changes there if tests fail. Main and production remain unchanged.
- **After a separately approved future release:** maintain an independently verified previous artifact, deployment ID, prior clinical status, and a safe holding/withdrawal option. Rollback also requires Owner authorization; an outdated medically unsafe page is not automatically an acceptable rollback target.
- Stop on SHA drift, unverified reviewer identity, patient data exposure, unexpected artifact files, failed mandatory CI, or any cloud deploy configuration change.
