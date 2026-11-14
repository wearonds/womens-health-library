---
name: branch-lifecycle
description: "Govern GitHub branch creation, stacked PR decisions, feature experiments, archival, and safe cleanup (มาตรฐาน Branch Lifecycle) for owner-managed repositories; use for branch sprawl, PR closures, archive tags, deletion requests, and reusable repository workflow design. Read-only audit first, respect target AGENTS.md, and require distinct write/merge/deploy/delete approvals."
---

# Branch Lifecycle Skill v1.0 — Evidence-first GitHub Governance

## Trigger and scope

Use when the owner requests to create a branch policy, reduce long-lived branches, review stale/diverged branches, close rejected experiments, preserve unique Git history, design archive tags, or prepare an explicitly authorized branch cleanup.

**Do not trigger** for UI design, coding features, ordinary issue triage, or releases with no branch-lifecycle decision. This Skill does not itself install into, or grant write permission for, another repository.

**Default mode: AUDIT (read-only).** A request to "check branches" authorizes inspection, not deletion, tag creation, merge, deploy, PR creation, or governance changes. A request to implement this Skill in the central warehouse authorizes that repository-only scoped change, not automatic application to other repos.

## Precedence and source of truth

1. Identify exact owner/repo, canonical development branch (which may NOT be GitHub default `main`), protected refs, and actual release/deployment mapping. Read the **target repository's** current `AGENTS.md`, lifecycle/decision documents, open PRs, and deployment gates. Owner-approved target governance takes precedence over this generic standard.
2. Retrieve fresh GitHub branch refs and **full 40-character HEAD SHAs**. Distinguish source HEAD, Merge Commit, deployed version, historical reference, and Git tag; these are not interchangeable.
3. Compare each branch to **the real canonical branch**, and, where relevant, to its own PR base and sibling lineage. `ahead_by=0` is only a Git ancestry signal; `ahead_by>0` does not prove useful unfinished work. Squash/rebase/cherry-pick can change ancestry without discarding code.
4. Check active PRs, CI/workflows, branch protection/rulesets, tags/releases, rollback pins, deploy hooks, build triggers, external dependencies and local automation as accessible. Mark unverified scopes `NOT VERIFIED`; do not invent missing permissions or positive checks.
5. Use only synthetic/example data. Never place patient identifiers, child records, credentials, secrets or protected screenshots in issue bodies, logs, skills, or evidence.

## Default architecture for new work

**One Issue → one primary feature/fix branch → one reviewable PR** is the default, not an absolute rule. Commit multiple checkpoints on the same branch instead of making a new branch for every test or prompt.

Allow an exception only with recorded rationale:
- **Stacked PRs:** independently reviewable dependencies with explicit base/head order and eventual unwind/retarget plan.
- **Security or data isolation:** risky experimental work kept separate from active integration/release refs.
- **Competing architecture spikes:** distinct alternatives with decision criteria, owner, decision deadline or checkpoint, and retirement plan.
- **Release/hotfix or rollback pins:** retain only under the repository's release governance.

Before opening a child branch, ask: "Could this be another commit on an existing scoped branch?" If yes, prefer a commit. Avoid nested temporary branches as a way to remember progress; commits, QA artifacts and a handoff/checkpoint normally suffice.

Use clear names (examples: `feat/<issue>-short-scope`, `fix/<issue>-short-scope`, `spike/<issue>-hypothesis`), adapting to the target repo's naming rules. Avoid arbitrary branching quotas.

## Branch lifecycle state machine

| State | Entry criterion | Next decision |
| --- | --- | --- |
| `ACTIVE` | Linked task + scope + owner and current PR | Commit/QA/review |
| `REVIEW` | PR ready with exact HEAD and evidence | Merge, reject, hold |
| `MERGED` | GitHub confirms merge into intended base | Verify downstream dependencies and cleanup |
| `SUPERSEDED` | Replacement path chosen and recorded | Preserve novel history if needed, then archive/cleanup |
| `REJECTED` | Owner rejects approach or prototype | Record why; do not reopen as pending work |
| `HOLD` | Unresolved gate, owner decision or dependency | Preserve ref, assign next action |
| `ARCHIVED` | Exact SHA retained through approved durable ref and verified | Delete branch only after its own gate |
| `RETAIN` | Canonical/default, release/rollback/protected or active external pin | No deletion |

`CLOSED` PR is **not** equivalent to `MERGED`; differentiate rejected/superseded and unmerged experiments. `MERGED` does **not** prove deployed. Never resurrect rejected ideas solely because an unmerged PR exists.

## Modes

### 1. AUDIT — always first, no changes
- Inventory all branches including pagination, full HEAD SHA, protected/default/canonical status, PR state, canonical comparison, and dependency evidence.
- Classify each as `RETAIN / MERGED-CLEANUP-CANDIDATE / ARCHIVE-FIRST / REJECTED / SUPERSEDED / HOLD`; state why and confidence.
- Identify truly unique history and propose the **fewest archive refs that preserve all required tips**, using exact Git ancestry rather than number of branches or file similarity. Do not claim tags exist until read-back.
- Produce a proposed decision record using [template](templates/BRANCH_DECISION_RECORD.template.md) and apply [gates](references/decision-gates.md). Never turn an audit into a surprise cleanup.

### 2. POLICY — approved repository standard
- Write a scoped policy/AGENTS instruction or Skill integration only after checking the target's existing rules. Prefer updating existing lifecycle docs to creating duplicates.
- Define default workflow, exceptions, PR closeout decisions, evidence fields and change-approval boundaries.
- Review diff and run validation; submit a PR. A warehouse publication is NOT equivalent to installation or permission in another repository.

### 3. ARCHIVE — specifically authorized write
- Re-fetch exact current tip SHAs; stop on drift. Determine if unique commits are reachable from durable existing refs.
- If required and explicitly approved, create **annotated/protected archival tags** at exact existing SHAs; read back actual refs and resolve annotated tag objects to commit SHAs. Tags can be moved/deleted unless rulesets restrict them; do not falsely claim intrinsic immutability.
- Verify every required branch tip is an ancestor of at least one retained tag/commit (100% coverage). Document tag names, commit targets, branch set, provenance, and QA. **No branch deletion in this mode.**

### 4. CLEANUP — separately authorized deletion
- Require an explicit deletion scope naming branch refs and an applicable owner-approved governance rule or exception. A general "tidy up" is not permission to discard unique history.
- Before each delete: confirm fresh full HEAD SHA and compare to approved ledger, no open PR head/protection/default/canonical/ref pin/external consumer, verified archive reachability if relevant, and no project-specific blocker.
- Delete **only exact eligible refs**, not wildcards; stop if SHA drifts, dependency is unknown, any gate fails or tool is unavailable. Never substitute force-moves/renames/empty commits for deletion.
- Read back deleted ref absence and retained archive refs; verify canonical/default and production deployment unchanged. Issue/PR closure is independent. Do not claim deletion without remote read-back.

## Mandatory decision gates

`G0` identity and authority → `G1` exact Git/PR inventory → `G2` CI and dependency audit → `G3` policy and preservation decision → `G4` separately approved archive creation + 100% reachability → `G5` separately approved deletion → `G6` post-action read-back.

Approval to **create a PR** is not permission to merge. Approval to **merge** is not permission to deploy. Approval to **archive** is not permission to delete. Some projects explicitly prohibit deletion while `ahead_by>0`; in those cases stop until the owner approves a scoped policy exception, even if tags exist.

See [decision gates and detailed evidence requirements](references/decision-gates.md).

## Output contract

Thai executive summary first; report `DONE / HOLD / NOT VERIFIED` per step, exact repo/base/HEAD, checked timestamp, categorized branch table, PR and QA evidence, archive/tag status (`PROPOSED` vs `CREATED_AND_READ_BACK`), dependency gaps, approval gates and next safe action. Include precise count and names for destructive scopes. Do not infer remote success from a command or plan.

**No destructive actions, branch force pushes, Merge, Deploy, secrets, access-policy, data restore or production writes by default.**
