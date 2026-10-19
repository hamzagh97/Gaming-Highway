<!--
DRAFT, not submitted. Target: https://github.com/pcvelz/superpowers/issues
Before posting: re-check that no newer release already fixes this, and remove this comment.
-->

# Plan-complete stop gate ignores evidence posted before the gate task was closed

## Summary

The two user-gate hooks accept evidence from different places in the transcript:

- `post-task-complete-revalidate.sh` (task close) accepts an `AC: … PROVEN BY …` line posted
  any time **since the task last went `in_progress`**.
- `stop-revalidate-user-gates.sh` (plan complete) accepts it only **after the task was closed**.

A correct sequence (post the evidence, then close the gate task, then say "plan complete")
passes the task-close hook but is still blocked by the stop gate. The agent then has to repeat
evidence it already posted. In my test the model read the block as "your evidence doesn't count"
and reopened the task instead of finishing.

## Environment

- Claude Code 2.1.303
- superpowers-extended-cc 6.5.3-dev (marketplace checkout `cb12f4f`); `hooks/examples/stop-revalidate-user-gates.sh` on `main` is identical
- Observed on Windows 11 (Git Bash 5.2.37, Python 3.12.10 with `PYTHONUTF8=1`, jq 1.8.2). The logic involved has nothing platform-specific in it.

## Where it happens

`hooks/examples/stop-revalidate-user-gates.sh`, lines 179–181:

```python
close_idx = t["closedAtIdx"] or 0
for (i, txt) in assistant_texts:
    if i <= close_idx:
        continue
```

versus `hooks/examples/post-task-complete-revalidate.sh`, lines 204–208:

```python
scan_from = last_inprogress_idx if last_inprogress_idx >= 0 else 0
ac_re = re.compile(r"\bAC\s*:", re.IGNORECASE)
pb_re = re.compile(r"\bPROVEN\s+BY\b", re.IGNORECASE)
for (i, txt) in text_indices:
    if i < scan_from:
```

## Reproduction (real headless session, both hooks registered)

1. `TaskCreate` a gate task (`json:metadata` with `"userGate": true, "tags": ["user-gate"], "acceptanceCriteria": ["GET /platforms returns 200"]`).
2. `TaskUpdate` it to `in_progress`.
3. Assistant writes: `AC: GET /platforms returns 200 — PROVEN BY curl -i output (HTTP/1.1 200 OK)`
4. `TaskUpdate` it to `completed`.
5. Assistant writes: `Plan complete — all tasks done.`

Trace:

```
post-complete   | task=1 | parsed | userGate=true tags=[user-gate] ac=1 evidence=true …
post-complete   | task=1 | pass   | gate-evidence-on-record
stop-revalidate | scanned | tasks=1 claim=true blocked_gates=1
stop-revalidate | block   | unproven_gates=1
```

The task-close hook accepts the evidence and the stop gate rejects the same evidence.

## Suggested fix

Track when each task last went `in_progress` and use exactly the task-close hook's window:
proof since then, or anywhere in the transcript if the task never went `in_progress`:

```diff
                     "closedAtIdx": None,
+                    "inProgressIdx": None,
                 }
@@
                         if new_status == "completed":
                             tasks[tid]["closedAtIdx"] = idx
+                        elif new_status == "in_progress":
+                            tasks[tid]["inProgressIdx"] = idx
@@
-        # Look for per-criterion proof markers in assistant text after close.
+        # Look for per-criterion proof markers in assistant text since the task
+        # last went in_progress, or anywhere if it never did (the same window as
+        # post-task-complete-revalidate.sh).
         proof_found = False
-        close_idx = t["closedAtIdx"] or 0
+        scan_from = t["inProgressIdx"] if t["inProgressIdx"] is not None else 0
         for (i, txt) in assistant_texts:
-            if i <= close_idx:
+            if i < scan_from:
                 continue
```

Tested with a patched copy against real transcripts cut at the "Plan complete" message, plus fixtures:

| Case                                                      | Current         | Patched         |
|-----------------------------------------------------------|-----------------|-----------------|
| evidence posted before the close (real session)           | exit 2 (block)  | exit 0 (pass)   |
| gate closed with no evidence at all (real session)        | exit 2 (block)  | exit 2 (block)  |
| evidence posted after the close (fixture)                 | exit 0          | exit 0          |
| gate never `in_progress`, evidence before close (fixture) | exit 2 (block)  | exit 0 (pass)   |
| gate never `in_progress`, no evidence (fixture)           | exit 2          | exit 2          |
| live session: evidence before close, then "Plan complete" | blocked         | not blocked     |
| live session: no evidence, then "Plan complete"           | blocked         | blocked         |

The task-close hook decides the same way in every row above.

Gates that were closed without any evidence are still blocked. Only evidence that was already
on record stops being ignored.

## Alternative, if "after close" is intentional

If proof after the close is a deliberate requirement, say so in the block message, for example
"evidence posted before the close isn't counted; restate it". Then the agent can repeat the
evidence instead of concluding the gate failed and reopening it.
