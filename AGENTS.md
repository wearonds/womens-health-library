# Women's Health Library — AGENTS.md

## New chat bootstrap (Project Resume Standard v1.0)
Repository `wearonds/womens-health-library` is PUBLIC. Read in this order: this file → `HANDOFF.md` → `OWNER_OVERVIEW_TH.md` → `README.md` → task-specific `content/technical-handoff.md`, source/tests and current GitHub/CI/hosting evidence.
A new-chat request "ต่อโปรเจกต์ Women's Health Library จาก GitHub" authorizes reading/reconstruction only, not Merge, public publishing, CMS approval, migration, database, cloud or patient data operations. Summarize in Thai. Recheck current refs; dated documents are not live telemetry.

## Application and content authority
- Next.js 16 + Payload CMS 3 + PostgreSQL 17; public static export is distinct from the local authoring CMS. GitHub is source for app code and versioned specs; actual local CMS/PostgreSQL and media/backups are not reconstructed from GitHub code alone.
- Two initial published starter articles were editorially approved by the author and marked *not independently medically reviewed* in the README. **Never relabel editorial approval as medical review** or invent a doctor/reviewer/date.
- Preserve draft → version-linked review → approval → publish controls. Changes after content approval require fresh review; don't publish drafts, claim guideline certainty or remove clinical caution labels for convenience.
- For patient-facing clinical content, distinguish source citation, editorial acceptance, formal medical review and actual public publishing; request the appropriate Owner/clinical review for substantive medical edits. Treat ACOG/RCOG/RTCOG and relevant high-quality guidelines as preferred reference sources when accessible; never assert a source was verified if access failed.
- No personal health information, patient identifiers, staff credential leaks, real database dumps, media uploads, cookies, passwords, secrets or production connection strings in a PUBLIC repository/PR/AI output.

## Hosting and deployment hard stop
- `README.md` / `content/github-pages-guide.md` discuss *manual GitHub Pages* static export; `.github/workflows/static-pages.yml` requires manual dispatch and `publish=true`.
- **Independent live Cloudflare API observation on 2026-11-13:** Pages project `womens-health-library` is GitHub-connected, production branch `main`, **production_deployments_enabled=true**, previews enabled. Thus a merge to `main` may auto-deploy to Cloudflare even if the GitHub Pages workflow is manual. Do not assume one platform's release gate protects the other.
- Keep every PR Draft/HOLD until Owner explicitly approves specific PR SHA AND relevant production publication/deployment, or separately authorizes a verified change to disable automatic deployment. No auto-merge, production deploy, Cloudflare settings or GitHub Pages publishing here.
- Database migrations, access control, CMS permissions, credentials, backup recovery, new hosting and public patient-article release each require scoped approvals and separate evidence.

## QA and handoff
- Check exact base/head SHA, diff, content review class, public-release implications, tests, blocked risks, and actual CI result. Existing scripts include `npm run typecheck`, `npm run test:static`, `npm run build:static`, `npm test`, `npm run build`, `npm run test:browser`; scope tests to the change and preserve existing assertions.
- For docs-only PR, verify only Markdown changed, navigation links work, no content status/clinical data/production settings changed. CI PASS cannot substitute for medical review or real-device/public release acceptance.
- `content/technical-handoff.md` is an operational/database migration reference, not a live checkpoint; `HANDOFF.md` records dated state. Never execute migration or restore instructions merely because they are documented.
