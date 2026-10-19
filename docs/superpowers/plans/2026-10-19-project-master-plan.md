# Gaming Highway TN: master plan (the Superpowers way)

> **How this plan is used:** the owner (Hamza) types all application code. Claude coaches, reviews, and runs read-only checks. Nobody uses `subagent-driven-development` or `executing-plans` on this plan. Progress is tracked by the checkboxes below and in `BACKEND-PLAN.md`.

**Goal:** finish the shop (a real NestJS backend for the Next.js storefront) while learning to work the way Claude and Superpowers do: decide first, design small, plan in tasks, write the test first, prove with evidence, review, then merge.

**Architecture:** one repository, `Backend/` (NestJS 12, Postgres, Redis) and `Frontend/` (Next.js). This file is the **roadmap and playbook**. `BACKEND-PLAN.md` stays the detailed checklist of what to build in each phase. Each slice gets its own short design and task list when it starts.

**Tech stack:** NestJS 12, TypeScript, Jest, supertest, pino, Swagger, Docker Compose, GitHub Actions. Planned: PostgreSQL, Prisma, Redis, BullMQ, argon2, Testcontainers.

**Spec:** `docs/superpowers/specs/2026-10-19-project-roadmap-design.md`

**History:** written 2026-10-19; reviewed on 2026-10-20 (run on Opus 5.5) against the real code and the installed library source. The review found 15 problems in this plan and one new fact, and the real-request proof afterwards found one more (see Part F). All fixes are applied below.

## Global constraints

- Claude changes nothing in `Backend/` or `Frontend/`. The owner types the code.
- The owner runs git (branch, commit, push, merge). Claude never commits unasked.
- No secret in git. Fake values only in CI.
- Nothing is called done without a command's real output shown.
- Everything Claude gives or reviews is checked for inputs, security, failures, environments, operations and tests, and tested in a throw-away copy before it is shown.
- Use the framework's own security feature before writing your own.

**Note on this plan's format.** The writing-plans skill wants full test code inside every step. Here the owner types the code, so each task lists the **test cases** (input and expected result) and the **verify command**. Claude gives a tested snippet or hint when the owner reaches that step, not before.

**User decisions (already made):**
- Plan covers all 10 phases, with detailed tasks only for what is next (option A).
- "I write the code."
- Plan from scratch the Superpowers way, then compare with `BACKEND-PLAN.md`: keep what fits, change or remove the rest, and list every change for approval.
- Explain simply, a little at a time.
- C11 (security checklist) approved on 2026-10-19; the reviewed change list C1 to C12 approved on 2026-10-20.

---

## Part A: The playbook (how every piece of work runs)

| # | Step | You do | Claude does | Output |
|---|------|--------|-------------|--------|
| 1 | **Decide** | Answer the question; pick an option | Asks one question at a time, recommends | A decision written in chat (or in `BACKEND-PLAN.md`'s Decisions) |
| 2 | **Design small** | Approve or change it | Presents a short design (a few sentences for a bounded change, a spec file for a new subsystem) and stops | An approved design. Nothing is built before this. |
| 3 | **Plan in tasks** | Approve the task list | Writes tasks: files, test cases, a command that proves each | A task list like Part D |
| 4 | **Test first** | Type the failing test, run it, see it fail | Gives the case table, checks that the test fails **for the right reason** | A red test |
| 5 | **Make it pass** | Type the smallest code that passes | Reviews it, points out missed cases | A green test |
| 6 | **Prove** | Run the verify command | Runs the read-only checks too, shows the real output | Output pasted in chat. No output, no "done". |
| 7 | **Review** | Read the diff; run `/security-review` on security-relevant slices | Reviews: inputs, security, failures, environments, operations, tests; goes through the security checklist (Part A2) | A list of findings, fixed or accepted |
| 8 | **Finish** | Commit, push, open the pull request, merge when CI is green | Reads `git status` and the diff first, never merges | Merged branch |

**Code that already exists (no failing test to start with):** write the test, break the code on purpose, watch the test fail, restore the code, watch it pass. A test you never saw fail proves nothing.

**Which path:** a question, with a throw-away answer, is a *spike* (2 to 3 sentences, then a nod). A change to code that exists is *bounded* (short design in chat). A new subsystem is *architectural* (written spec, then plan). In doubt, take the heavier path. Approval is always required; only the size of the document changes.

**Teach-back (optional but recommended):** at the end of each task, say in 3 sentences what the code does and why. If you can't, we go back over that part before the next task.

### Part A2: Security checklist (every slice, at the Review step)

1. **Who may call this**, and is it checked on the server, including ownership ("someone else's order")?
2. **Is every input validated** by a DTO (type, length, range)?
3. **What could leak:** secrets, stack traces, another customer's data, query strings in logs?
4. **What if it's called 1000 times** (rate limit, cost, page size)?
5. **What if it fails halfway** (transaction, retry, double request)?
6. **Does the log carry the request id**, and no personal data?

**OWASP API Security Top 10 (2023 edition; check whether a newer one exists) mapped to the phases:**

| Risk | Where it is handled |
|------|---------------------|
| Object-level access ("someone else's order") | Phases 5, 6, 8: ownership tests |
| Authentication | Phase 4 |
| Object property level (mass assignment) | DTO whitelist, done in Phase 0 |
| Unrestricted resource consumption | Rate limits (3, 4, 6), body size limit (done), maximum page size (3) |
| Function-level access (customer on an admin route) | `RolesGuard`, Phases 4 and 9 |
| Sensitive business flows (bulk buying, promo guessing) | Fraud limits and promo rate limits, Phase 6 |
| Server-side request forgery | Phase 9, if anything fetches a URL the user gives |
| Security misconfiguration | Security headers (1), CORS (done), Swagger off in production (done), `trust proxy` (3) |
| Improper inventory (forgotten endpoints) | `/api/v1` prefix, staging separate from production (3) |
| Unsafe consumption of other APIs | Payment gateway re-check, Phase 7 |

---

## Part B: From-scratch review of `BACKEND-PLAN.md` (approved change list)

I planned the whole project again from nothing, using the Superpowers questions (what must be decided first, what is the smallest slice I can test, what command proves it). Then I compared the result with `BACKEND-PLAN.md`.

**What already fits and stays as it is:** the decisions table, the golden rules, the phase order, and the contents of Phases 2, 3, 5, 7 and 8. Nothing is removed: every item stays, or moves with its box and tick.

| # | Change | Why |
|---|--------|-----|
| C1 | A **Proof** line in every phase: the command or click path that shows it works | "Done when" says what, not how to prove it |
| C2 | "For every phase" says **write the failing test first**, then build | The old order was build, then test |
| C3 | The tests Phase 10 listed (pricing, promo, stock, checkout, refunds, webhook) move into Phases 6 and 7 | Tests written at the end are written after the bugs |
| C4 | A real Postgres in tests from **Phase 2**, through Testcontainers, **locally and in CI** (GitHub's Ubuntu runners have Docker) | One way to get a test database: no "works here, fails there" |
| C5 | **Split big phases** into slices, each with its own pull request (Phase 4: 4a to 4c, Phase 6: 6a to 6c, Phase 9: 9a to 9d); the Git workflow becomes "one branch and pull request per slice" | 15+ items can't be reviewed in one pull request |
| C6 | **Gate decisions**, each with one "decide before" phase (table at the end of Part C) | These block work; the old plan listed two of them |
| C7 | Business and legal tasks get a **start-by** phase | They take weeks of waiting on other people |
| C8 | Fix stale text: Docker ports, `.env` snippet, "path, not URL" in the logging item, the request-id item, the Phase 1 test item (replaced by T1, T2, T4); tick `hideQuery` after a real request | They no longer match the code |
| C9 | "The loop" in "For every phase", and a pointer to this file | The plan itself teaches the process |
| C10 | One rule, **nothing goes public without**: security headers (Phase 1); `trust proxy`, a global rate limit, Sentry, secrets in the host's secret store (Phase 3e); stricter auth limits, bot protection, CSRF (Phase 4); order and promo limits (Phase 6); load test and penetration test (Phase 10) | Rate limits behind a proxy need `trust proxy` from the first deploy, or every visitor looks like one IP |
| C11 | The **security checklist** (Part A2) in "For every phase", and a **Security** line in every phase; `/security-review` on security-relevant pull requests; a database user with limited rights from Phase 2 | A solo project has no second reviewer; the checklist and the pre-launch test replace part of that |
| C12 | NestJS 12's built-in **`app.useSecurityHeaders()`** (same headers as helmet 8) in Phase 1 instead of installing helmet in Phase 10; the built-in **`app.enableCsrfProtection()`** in Phase 4 instead of a hand-written `Origin` check | The framework already has them (found in the installed source) |

---

## Part C: Roadmap (phases 0 to 10)

Each phase: **status**, **decide first**, **slices** (each ends in a pull request), **security**, **proof**. Details of what to build stay in `BACKEND-PLAN.md`.

### Phase 0: Setup. Status: done
- Proof: `docker compose ps` shows both services; `curl http://localhost:4000/health` answers `{"status":"ok"}`; Swagger opens at `/api/docs`.

### Phase 1: First module, hard-coded data. Status: nearly done
- **Decide first:** the error rules (T3).
- **Slices:** the tasks in Part D (T0 to T8), one pull request, or two (T0 to T6, then T7 and T8).
- **Security:** security headers (T4); no query strings or secrets in logs and messages (done); error responses never show internal details (T3).
- **Proof:** `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build` pass locally and in GitHub Actions.

### Phase 2: Database and Prisma
- **Decide first:** confirm Prisma.
- **Slices:** (2a) Prisma, schema, first migration, `PrismaModule`; (2b) seed data in `Backend/prisma/seed-data/`; (2c) platforms read from the database, tested against a real Postgres through Testcontainers, locally and in CI.
- **Security:** the app connects with a database user that has only the rights it needs (migrations use the owner); no SQL built from raw input; seed data never in production.
- **Proof:** 10 games in Prisma Studio; `GET /api/v1/platforms` served from Postgres; e2e green against Testcontainers in CI.

### Phase 3: Catalog API and first frontend connection
- **Decide first:** domain and hosting provider; what Next.js may cache.
- **Slices:** (3a) `GET /products` with filters and a DTO; (3b) product detail, related, home; (3c) frontend `api.ts` and one page switched; (3d) the remaining pages, SEO, generated types; (3e) first staging deploy, with `trust proxy`, a global rate limit, Sentry (no cookies or headers sent to it) and secrets in the host's secret store.
- **Security:** a maximum `limit` per page and a maximum length for `q`; CORS only for the real frontend.
- **Proof:** filter and sort e2e tests; home, browse and product pages show API data; CORS works from the staging frontend; the rate limiter sees different IPs for different visitors on staging.

### Phase 4: Users, accounts and admin access (split)
- **Decide first:** bot protection service (captcha) for registration and login; the cookie domain follows the domain decision.
- **4a, login core:** `User`, register, login, logout, `me`, argon2, JWT in httpOnly cookie, `JwtAuthGuard`, `RolesGuard`, `@CurrentUser()`, CSRF through Nest's built-in `app.enableCsrfProtection()` with `FRONTEND_URL` as a trusted origin, stricter rate limits, bot protection.
- **4b, email flows:** email service (prints to the console in development), email verification, forgot and reset password, `tokenVersion` revocation.
- **4c, account and admin:** self-service (`PATCH /me`, change password, delete account), data export, first admin from a seed script, frontend rewrite of the login modal and account pages.
- **Security:** replies never reveal whether an email exists; tokens only in request bodies; a customer on an admin route gets 403.
- **Proof:** the tests listed in `BACKEND-PLAN.md` (wrong password, duplicate email, reused reset token, no cookie, customer on admin route, old token after password change, `POST` from another site rejected with 403).

### Phase 5: Cart and wishlist on the server
- **Decide first:** nothing new.
- **Slices:** (5a) server cart with price, edition and stock rules; (5b) wishlist; (5c) guest merge and frontend contexts.
- **Security:** a customer can only read and change their own cart and wishlist (test with another user's item id).
- **Proof:** tests for max quantity, sold out, invalid edition, another user's item; two tabs no longer overwrite each other.

### Phase 6: Orders, promo codes and refunds (split)
- **Decide first:** guest checkout or account required.
- **6a, order creation:** `Order`, `OrderItem`, `PromoCode`, `POST /orders/quote`, `POST /orders` with `Idempotency-Key`, stock reservation by conditional update; unit tests for pricing, promo and stock written first.
- **6b, order life:** state machine, expiry job, "My orders", "Track your order", "Buy now".
- **6c, refunds and fraud limits:** admin refund, refund rules, quantity limits, manual approval above an amount, rate limits on orders and promo checks; e2e tests for checkout and refunds.
- **Security:** someone else's order number gives 404; promo codes can't be guessed quickly.
- **Proof:** two buyers for the last copy give exactly one order; the same `Idempotency-Key` twice gives one order; the try-to-cheat list (lower price, fake promo, someone else's order).

### Phase 7: Payments
- **Decide first:** the gateway (the merchant application was started early, see `BACKEND-PLAN.md` business tasks).
- **Slices:** (7a) init payment and redirect; (7b) webhook with raw body, signature, idempotency, gateway re-check (CSRF protection already lets server-to-server requests without an `Origin` through; exclude the route only if the gateway sends a foreign `Origin`); (7c) late payment, missed-webhook job, chargebacks (how the gateway reports them, what happens to the order and the key), return page.
- **Security:** the order becomes paid only through a verified webhook confirmed by the gateway's API.
- **Proof:** tests for valid webhook, invalid signature, duplicate webhook, wrong amount, payment after expiry.

### Phase 8: Delivery of keys, accounts and emails
- **Decide first:** email provider; keys in the email or only on the site; supplier check done.
- **Slices:** (8a) `InventoryItem` with encryption, stock from inventory (the Phase 6 race test must still pass); (8b) BullMQ confirmation email, key reveal with log; (8c) pre-orders, failed-job alerts, CSV upload, email DNS records.
- **Security:** keys encrypted at rest with a replaceable key; every reveal logged; only the owner of the order can reveal.
- **Proof:** the Phase 6 race test still green; a reveal writes a log row; a failed job retries and then alerts.

### Phase 9: Admin and extras (split)
- **Decide first:** where the admin screens live (the old plan recommends protected `/admin` pages in Next.js).
- **Slices:** (9a) admin screens and endpoints for games, listings, prices, promo codes and orders, with the audit log; (9b) admin two-factor, dashboard data, low-stock alert; (9c) image upload and the real pages for the footer links; (9d) reviews, newsletter, banners.
- **Security:** an admin without two-factor can't reach key data; every admin action has an audit row; image upload checks type and size; nothing fetches a URL the user gives without a check.
- **Proof:** an audit row for every admin action; the two-factor test.

### Phase 10: Hardening and launch
- **Decide first:** production host; backup schedule.
- **Slices:** (10a) load test, then tune rate limits and size limits; `terminus` health checks (database and Redis); uptime monitor; confirm `trust proxy` in production; (10b) Dependabot, secret scanning, deploy steps, migrations as a deploy step; (10c) backups with a restore test, `RUNBOOK.md`, legal pages checked against the code, "demo" notices removed, promises on the site checked, a penetration test before launch.
- **Security:** the penetration test findings are fixed or accepted in writing before launch.
- **Proof:** a restore from a backup; a staging deploy from a merge; the runbook followed once on staging.

### Gate decisions in one list

| Decision | Decide before | What it blocks |
|----------|--------------|----------------|
| Confirm Prisma | Phase 2 | schema and all data code |
| Domain and hosting | Phase 3 | staging deploy, cookie domain |
| Bot protection service | Phase 4 | registration and login |
| Guest checkout or account required | Phase 6 | order and tracking design |
| Payment gateway (start the application now) | Phase 7 | payment code |
| Email provider | Phase 8 | real emails (Phase 4 prints them to the console) |
| Keys in the email or only on the site | Phase 8 | delivery and refund wording |
| Where the admin screens live | Phase 9 | admin work |

---

## Part D: Phase 1 remainder, task by task (the first live run of the loop)

**State on 2026-10-20 (commands run that day):** `npm run lint` reports 2 unused imports (`platforms.controller.ts:6`, `all-exceptions.ts:10`); `npm test` 4 tests pass; `npm run test:e2e` 1 test passes. The request-id fix is not applied: `app.module.ts` still uses `genReqId`, so 413 and broken-JSON 400 errors show `requestId: "unknown"`, and log lines have no id. `error` still uses class names. The e2e test only calls `/health` and builds the app without `main.ts`'s setup (prefix, filter, pipe).

**Order:** T0 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8. T6 can be done any time after T0.

### T0: Branch and clean-up
**Goal:** the audit work lives on its own branch, with no lint warnings.
**Files:** `Backend/src/common/filters/all-exceptions.ts:10` (the `randomUUID` import), `Backend/src/platforms/platforms.controller.ts:6` (the `InternalServerErrorException` import).
**You decide:**
- What to do with `.claude/`, `docs/` and `Frontend/global.d.ts`. They are not audit work. Suggested: a separate commit on a separate branch, and never commit `.claude/settings.local.json`.
- `BACKEND-PLAN.md` is git-ignored (root `.gitignore`, line 8). If `docs/` goes into git, these plan files point to a file that isn't in the repo. Keep it local, or commit it.
**Acceptance criteria:**
- [ ] `git branch --show-current` shows a branch that is not `main`.
- [ ] `npm run lint` in `Backend/` reports 0 warnings.
- [ ] `npm test` and `npm run test:e2e` still pass.
**Verify:** `npm run lint && npm test && npm run test:e2e` (in `Backend/`) → all pass.

### T1: Unit tests for `PlatformsService` and `GenresService`
**Goal:** the first test-first loop. Real behaviour is tested, not "should be defined".
**Files:** `Backend/src/platforms/platforms.service.spec.ts`, `Backend/src/genres/genres.service.spec.ts`.
**Test cases:**

| Service call | Expected |
|--------------|----------|
| `PlatformsService.findAll()` | 3 platforms with slugs `ps5`, `xbox`, `pc` |
| `findOne('ps5')` | the PlayStation 5 object |
| `findOne('nope')` | throws `NotFoundException` |
| `findOne('PS5')` | throws (slugs are lower case; decide it and test it, don't assume) |
| `findOne('')` | throws |
| `GenresService.findAll()` | 8 genres, each slug unique |

**Check Claude will make:** `findAll()` returns the service's own array. If a caller changes it, the data changes for every request. Decide: accept it (hard-coded data until Phase 2) or return a copy, and write the test for your choice.
**Acceptance criteria:**
- [ ] Each test fails when you break the service on purpose (change a slug, return `undefined`), and passes after you restore it.
- [ ] No test only checks "defined".
**Verify:** `npm test -- platforms.service genres.service` → all pass, plus the red run you saw before.

### T2: Unit tests for the error filter
**Goal:** the safety rules of `AllExceptionsFilter` are locked by tests.
**Files:** `Backend/src/common/filters/all-exceptions.spec.ts` (create).
**Test cases** (call `catch()` with a fake `host`, `request` and `response`):

| Situation | Expected |
|-----------|----------|
| `new NotFoundException('x')` | status 404, `message` `'x'`, `error` as the code says today (T3 may change it) |
| `new BadRequestException(['name must be a string'])` | status 400, message stays an array |
| `new HttpException('plain text', 403)` | status 403, message `'plain text'` |
| Express error: an `Error` with `status: 413`, `expose: true` | status 413, not 500 |
| An `Error` with `status: 500`, `expose: true` | status 500 and the fixed message `Internal server error` |
| `new Error('db password is x')` | status 500, fixed message; `db password` is not in the body |
| A thrown string, and `null` | status 500, no crash |
| `originalUrl` `/api/v1/x?token=abc` | `path` is `/api/v1/x` |
| A message that contains `/api/v1/x?token=abc` | the message has no `token=abc` |
| `request.id` is `'abc-123'` / no id | `requestId` is `'abc-123'` / `'unknown'` |
| A 404 / a plain `Error` | no error log / exactly one error log that contains the request id |

**Acceptance criteria:**
- [ ] Every case above has a test, and for each one you saw it fail after breaking the filter on purpose.
- [ ] The plain-`Error` test proves the secret text is not in the response body.
**Verify:** `npm test -- all-exceptions` → all pass.

### T3: Decide the error rules
**Goal:** two decisions about error responses, then tests that lock them.
**Decision 1, the `error` field.** Facts: for `new NotFoundException('x')` Nest's own default body is `{ message: 'x', error: 'Not Found', statusCode: 404 }`; ours says `'NotFoundException'`. Options: (a) Nest's standard names, so the shape matches plain Nest; for Express errors such as 413, take the name from Node's `STATUS_CODES` (`node:http`), which gives `"Payload Too Large"`. (b) Keep class names.
**Decision 2, 5xx messages.** Today an `HttpException` with a 5xx status keeps the developer's message (`all-exceptions.ts:51-59`), so `new ServiceUnavailableException('db at 10.0.0.5 down')` would reach the customer. Options: (a) every 5xx gets the fixed `Internal server error` and the real message only goes to the log (recommended); (b) keep the developer's message.
**Files:** `Backend/src/common/filters/all-exceptions.ts`, `Backend/src/common/filters/all-exceptions.spec.ts`, `Backend/src/common/dto/error-response.dto.ts` (the `error` example, today `'NotFoundException'`).
**Acceptance criteria:**
- [ ] Both choices are written in `BACKEND-PLAN.md`'s Decisions table.
- [ ] The filter tests are changed first and fail, then the code changes and they pass.
- [ ] The Swagger example matches the chosen wording.
**Verify:** `npm test -- all-exceptions` → pass.

### T4: Shared app setup, and an e2e test of the real app
**Goal:** the e2e test boots the app exactly like `main.ts`, so it really tests the prefix, pipe, filter, CORS and security headers.
**Files:** `Backend/src/app.setup.ts` (create: one function that takes the app), `Backend/src/main.ts` (calls it), `Backend/test/app.e2e-spec.ts` (calls it).
**What goes in the function:** `app.useSecurityHeaders()` (Nest 12 built-in, same headers as helmet 8; it also removes `X-Powered-By`, so `app.disable('x-powered-by')` can go), the `ValidationPipe`, the global prefix, the filter, CORS from `ConfigService`. **What stays in `main.ts`:** `bufferLogs`, `useLogger`, Swagger, `listen`.
**Decide first:** unknown paths outside `/api/v1` and `/health` (for example `/x`) get Express's plain HTML 404 page, not our JSON error, and no log line. Nest puts its "not found" handler only under the global prefix (`express-adapter.js:101-107`; tested on 2026-10-20). That page shows no query string and sends `Content-Security-Policy: default-src 'none'`. Options: accept it and write it in the Decisions table (recommended: only typos and scanners go there), or add a catch-all that answers with our JSON.
**Rules:**
- Call the function **before** `app.init()` / `app.listen()`. The prefix and the security headers only work that way.
- Type the app as `NestExpressApplication` in both places.
**Test cases:**

| Request | Expected |
|---------|----------|
| `GET /health` | 200 `{status:'ok'}` |
| `GET /api/v1/platforms` | 200, 3 items |
| `GET /api/v1/platforms/nope` | 404, our error shape |
| `GET /api/v1/genres` | 200, 8 items |
| `GET /api/v1/nope?token=abc` | 404, body has no `token=abc` |
| `GET /platforms` (no prefix) | 404 (the plain page if you accept it, our JSON if you add the catch-all) |
| any response | no `X-Powered-By`; `X-Content-Type-Options: nosniff` present |
| `GET /api/v1/platforms` with `Origin` = `FRONTEND_URL` (read it from `ConfigService`, don't hard-code it) | `Access-Control-Allow-Origin` is that origin, `Access-Control-Allow-Credentials: true` |
| same with `Origin: https://evil.example` | no `Access-Control-Allow-Origin` |

**Acceptance criteria:**
- [ ] Remove the prefix line from the function on purpose: at least one test fails. Restore it.
- [ ] `main.ts` and the test use the same function (no copy).
- [ ] With `npm run start:dev`, Swagger at `http://localhost:4000/api/docs` still opens, with no Content-Security-Policy errors in the browser console. Swagger isn't in the e2e app, so this is a check by hand.
**Verify:** `npm run test:e2e` → pass; the Swagger check by hand.

### T5: Request id
**Goal:** every response carries an id, the request's log line shows the same id, and 413 and broken-JSON errors get a real id too.
**Decide first:**
- Always generate a new id and ignore any incoming `X-Request-Id` (recommended: a value sent by a client could fake or break log lines), or accept a safe one.
- Requests the body parser rejects (413, broken JSON) produce no log line at all, because the request logger runs after the parser and the filter only logs 5xx. Accept that (recommended: they are client mistakes, and the response still has the id), or log them as warnings in the filter.
**Files:**
- `Backend/src/common/request-id.ts` (create: sets `req.id` and the `X-Request-Id` header).
- `Backend/src/app.setup.ts` (registers it with `app.use()` as the **first** line, before `useSecurityHeaders()`).
- `Backend/src/app.module.ts` (remove `genReqId` and the `randomUUID` import on line 8; the `req` serializer gets `id: req.id`).
- `Backend/src/common/dto/error-response.dto.ts` (add `requestId`).

**Why the order matters:** Nest adds the body parser inside `init()`, and nestjs-pino after it. Only middleware added with `app.use()` before `init()` runs before the parser. pino-http keeps an existing `req.id`.

**Test first (e2e, written before the middleware):**

| Request | Expected |
|---------|----------|
| `GET /api/v1/platforms/nope` | 404; body `requestId` equals the `X-Request-Id` header, and looks like a UUID |
| `POST /api/v1/platforms` with a 200 KB JSON body | 413; same, and not `unknown` |
| `POST` with broken JSON (`{"a":`) and `Content-Type: application/json` | 400; same |
| `GET /health` | `X-Request-Id` header present |
| two requests | two different ids |
| request sent with `X-Request-Id: evil` | the response id is not `evil` (if you chose "always generate") |

**Note:** the browser can't read `X-Request-Id` from another site unless CORS exposes it. The frontend reads `requestId` from the error body, so CORS doesn't change.
**Acceptance criteria:**
- [ ] The tests above fail first, then pass.
- [ ] The log line of a normal request shows the same id as the header.
- [ ] Swagger's error schema shows `requestId`.
- [ ] `npm run lint` still reports 0 warnings.
**Verify:** `npm run test:e2e` → pass. `curl -i http://localhost:4000/api/v1/platforms/nope` shows the header, the same id in the body, and the same id in the server's log line.

### T6: README and `.env.example`
**Goal:** a new developer can start the app from the README alone.
**Decide first:** today `.env.example` has empty values, so "copy it to `.env` and start" fails the startup check. Options: put the local development values in it (the same ones `docker-compose.yml` already has in git, so they are not secrets, with a comment saying "development only") (recommended), or list them in the README.
**Files:** `Backend/README.md`, maybe `Backend/.env.example`.
**Acceptance criteria:**
- [ ] Steps: the Node version (from `engines`), install Docker, copy `.env.example` to `.env`, `docker compose up -d`, `npm ci`, `npm run start:dev`, `npm test`, `npm run test:e2e`, the Swagger address.
- [ ] No mention of Mau.
- [ ] Claude follows the README word for word in a fresh copy and every command works. Exception: the containers are checked with `docker compose config`, not started, because your running containers already use ports 5432 and 6379.
**Verify:** the fresh-copy run, output shown.

### T7: GitHub Actions workflow
**Goal:** every push and pull request runs the checks on GitHub.
**Files:** `.github/workflows/backend.yml` (create, at the project root).
**Acceptance criteria:**
- [ ] It runs on every push and pull request, with **no path filter**. A check you later make required would wait forever on a pull request that doesn't touch `Backend/`.
- [ ] `permissions: contents: read` (the job's token can only read).
- [ ] Node 24 (check in the `setup-node` docs whether it can read the version from `Backend/package.json`), npm cache keyed on `Backend/package-lock.json`, commands run inside `Backend/`.
- [ ] Steps: `npm ci`, `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`.
- [ ] `env:` has fake `DATABASE_URL`, `FRONTEND_URL` (origin only) and `NODE_ENV: test`. No real secret anywhere in the file.
- [ ] Action versions are checked in the official docs when you write the file.
- [ ] Push a deliberately failing test on the branch: the run is red. Remove it: the run is green.
**Verify:** the two runs on GitHub (red, then green), shown to Claude. Already checked: the lockfile includes the Linux builds of oxlint, so `npm ci` can install them on Ubuntu.

### T8: Close Phase 1
**Goal:** `BACKEND-PLAN.md` matches reality, and the work is merged.
**Acceptance criteria:**
- [ ] Each Phase 1 box is ticked only with a command output seen that day.
- [ ] Pull request opened, CI green, merged by you.
- [ ] Reminder done: create the reusable backend-only NestJS starter in a Desktop folder (not GitHub).
**Verify:** a green Actions run on the pull request; `git log` shows the merge.

---

## Part E: Notes for judging Superpowers (facts only)

| Date | Observation | Kind |
|------|-------------|------|
| 2026-10-19 | My first design answer misread the request (I wrote about Superpowers instead of using it). The approval step caught it before any file was written. | Gate worked |
| 2026-10-19 | `TaskCreate` and `TaskList` are not available here, so the plugin's task flow, its `.tasks.json` file and its execution hand-off can't run as written. `TodoWrite` and these checkboxes replace them. | Friction |
| 2026-10-19 | The writing-plans hand-off offers two ways to let agents run the plan. Both conflict with "I write the code", so I skipped that question. | Mismatch |
| 2026-10-19 | The plugin's Windows hook problems needed project-level fixes (`docs/superpowers/WINDOWS-HOOK-WORKAROUND.md`). The plugin itself is unmodified. | Friction |
| 2026-10-19 | The audit method (real requests against the real app) found bugs a code read missed: 413 answered as 500, query strings in logs, the wrong `path`, ports open on the network. | Benefit (method, not plugin) |
| 2026-10-20 | The review step, run against the real code and the installed library source, found 15 problems in the plan before any code was written, among them a wrong task order and two changes that contradicted each other. | Review worked |
| 2026-10-20 | Reading the installed Nest 12 source showed built-in security headers and CSRF protection that the plan was about to rebuild by hand. | Benefit (method) |
| 2026-10-20 | Proving a tick with real requests, instead of trusting the code read, found a gap the review missed: paths outside `/api/v1` get Express's HTML 404 (R16). | Verification worked |
| 2026-10-20 | The review ran on Opus 5.5 at your request. The same plan was not reviewed on Sonnet, so this shows nothing about which model is better. | Note |
| 2026-10-20 | Plan mode was switched on during the review. The skill says never to use plan mode's exit; the system's plan-mode rules won, because your instruction outranks a skill. | Friction |

More rows are added as we work: time per step, mistakes caught before code, misunderstandings caught at gates, friction.

---

## Part F: Review log (2026-10-20)

Problems found in the first version of this plan, and how they were fixed:

| # | Problem | Fix |
|---|---------|-----|
| R1 | The request-id tests came before the shared app setup, so they couldn't pass | Shared setup is now T4, request id T5 |
| R2 | "Email provider before Phase 4", but Phase 4 prints emails to the console | Email provider before Phase 8 |
| R3 | Global rate limits were placed in Phase 10 in one change and Phases 1 to 3 in another; `trust proxy` must come with the first deploy | One "nothing goes public without" rule (C10) |
| R4 | Two ways to get a test database | Testcontainers locally and in CI |
| R5 | Split phases, but "one branch per phase" | "One branch and pull request per slice" |
| R6 | The gateway's start date was given twice, differently; the domain had no phase | Gateway: apply now, approved before Phase 7. Domain: before Phase 3. |
| R7 | The README check would start a second set of containers fighting for the same ports | `docker compose config` in the copy |
| R8 | `.env.example` has empty values, so copy-then-start fails | Decision in T6 |
| R9 | The request-id middleware works only if added before `init()` | A rule in T4 and T5 |
| R10 | 413 and broken-JSON errors produce no log line | Decision in T5 |
| R11 | Filter tests missed cases, and a 5xx `HttpException` leaks its message | Cases added to T2; decision 2 in T3 |
| R12 | Changing `error` also needs Swagger's example and a name for 413 | In T3 |
| R13 | `randomUUID` would be left unused in `app.module.ts`; header readable only via CORS | In T5 |
| R14 | CI was missing least privilege, the no-path-filter rule, and a single source for the Node version | In T7 |
| R15 | The shared setup needs `NestExpressApplication` in both places and a CORS test | In T4 |
| New | Nest 12 has `useSecurityHeaders()` and `enableCsrfProtection()` built in | C12 |
| R16 | Found while proving `hideQuery` with real requests: paths outside `/api/v1` get Express's plain HTML 404, not our JSON, and no log line (Nest's "not found" handler lives only under the prefix) | Decision in T4 |

**`hideQuery` proof (2026-10-20, throw-away copy on port 4010):** `GET /api/v1/x?token=abc`, `?token=abc&page=2` and `/api/v1/x/?token=a%20b` all answered `404` with `"message":"Cannot GET /api/v1/x"` (or `/api/v1/x/`) and a `path` without the query; the server log had 0 lines containing `token`.
