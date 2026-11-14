# Branch Lifecycle v1.0 — Decision Gates and Audit Method

Only load when auditing, archiving or cleaning branches. Target-repo `AGENTS.md` and existing branch governance override this shared guidance.

## 1. Evidence collection checklist

| Field | Minimum evidence | Why it matters |
| --- | --- | --- |
| Identity | Exact `owner/repo`, canonical ref, default ref and SHA | `main` may be historical |
| Branch | Full `refs/heads/<name>`, 40-char current HEAD SHA, protection/rulesets | Prevent accidental/wrong-ref delete |
| PR | Head/base, exact PR status, merged flag, merge SHA, issues/decision | Closed does not mean merged |
| History | Ahead/behind **vs canonical** and **vs intended PR base**, ancestry and changed files | Squash/rebase distort ahead alone |
| Quality | Latest CI tests by exact SHA and QA gaps | Avoid claiming stale QA |
| Dependencies | Workflows, schedules, deployment/build hooks, release/rollback pins, external integrations, cross-repo refs and clones | A ref name can be operationally referenced |
| Preservation | Existing tag/ref reachability, new tag proposal and target commit | Preserve unique experimental history |
| Owner authorization | Recorded scoped policy decision, archive permission and deletion permission | No inferred destructive approval |
| Read-back | New tag refs and branch absence, canonical/default/deploy unchanged | Proves actual result |

If you cannot access a dependency source (e.g. external Cloudflare configuration or local clones), write `NOT VERIFIED`; never claim an exhaustive all-clear.

## 2. Lifecycle decisions

**MERGED-CLEANUP-CANDIDATE:** GitHub confirms PR merged and dependent branches/workflows need no ref; preserve if needed. May be deleted under target policy and explicit scope.

**ARCHIVE-FIRST:** Unique commits are not reachable from preserved refs. PR may be rejected, superseded or an unmerged stacked experiment. Record reason and retain until approved archival verified.

**REJECTED / SUPERSEDED:** Decision is final for task-board purposes unless owner reopens it. Close/cancel work items; preserving a ref does not mean work should be resumed.

**HOLD:** Unverified protection, active dependency, mismatch, unresolved approval, suspected production/rollback pin, or inability to read refs. Never relabel HOLD as safe merely due to elapsed time.

**RETAIN:** Current canonical, GitHub default, protected, deployment pin or release branch with unexpired purpose. Default and canonical may be different; preserve both until explicitly re-governed.

## 3. Safe tag-first archival

Use tags only when the target project allows them and owner approved. Tagging is a Git reference write, not a purely documentary step.

1. Freeze a manifest of all exact branch `refs/heads`, full tip SHAs, PR decision, retention reason, archive tag names/targets, external consumers and expected final refs.
2. Refresh HEAD and canonical refs just before creating each tag. Stop if the ledger is stale.
3. Prefer annotated tags in a stable `archive/<project>-<scope>-<date>` namespace and protect with tag rulesets if possible. **Never reuse or force-move a tag.** When tags are not yet present, say `PROPOSED`, not `ARCHIVED`.
4. Read back tag objects; annotated tags point to a *tag object*, which must be dereferenced to the commit. Confirm exact target SHA.
5. For every branch tip you intend to delete, prove `tip` is an ancestor of at least one archived commit/tag (`git merge-base --is-ancestor <tip-sha> <archive-commit-sha>`, or equivalent verified remote comparison). `ahead_by=0` alone is insufficient.
6. Keep the audit manifest with the associated Issue/PR. Preserve review comments, QA receipts and rationale; tags do not preserve uncommitted content or deleted external artifacts.

**Minimum gate:** 100% tips covered and exact targets verified. If 23/24 pass, delete **none** until scope is corrected or explicitly narrowed.

## 4. Exact deletion and rollback limitations

Before deletion ensure the tool allows a real delete of the exact `refs/heads/<name>`. Never use `update_ref`, force-push, tag creation in a branch namespace, or a new empty commit as a fake deletion.

Deletion requires: explicit owner approval naming scope, target-policy allowance/exception, validated archiving for novel history, no open PR pointing to the branch, no protection/ruleset block, no active Actions trigger/runtime/deploy/rollback dependency, fresh SHA match and post-action read-back.

**Operational caution:** A Git branch deletion does not necessarily stop a running deployment, and a tag does not restore a Cloudflare Worker, Durable Object, Access policy, database or secrets. Rollback and live recovery require their own approvals and runbooks.

If GitHub/Work/CLI cannot create a tag or delete a ref, report the exact blocker, preserve all refs, and prepare an execution handoff with deterministic SHA checks; never claim completion.

## 5. Review, closeout and cadence

- Before PR: issue ID, branch rationale, exception (if stacked/spike), exact base/ref, QA plan, owner decision gate.
- At PR closure: record `MERGED / REJECTED / SUPERSEDED / HOLD`, acceptance evidence, deferred work, archive requirement and safe ref-cleanup decision.
- After a merge: do not delete a branch until downstream branches, CI and release pins no longer depend on it.
- At milestone closeout: audit unfinished experiments and propose retention/archival/cleanup. No automatic deletion timer for branches with unique data or governance holds.
- Target repositories may configure `Automatically delete head branches` **only after** confirming it cannot erase required pins, unmerged history or stacked dependencies.
- Avoid hard limits (e.g. five branches maximum); measure stale refs without disposition, duplicated checkpoint branches, unowned experimental forks and age of pending decisions.

## 6. Illustrative decision examples (not permission)

| Example | Git state | Correct next move |
| --- | --- | --- |
| Merged fix, no refs depend | `ahead=0` vs canonical | Verify external refs, then owner-approved cleanup |
| Closed-unmerged prototype | `ahead>0` vs canonical | Owner decision + tag-first if preserving code |
| Stacked PR child | Parent branch is PR base | Keep parent until downstream retarget/merge |
| Historical default `main` | Diverged vs canonical | Retain, do not infer stale |
| Expired spike and no unique commits | No active consumers | Record rejection and cleanup under policy |
