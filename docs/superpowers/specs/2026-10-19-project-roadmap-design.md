# Design: running Gaming Highway TN the Superpowers way

Date: 2026-10-19. Status: approved by the owner on 2026-10-19; sections 6 and 7 corrected after the review on 2026-10-20.

## 1. Purpose

The owner (Hamza) wants two things at once:

1. Finish the shop (a real NestJS backend for the Next.js storefront).
2. Learn to develop **the way Claude and Superpowers do**: decide first, design small, plan in tasks, write the test first, prove with evidence, review, then merge.

The project is the classroom. Every piece of work goes through the same loop, and the owner practises the human role at each step.

## 2. Scope

**In scope**

- A new plan file, `docs/superpowers/plans/2026-10-19-project-master-plan.md`: a playbook (the loop, explained with examples from this project) plus a roadmap for phases 0 to 10.
- A detailed task plan for the rest of Phase 1 (the first live run of the loop), inside that plan file.
- Edits to `BACKEND-PLAN.md` so it matches reality and points to the loop.

**Out of scope**

- Any change in `Backend/` or `Frontend/`. The owner types all application code.
- Git commits, pushes and pull requests. The owner runs git; Claude reviews the result.
- Detailed plans for phases 2 to 10. Each one gets its own design and plan when it starts, because those phases depend on decisions not made yet.

## 3. Roles

|           | Owner                                                           | Claude                                                   |
| --------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| Decisions | Decides at every gate (what, why, approve design, approve plan) | Asks one question at a time, gives a recommendation      |
| Code      | Types it                                                        | Explains, gives tested hints or snippets, reviews        |
| Proof     | Runs the checks they can                                        | Runs read-only checks and shows the real output          |
| Git       | Runs branch, commit, push, merge                                | Reviews `git status` and the diff, never commits unasked |

## 4. The loop

| #   | Step       | Superpowers skill                             | Output                                                                                                                                            | Example from this project                            |
| --- | ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | Brainstorm | brainstorming                                 | A decision, made in chat                                                                                                                          | "Keep our error shape or switch to Nest's?"          |
| 2   | Design     | brainstorming                                 | Short design in chat (bounded) or a spec file (architectural). The owner approves before anything is built.                                       | Origin-only `FRONTEND_URL`                           |
| 3   | Plan       | writing-plans                                 | Small tasks: files, acceptance criteria, a command that proves each                                                                               | The Phase 1 task list in section 7                   |
| 4   | Test first | test-driven-development                       | A failing test, then the code that passes it. For code that already exists: write the test, break the code on purpose, watch it fail, restore it. | A test for the 413 bug                               |
| 5   | Verify     | verification-before-completion                | The command output, shown. No "done" without it.                                                                                                  | The audit found the 413 bug by sending real requests |
| 6   | Review     | requesting-code-review, receiving-code-review | A second look for what was missed: inputs, security, failures, environments, operations                                                           | The audit of Phase 0 and 1                           |
| 7   | Finish     | finishing-a-development-branch                | Branch, pull request, CI green, merge                                                                                                             | Phase 1 PR #1                                        |

**Which path.** Every request is classified first: _spike_ (a question, throwaway answer), _bounded_ (a change to code that exists: short design in chat), or _architectural_ (new subsystem or project: written spec, then plan). When in doubt, take the heavier path. Approval is always required; only the size of the document changes.

## 5. How the setup behaves here (files read on 2026-10-19; the hooks were not run)

- The Superpowers plugin (6.5.3-dev) is an unmodified clone of its upstream repository (no local changes in git), so the skills are the original ones.
- The project adds Windows workarounds for plugin hooks (`docs/superpowers/WINDOWS-HOOK-WORKAROUND.md`). Two scripts are patched copies and, per that write-up, the PreToolUse checks run twice. These affect enforcement at the edges, not the skills.
- `TaskCreate` is not available in this setup, so `TodoWrite` tracks progress.
- `subagent-driven-development` and `executing-plans` are not used to write the owner's code. Agents are used only for research and review.

## 6. Roadmap handling

- The owner's rule (2026-10-19): do not copy `BACKEND-PLAN.md`. Build the roadmap as if from scratch, the Superpowers way (decisions first, small testable slices, a proof for each), then compare it with `BACKEND-PLAN.md`. Keep what already fits (this includes the phase order), and add, change or remove whatever does not. If the old plan is already complete for a phase, leave it as it is.
- Phase numbers stay as in `BACKEND-PLAN.md` (0 to 10) unless the from-scratch pass shows a phase should move or split; any such change is listed for the owner to approve. Each phase block has: goal, status, dependencies, decisions to settle first, which loop steps apply, and "done when".
- Phases 0 and 1 are described fully. Phases 2 to 10 are outlines. When a phase starts, the owner and Claude run brainstorm, design and plan for it.
- Decisions that gate later phases (corrected in the 2026-10-20 review): confirm Prisma before Phase 2; domain and hosting before Phase 3; bot protection service before Phase 4; guest checkout or account required before Phase 6; payment gateway before Phase 7 (application started now); email provider before Phase 8 (Phase 4 prints emails to the console); keys in the email or only on the site before Phase 8; where the admin screens live before Phase 9.

## 7. Phase 1 remainder: the first live run

State on 2026-10-19 (from commands run that day): 4 unit tests and 1 e2e test pass; lint reports 2 unused imports; the `hideQuery` fix is in the filter; the request-id fixes are not applied; `error` still uses class names; `git status` shows 17 entries on `main`: the Backend audit work, plus `.claude/`, `docs/` and `Frontend/global.d.ts`, which are not audit work.

Renumbered in the 2026-10-20 review so the numbers are the order of work (the request-id tests need the shared setup first). Details: Part D of the master plan.

| Task | What                                                                                                                                                                                                       | Depends on |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| T0   | Put the Backend audit work on its own branch and remove the 2 unused imports. Decide separately what to do with `.claude/`, `docs/`, `Frontend/global.d.ts`, and whether `BACKEND-PLAN.md` goes into git. | none       |
| T1   | Unit tests for `PlatformsService` and `GenresService` (the owner's first loop)                                                                                                                             | T0         |
| T2   | Unit tests for the error filter: 413, hidden query string, clean path, safe 500 message, request id, what gets logged                                                                                      | T0         |
| T3   | Decide the error rules (`error` wording, fixed message for every 5xx), test first, then change                                                                                                             | T2         |
| T4   | One shared setup function used by `main.ts` and the e2e test, with Nest's built-in security headers; e2e tests for the real routes, CORS and headers                                                       | T3         |
| T5   | Request id: failing e2e tests first, then the middleware, logger and Swagger changes                                                                                                                       | T4         |
| T6   | Replace `Backend/README.md` with the real steps; decide what `.env.example` holds                                                                                                                          | T0         |
| T7   | GitHub Actions workflow with fake settings in `env:`, read-only token, no path filter                                                                                                                      | T1, T2, T5 |
| T8   | Tick `BACKEND-PLAN.md` with evidence, open the pull request, merge when CI is green                                                                                                                        | all        |

## 8. Edits to `BACKEND-PLAN.md`

The final, approved list is C1 to C12 in Part B of the master plan. The first ideas were:

- Tick the `hideQuery` item (verified present in the filter).
- Fix stale text: the Phase 0 Docker snippet (ports) and `.env` snippet (host, and `NODE_ENV`, which the validation now requires); the request-id item, which describes a replaced design.
- Add a short "The loop" section to "For every phase" and a pointer to the master plan.
- Keep the owner's decisions and tick boxes untouched.

## 9. How we judge whether Superpowers helps

While working, note: the time each step takes, mistakes caught before code was written, misunderstandings caught by the gates, and friction (hooks, ceremony on small tasks). Report the pros and cons at the end using these notes, not a generic list.

## 10. Risks

- **Ceremony on tiny tasks.** Mitigation: the three paths.
- **Plans go stale.** Mitigation: outlines only for phases not started.
- **Learning two things at once** (NestJS and the process). Mitigation: one step at a time, plain language, examples from this project.
- **Frozen hook copies.** Mitigation: the write-up already says how to remove them after an upstream update.

## 11. Done when

- The master plan file exists and uses the same phase numbers as `BACKEND-PLAN.md`.
- Every Phase 1 task has files, acceptance criteria and a verify command.
- Every tick in `BACKEND-PLAN.md` is backed by a command that was run.
- No file in `Backend/` or `Frontend/` was changed by Claude.
- The owner can run the loop on the next task without help.
