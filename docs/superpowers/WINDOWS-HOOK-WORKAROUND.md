# Superpowers on Windows: project-level fixes

Project-level fixes for bugs in the superpowers-extended-cc plugin, checked against plugin
6.5.3-dev (marketplace checkout `cb12f4f`) and Claude Code 2.1.303 on Windows 11. Nothing
here changes `~/.claude/settings.json` or the installed plugin files.

## Files

| File | Purpose |
|------|---------|
| `.claude/settings.json` | Registers the hooks below |
| `.claude/hooks/superpowers/stop-wait-guard-shim.sh` | Fix 3: runs the plugin's wait guard with the task folder it expects |
| `.claude/hooks/superpowers/stop-revalidate-user-gates.sh` | Fix 4: patched copy of the plan-complete gate |
| `.claude/hooks/superpowers/post-task-complete-revalidate.sh` | Fix 5: patched copy of the task-close gate |
| `.claude/hooks/superpowers/LICENSE` | The plugin's MIT license, which covers the two copies |
| `docs/superpowers/model-routing.json` | Model routing tiers (mechanical→haiku, standard→sonnet, frontier→session model) |

## Hooks registered in `.claude/settings.json`

| Event | Matcher | Runs | Fix |
|-------|---------|------|-----|
| `SessionStart` | (all) | plugin `hooks/check-onboard-drift` | none (opt-in update notice) |
| `PreToolUse` | `TaskCreate` | plugin `pre-taskcreate-model-tier`, `pre-taskcreate-commit-strategy` | 1 |
| `PreToolUse` | `Agent` | plugin `pre-agent-model-routing` | 1 |
| `PreToolUse` | `AskUserQuestion` | plugin `pre-askuser-handoff-guard` | 1 |
| `PostToolUse` | `TaskUpdate` | project copy `post-task-complete-revalidate.sh` | 2, 5 |
| `Stop` | (all) | project copy `stop-revalidate-user-gates.sh` | 2, 4 |
| `Stop` | (all) | project `stop-wait-guard-shim.sh` → plugin `stop-wait-guard.sh` | 2, 3 |

## Fix 1: the plugin's Windows wrapper loses exit codes (PreToolUse gates)

The plugin runs its four PreToolUse gates through `hooks/run-hook.cmd`. On Windows that
wrapper always exits 0, because `cmd.exe` expands `%ERRORLEVEL%` inside an `if ( )` block
before bash runs. Claude Code only blocks on exit 2, so these gates never block. The project
runs the same four scripts directly with `bash`, so a block reaches Claude Code.

**The checks are duplicated.** The plugin's own copies still run on every `TaskCreate`,
`Agent` and `AskUserQuestion` call (a plugin's hooks can't be switched off individually).
Each check runs twice and the trace log shows two lines per decision. Only the project copy
can block; the plugin copy's exit 0 is ignored. On allowed calls both return `allow`.

## Fix 2: transcript encoding (`PYTHONUTF8=1`)

The three user-gate hooks (task-close, plan-complete, wait guard) read the transcript or
task files with Python's `open()` in text mode. On Windows, Python 3.12 decodes that as
cp1252, which fails on bytes real transcripts contain (for example in `”`). The hooks then
work from empty data: the plan-complete gate misses gates, and the task-close gate flags
tasks for the wrong reason. Their commands start with `PYTHONUTF8=1`, which makes Python read
UTF-8. The PreToolUse gates read in binary mode and don't need it.

## Fix 3: wait guard can't find tasks (project shim)

Claude Code writes a session's tasks to `~/.claude/tasks/<session_id>/`; the plugin's
`stop-wait-guard.sh` looks in `~/.claude/tasks/session-<first 8 chars>/` and so never finds
the in-progress task. The shim copies that session's task files into a fresh `mktemp -d`
folder laid out the way the guard expects, runs the **unmodified** plugin script against it,
passes its output and exit code through, and then removes only the files and two folders it
created (`rm -f` on the copied `*.json`, then `rmdir`, which refuses non-empty folders).
In every other case it runs the guard unchanged.

The shim uses lowercase variable names only. An earlier version reused `TMP`, which Windows
already sets to the user's temp folder, and deleted that folder's contents whenever it
didn't remap. It's fixed, and it's tested against a decoy `TMP` folder.

## Fix 4: plan-complete gate ignores evidence posted before the close (patched copy)

Upstream's plan-complete gate only counts `AC: … PROVEN BY …` lines posted **after** a gate
task was closed, while the task-close gate counts them from when the task last went
`in_progress`. The project copy uses the task-close gate's window: proof since the task last
went `in_progress`, or anywhere in the transcript if it never did. A gate with no proof at
all is still blocked.

## Fix 5: task-close gate also nags ordinary tasks (patched copy)

The script's header and the plugin README say non-gate tasks "pass through silently", but
the code also sends a "task closed without assessment" reminder whenever an ordinary task is
closed without words like "done" or "tested" since it started. That's how Claude usually
works (tool calls first, summary after), so it fired on routine work. The project copy lets
non-gate tasks through silently. User-gate tasks are checked exactly as upstream checks them.

## Known limitations

- **Duplicated PreToolUse checks** (Fix 1). Harmless, about a second of extra hook time per call.
- **The two patched copies are frozen at `cb12f4f`.** Plugin updates to those two scripts
  don't reach this project until the copies are removed (see below).
- **User confirmation counts differently.** For a gate task, the task-close gate also accepts
  a message from you during the task as verification, and treats any message as verification
  if the task never went `in_progress`. The plan-complete gate only accepts `AC: … PROVEN BY …`
  lines, so a gate you confirmed in chat still needs one evidence line before "plan complete".
- **The commit-strategy and handoff gates were only tested offline.** Commit-strategy is
  inactive here (there's no `docs/superpowers/workflow.json`). The handoff guard only arms
  after the writing-plans skill creates tasks.
- **Every hook fails open.** Without `jq` and `python3` on PATH, they quietly allow everything.

## Requirements on this machine

- `jq` on PATH (installed with winget, `jqlang.jq`).
- `python3` on PATH that isn't the Microsoft Store shortcut (here: a `python3.exe` copy in
  the user's Python 3.12 folder).
- Restart Claude Code after changing PATH; hooks inherit PATH when Claude Code starts.

## Removing the fixes once upstream catches up

Update first (`/plugin marketplace update superpowers-extended-cc-marketplace`), then for each fix:

- **Fix 1.** In Git Bash from the project root, this should print `exit 2`. If it does,
  delete the `"PreToolUse": [ ... ]` block from `.claude/settings.json`:

  ```bash
  printf '%s' '{"tool_name":"TaskCreate","cwd":"'"$(pwd -W)"'","tool_input":{"subject":"Task 1: Test","description":"**Goal:** test"}}' \
    | bash -c '"$HOME/.claude/plugins/marketplaces/superpowers-extended-cc-marketplace/hooks/run-hook.cmd" pre-taskcreate-model-tier' >/dev/null 2>&1; echo "exit $?"
  ```

- **Fix 2.** Drop the `PYTHONUTF8=1` prefixes once those scripts open files with
  `encoding="utf-8"` or in binary mode, or once `python3` here is Python 3.15+, where UTF-8
  mode is the default.
- **Fix 3.** Once `hooks/examples/stop-wait-guard.sh` looks in `<tasks root>/<session_id>/`,
  point the wait-guard `Stop` command back at
  `bash ~/.claude/plugins/marketplaces/superpowers-extended-cc-marketplace/hooks/examples/stop-wait-guard.sh`
  (keep the prefix while Fix 2 applies) and delete the shim.
- **Fixes 4 and 5.** Once upstream counts evidence from `in_progress` (4) and lets non-gate
  tasks through (5), point the `Stop` and `PostToolUse` commands back at
  `~/.claude/plugins/marketplaces/superpowers-extended-cc-marketplace/hooks/examples/<script>`
  and delete the copies. Delete `LICENSE` once no copy is left.

Restart Claude Code after any change. Drafts of the upstream bug reports are next to this
file (`upstream-issue-draft-*.md`); they haven't been submitted.
