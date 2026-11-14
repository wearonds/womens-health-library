# Branch Lifecycle — Decision Record

> Fill placeholders from verified live GitHub and deployment metadata. This form is **not** an authorization to mutate refs.

**Audit date / timezone:** YYYY-MM-DD HH:MM TZ
**Repository:** owner/repo
**Current canonical ref / exact SHA:** refs/heads/... / 40-char SHA
**GitHub default ref / exact SHA:** refs/heads/... / 40-char SHA
**Scope:** READ-ONLY AUDIT | POLICY PROPOSAL | APPROVED ARCHIVE | APPROVED CLEANUP
**Owner governance reference / applicable rule:** path + exact ref
**Unverified dependencies:** ...

## Branch decisions

| Branch ref | Exact HEAD SHA | PR / decision | Ahead / behind vs canonical | Unique history? | External / CI / deploy refs | Action | Archive tag / exact target | Gate / owner authorization |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| refs/heads/example | 40-char SHA | #... CLOSED UNMERGED / SUPERSEDED | A / B | YES / NO / UNKNOWN | VERIFIED / NOT VERIFIED | RETAIN / ARCHIVE-FIRST / HOLD / CLEANUP-CANDIDATE | PROPOSED (not created) | HOLD |

## Approval and evidence ledger

| Gate | PASS / FAIL / NOT VERIFIED / HOLD | Exact evidence / link | Approved action and approver |
| --- | --- | --- | --- |
| G0 identity and authority | | | |
| G1 fresh HEAD and PR inventory | | | |
| G2 CI + external dependency audit | | | |
| G3 governance and preservation | | | |
| G4 tags created/read back + all tips reachable | | | |
| G5 separate deletion approval and exact deletes | | | |
| G6 post-action read-back of refs and deployments | | | |

## Archive coverage ledger

| Proposed tag | Target full 40-char commit SHA | Tag object SHA (if annotated) | Resolved commit read-back | Required tip SHAs covered |
| --- | --- | --- | --- | --- |
| archive/example | ... | NOT CREATED | NOT VERIFIED | ... |

**Coverage assertion:** 0/N before creation; N/N PASS required before deletion.

## Closure

**Changes actually performed:** GitHub writes ..., tags created ..., branches deleted ..., merges ..., deployments ...
**Default + canonical ref unchanged:** PASS / FAIL / NOT VERIFIED
**Production deployment unchanged:** PASS / FAIL / NOT VERIFIED
**Remaining HOLD and explicit next action:** ...
**Final state:** DONE / HOLD / NOT VERIFIED
