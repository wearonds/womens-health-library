# Branch Lifecycle v1.0 — version-pinned distribution

Upstream: `wearonds/Skill-Warehouse` at merged exact commit `5dd09808cde31fe7f81f448a1521af00f1eb6ca2` (PR #4).
Target repository: `wearonds/womens-health-library`, `main` (refresh HEAD before merge).

Exact source files:
- `.agents/skills/branch-lifecycle/SKILL.md` — upstream Git blob SHA `45f4e3e5ee3c9d4025182776b9eb6cf2f7f84eef`
- `.agents/skills/branch-lifecycle/references/decision-gates.md` — upstream Git blob SHA `6796a0735a95a9160f8cd486065cf00c6ab3a59e`
- `.agents/skills/branch-lifecycle/templates/BRANCH_DECISION_RECORD.template.md` — upstream Git blob SHA `09e3a5db5fe86235fd4694ad66eea38cc28b75a5`

**Clinical safety:** target's current clinical editorial gates, author/reviewer decisions, CMS access controls, publication/versioning and production database migrations remain authoritative. This generic Skill grants no right to alter medical content, publish articles, modify review credentials or backup, run database migrations, create tags/delete refs, merge or deploy. GitHub Pages/manual publication requires a separate explicit gate.

**Status:** proposed copy on a Draft PR, not yet merged into the target's canonical branch. Native Codex/ChatGPT discovery is NOT VERIFIED. Upgrade by intentional source-version-pinned PR after comparing the three upstream blobs.
