<!--
DRAFT, not submitted. Target: https://github.com/pcvelz/superpowers/issues
Before posting: re-check that no newer release already fixes this, and remove this comment.
-->

# `stop-wait-guard.sh` never fires: it looks for tasks in `session-<sid8>/`, Claude Code writes them to `<session_id>/`

## Summary

`hooks/examples/stop-wait-guard.sh` looks for the session's in-progress task in
`~/.claude/tasks/session-<first 8 chars of session_id>/`. Claude Code 2.1.303 writes task
files to `~/.claude/tasks/<full session_id>/`. The guard never finds a task, logs
`allow|no-in-progress-task`, and lets every stop through, so the failure it exists to catch
(a turn that ends on "waiting for…" during plan execution) is never caught.

This happens on every platform, not just Windows: the folder name is wrong regardless of OS.

## Environment

- Claude Code 2.1.303
- superpowers-extended-cc 6.5.3-dev (marketplace checkout `cb12f4f`); `hooks/examples/stop-wait-guard.sh` on `main` is identical
- Observed on Windows 11 (Git Bash 5.2.37, Python 3.12.10, jq 1.8.2)

## Where it happens

`hooks/examples/stop-wait-guard.sh`, line 91:

```bash
TASKS_DIR="${SUPERPOWERS_TASKS_DIR:-$HOME/.claude/tasks}/session-$SID8"
```

What Claude Code actually writes for a session `24a1b368-eead-…`:

```
~/.claude/tasks/24a1b368-eead-4757-aeb9-03e3b6430f4c/1.json
~/.claude/tasks/24a1b368-eead-4757-aeb9-03e3b6430f4c/.lock
```

```json
{ "id": "1", "subject": "Task 1: Check the health endpoint", "description": "…", "status": "in_progress", "blocks": [], "blockedBy": [] }
```

`~/.claude/tasks/session-24a1b368/` doesn't exist. The task file format is exactly what the
script parses; only the folder name differs.

## Reproduction

1. Register the guard as documented in its header (Stop hook).
2. In a session where executing-plans is active, create a task, set it to `in_progress`, and
   end the turn with text only, for example "Waiting for the health check; I will continue once it reports."
3. The stop goes through. The trace log (`SUPERPOWERS_WAIT_GUARD_TRACE`) shows:

```
stop-wait-guard | session=24a1b368 | allow|no-in-progress-task | tasks_dir=…/.claude/tasks/session-24a1b368
```

I reproduced this in a real headless Claude Code session (`claude -p`) with the hook registered
in the project's `.claude/settings.json`. The guard was armed and the wait phrase matched, but no
task was found.

## Results

Same real transcript and task file, with the script's lookup as-is and with the task file
copied into the folder the script expects:

| Task file location                                  | Result                                     |
|-----------------------------------------------------|--------------------------------------------|
| where Claude Code writes it (`<session_id>/`)       | exit 0, `allow\|no-in-progress-task`       |
| copied to `session-<sid8>/` (the expected folder)   | exit 2, `block\|wait-phrase=Waiting for`   |

The rest of the guard (arming, wait-phrase match, task restatement) works on real data. Only the lookup fails.

## Suggested fix

Prefer the current layout and keep the old one as a fallback:

```diff
 [[ -z "$TRANSCRIPT_PATH" || ! -f "$TRANSCRIPT_PATH" ]] && exit 0
-TASKS_DIR="${SUPERPOWERS_TASKS_DIR:-$HOME/.claude/tasks}/session-$SID8"
+TASKS_ROOT="${SUPERPOWERS_TASKS_DIR:-$HOME/.claude/tasks}"
+# Claude Code stores a session's tasks in <root>/<session_id>/; older layouts used
+# <root>/session-<sid8>/. Prefer the current layout, fall back to the old one.
+if [[ -n "$SESSION_ID" && -d "$TASKS_ROOT/$SESSION_ID" ]]; then
+    TASKS_DIR="$TASKS_ROOT/$SESSION_ID"
+else
+    TASKS_DIR="$TASKS_ROOT/session-$SID8"
+fi
```

Tested with a patched copy against real sessions and the real `~/.claude/tasks` (read only):

| Case                                                       | Current | Patched |
|------------------------------------------------------------|---------|---------|
| wait session, task in progress (two separate sessions)     | exit 0  | exit 2  |
| ordinary session, executing-plans never ran                | exit 0  | exit 0 (`not-armed`) |
| old `session-<sid8>` layout via `SUPERPOWERS_TASKS_DIR`    | exit 2  | exit 2  |
| no `session_id` / no transcript in the hook input          | exit 0  | exit 0  |

`SESSION_ID` falls back to the transcript file name (line 80), so this also covers inputs
without `session_id`. The `-n` check stops an empty id from resolving to the tasks root.

## Note for Windows users

The same script reads task files with `json.load(open(fp))` (line 172). On Windows with
Python before 3.15, that decodes as cp1252 and fails for subjects or descriptions containing
characters such as `”`, so the task is skipped. Even with the folder fixed, the hook needs
`PYTHONUTF8=1` or `open(fp, encoding="utf-8")` there. The same decoding problem in the two
user-gate hooks is described in the "transcript decoding on Windows" section of the
`run-hook.cmd` exit-code report.
