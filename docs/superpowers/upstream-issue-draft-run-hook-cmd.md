<!--
DRAFT, not submitted. Target: https://github.com/pcvelz/superpowers/issues
Before posting: re-check that no newer release already fixes this, and remove this comment.
-->

# Windows: `run-hook.cmd` always exits 0, so PreToolUse gates never block

## Summary

On Windows, `hooks/run-hook.cmd` drops the exit code of the hook script it runs. When a
gate script exits 2 (block), the wrapper exits 0, so Claude Code neither blocks the tool
call nor shows the gate's message (it ignores stderr on exit 0). All four PreToolUse gates
in `hooks/hooks.json` are affected: they reach the right decision but can't enforce it.

This is a different bug from #22 (CRLF `$'\r'`) and #27 (CRLF in jq/python3 output). Both of
those are fixed in this version; the scripts themselves behave correctly.

## Environment

- Windows 11 Pro, build 26300
- Claude Code 2.1.303 (hooks run through Git Bash)
- Git for Windows 2.49.0, GNU bash 5.2.37 (`C:\Program Files\Git\bin\bash.exe`)
- superpowers-extended-cc 6.5.3-dev, marketplace checkout `cb12f4f`; `main` has the same wrapper code
- jq 1.8.2, Python 3.12.10

## Cause

Every Windows branch of the wrapper runs bash and then exits inside an `if (...)` block:

```bat
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
    exit /b %ERRORLEVEL%
)
```

`cmd.exe` expands `%ERRORLEVEL%` when it parses the whole parenthesized block, before bash
runs, so the value is the errorlevel from before the block (0). In testing, a bare
`exit /b` inside the block also returned 0.

## Minimal reproduction (no plugin code)

`repro.cmd`:

```bat
@echo off
if exist "C:\Program Files\Git\bin\bash.exe" (
    "C:\Program Files\Git\bin\bash.exe" -c "exit 2"
    exit /b %ERRORLEVEL%
)
exit /b 0
```

```
> cmd /c repro.cmd
> echo %ERRORLEVEL%
0
```

(Two separate lines on purpose: on one line, `%ERRORLEVEL%` would be expanded before `repro.cmd` runs.)

Expected `2`. Results for the same block written different ways, each run both through Git Bash
(as Claude Code runs hook commands) and through `cmd /c`:

| Variant                                                    | Git Bash | `cmd /c` |
|------------------------------------------------------------|----------|----------|
| `exit /b %ERRORLEVEL%` inside `if ( )` (current wrapper)   | 0        | 0        |
| bare `exit /b` inside `if ( )`                             | 0        | 0        |
| `setlocal EnableDelayedExpansion` + `exit /b !ERRORLEVEL!` | 2        | 2        |
| `goto` a label, then `exit /b %ERRORLEVEL%` outside blocks | 2        | 2        |
| bash as the last command, no `exit` in the block           | 2        | 2        |

## Reproduction with the plugin

From a project with `docs/superpowers/model-routing.json`, in Git Bash:

```bash
H=~/.claude/plugins/marketplaces/superpowers-extended-cc-marketplace/hooks
IN='{"tool_name":"TaskCreate","cwd":"'"$(pwd -W)"'","tool_input":{"subject":"Task 1: Add DTO","description":"**Goal:** add DTO"}}'

printf '%s' "$IN" | bash "$H/pre-taskcreate-model-tier" >/dev/null 2>&1; echo "script directly: $?"
printf '%s' "$IN" | bash -c "\"$H/run-hook.cmd\" pre-taskcreate-model-tier" >/dev/null 2>&1; echo "via wrapper:     $?"
```

```
script directly: 2
via wrapper:     0
```

The trace log records `block | plan-shaped-without-fence` for both runs, so the gate decides
correctly and only the exit code is lost.

## Results for all four gates

Failing input: each gate should block (exit 2). Passing input: each gate should allow (exit 0).

| Gate                             | Failing input                                  | Script direct | Via `run-hook.cmd` | Passing input                           | Direct / wrapper |
|----------------------------------|------------------------------------------------|---------------|--------------------|-----------------------------------------|------------------|
| `pre-taskcreate-model-tier`      | plan task without `json:metadata` fence        | 2             | **0**              | fence with `modelTier: mechanical`      | 0 / 0            |
| `pre-taskcreate-commit-strategy` | `commitStrategy: at-end`, task has a Commit step | 2           | **0**              | same task without the Commit step       | 0 / 0            |
| `pre-agent-model-routing`        | mechanical task in progress, Agent `model: opus` | 2           | **0**              | Agent `model: haiku` / `sonnet`         | 0 / 0            |
| `pre-askuser-handoff-guard`      | armed, custom menu without handoff options     | 2             | **0**              | the two handoff options / `CLARIFICATION` | 0 / 0          |

End to end in a real `claude -p` session, with the plugin's hooks plus the same four scripts
also registered directly (`bash <script>`) in the project's `.claude/settings.json`:

- TaskCreate without `modelTier` was blocked, and the error named the directly registered hook.
- An Agent call on `opus` while a mechanical task was in progress was blocked the same way; `haiku` went through.
- The trace log showed two identical decisions per call (plugin copy and direct copy); only the direct copy's exit 2 took effect.

## Suggested fix

Pick the bash path first, then run bash and exit outside any parenthesized block:

```diff
 set "HOOK_DIR=%~dp0"
 
-REM Try Git for Windows bash in standard locations
+REM Resolve bash first, then run it OUTSIDE any parenthesized block, so that
+REM %ERRORLEVEL% is read after bash exits (inside a block cmd.exe expands it
+REM when the block is parsed, which always yielded 0).
+set "HOOK_BASH="
 if exist "C:\Program Files\Git\bin\bash.exe" (
-    "C:\Program Files\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
-    exit /b %ERRORLEVEL%
-)
-if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
-    "C:\Program Files (x86)\Git\bin\bash.exe" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
-    exit /b %ERRORLEVEL%
-)
-
-REM Try bash on PATH (e.g. user-installed Git Bash, MSYS2, Cygwin)
-where bash >nul 2>nul
-if %ERRORLEVEL% equ 0 (
-    bash "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
-    exit /b %ERRORLEVEL%
+    set "HOOK_BASH=C:\Program Files\Git\bin\bash.exe"
+) else if exist "C:\Program Files (x86)\Git\bin\bash.exe" (
+    set "HOOK_BASH=C:\Program Files (x86)\Git\bin\bash.exe"
+) else (
+    where bash >nul 2>nul && set "HOOK_BASH=bash"
 )
 
 REM No bash found - exit silently rather than error
 REM (plugin still works, just without SessionStart context injection)
-exit /b 0
+if not defined HOOK_BASH exit /b 0
+
+"%HOOK_BASH%" "%HOOK_DIR%%~1" %2 %3 %4 %5 %6 %7 %8 %9
+exit /b %ERRORLEVEL%
 CMDBLOCK
```

Tested with a patched copy of the wrapper and the real `pre-taskcreate-model-tier`:

| Case                                                       | Current wrapper | Patched wrapper |
|------------------------------------------------------------|-----------------|-----------------|
| failing input (should block)                               | 0               | 2               |
| passing input (should allow; stdout `permissionDecision: allow` kept) | 0    | 0               |
| Unix branch (`bash run-hook.cmd ...`)                      | 2               | 2               |

`setlocal EnableDelayedExpansion` + `!ERRORLEVEL!` also works, but delayed expansion would
mangle any `!` in the hook directory path or arguments, so the version above is safer.

## Workaround until fixed

Register the four scripts directly in the project's `.claude/settings.json`
(`"command": "bash ~/.claude/plugins/marketplaces/superpowers-extended-cc-marketplace/hooks/<script>"`,
with matchers `TaskCreate` ×2, `Agent`, `AskUserQuestion`). Each check then runs twice, but the
direct copy's exit 2 reaches Claude Code.

## Possibly related, probably a separate issue: transcript decoding on Windows

`hooks/examples/post-task-complete-revalidate.sh` and `hooks/examples/stop-revalidate-user-gates.sh`
read the transcript with `open(path)` in text mode, and `stop-wait-guard.sh` reads task
files with `json.load(open(fp))`. On Windows, Python before 3.15 decodes these as cp1252
unless UTF-8 mode is on. Real transcripts contain byte `0x9d` (part of the UTF-8 `”`),
which cp1252 can't decode:

```
UnicodeDecodeError: 'charmap' codec can't decode byte 0x9d in position 1610
```

The parse falls back to empty results:
- the stop gate sees `tasks=0` and never blocks;
- the task-close gate sees no gate metadata and fails with a generic `silent-close` block in place of the gate's own message.

Running with `PYTHONUTF8=1`, or using `open(path, encoding="utf-8")` (or `"rb"`, as the
routing gates already do), fixes both. Verified on the same machine.
