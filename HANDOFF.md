# Women's Health Library — HANDOFF.md

**Project Resume v1.0 | Evidence snapshot 2026-11-13 (Asia/Bangkok) — not live sync**

## Verified GitHub checkpoint
- Public repo `wearonds/womens-health-library`, `main` SHA `7f35e341f31d705291274e5267d199d731c223dc`.
- No open GitHub PRs returned at this checkpoint; recheck live issues/PRs before new work.
- Next.js/Payload/PostgreSQL stack and editorial-to-medical review distinction documented in [README.md](README.md). Existing starter articles were author/editorial-approved for publication but explicitly labeled **not medically reviewed**.
- `content/technical-handoff.md` includes migration/backup instructions; these are operations requiring scoped authority, not automatically pending tasks.

## Hosting discrepancy and release risk
- GitHub workflow `.github/workflows/static-pages.yml` publishes GitHub Pages only after manual dispatch with explicit `publish` flag, as documented in `content/github-pages-guide.md`.
- **Cloudflare Pages also exists**: project `womens-health-library`, auto Production Deployment from `main` **enabled** at 2026-11-13 read-only audit. Most recently observed SUCCESS deployment ID `fca6583a-ec2e-487b-a60a-f3ee8b76db7f`, GitHub source SHA `7f35e341f31d705291274e5267d199d731c223dc` (created 2026-10-22). This evidence does not independently prove the clinical content of the live URL.
- **Do not merge this or future PRs without separate explicit Owner approval of the resulting Cloudflare production publishing risk** (or a separately approved and verified disabling of auto deploy). This task does not change settings.
- GitHub/Cloudflare live metadata and the real published site must be reconciled before making public-site safety claims.

## Next-agent procedure
1. Read `AGENTS.md`, `OWNER_OVERVIEW_TH.md`, this file and the current `README.md`.
2. Verify exact GitHub main/PR/CI and both GitHub Pages + Cloudflare publish paths read-only. A dated success status is not a current content/medical safety assertion.
3. For content scope, read specific article status, approval type and latest reference; do not upgrade `editorial` to `medical` or publish draft without actual authorized review.
4. For code scope, use feature branch / Draft PR, synthetic/dev DB and exact-head QA; no production database, deployment, migrations or credentials without separate approvals.
5. If Owner only says "ต่อโปรเจกต์ Women's Health Library จาก GitHub", summarize latest state, risks and proposed next step. No automatic actions beyond reading.

## Open decisions, not automatic tasks
- Owner may choose to reconcile GitHub Pages and Cloudflare Pages as canonical publishing channel, preserving current release controls.
- Medical review of published starters must be explicitly evidenced before labeling reviewed.
- This docs-only resume PR does not include article/body edits, clinical content approval, DB changes, CI/workflow, hosting configuration, secrets, deployment or publish action.

Reference: [Publishing workflow](README.md) · [Static export](content/github-pages-guide.md) · [Technical handoff](content/technical-handoff.md)
