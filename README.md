# TOOLIXA V2.3 — Reliability & API Test Upgrade (honest capability report)

Premium Next.js 14 App Router interface, Tailwind, Framer Motion, lucide SVGs, responsive dark/light themes, branded favicon, per-tool SEO metadata, sitemap and robots routes, image comparison slider, downloadable results, client-side utilities.

**Scope:** 52 categories and 1,040 catalog entries **are concepts**, not complete engines. Only catalog items explicitly marked **Ready to use** are offered as working actions. Upcoming tools are labeled **Planned** and have no working routes. Do not advertise the catalog as 1,040 completed tools. This is an incremental V2 upgrade of the original V1 project, not a verified zero-error production release.

## Confirmed code paths implemented

- Image: browser Canvas compressor, converter, resizer, rotate 90°, horizontal flip, grayscale, blur, quality optimizer, PNG/JPG/WebP conversion, dimensions/metadata/format reports.
- PDF: merge, split (up to 250 pages), 90° rotate, page count, metadata, delete final page. Encrypted PDFs are explicitly unsupported.
- File: ZIP create/extract, rename in ZIP, batch rename, SHA-256 checksums, SHA-based duplicate finder and file-information JSON reports.
- Text: 20 text utilities including case transforms, comparison, search/replace, encoders and reports. Find/replace is case-sensitive.
- QR: QR PNG output and URLs, Wi-Fi, email, phone and SMS URI payload conventions. QR logo insertion and barcode generation not implemented.
- SEO: local title and description inspection, sample metatags, OG templates, basic keyword counts and pasted-HTML heading counts; **not** live crawling, Google Search rankings or Search Console API analysis.
- Color: hexadecimal picker, RGB/HSL outputs, contrast analysis, palette/shades, gradient, inverse, CSS variables, export.

## Develop

Requires Node.js 20+. In the project folder:

```bash
npm install
npm run dev
npm run build
```

If using Netlify: put source in GitHub, import repository to Netlify, build command `npm run build`. Next.js requires a framework build; do not upload the ZIP as a static HTML deploy. Set `NEXT_PUBLIC_SITE_URL` to the **actual live domain** (for example `https://toolixaza.com` only if owned and configured). Configure DNS / TLS in Netlify. Do not add a trailing slash.

## SEO deployment checklist

1. Confirm the domain: user previously mentioned both toolixaza.com and Quixa.com; TOOLIXA is configured provisionally for toolixaza.com.
2. Set NEXT_PUBLIC_SITE_URL, deploy, check `/robots.txt` and `/sitemap.xml` work.
3. Verify site ownership in Google Search Console and submit sitemap URL. Google controls indexing and rankings: they cannot be guaranteed by code.
4. Run Lighthouse in production and inspect Core Web Vitals. No 95+ score is claimed without execution measurements.
5. Add privacy policy, legal contact details, appropriate ad consent and original content before applying for AdSense. No approval guarantee.

## Security, browser limits & test status

Client-side operations do not upload files to a TOOLIXA backend. PDF split capped at 250 pages and images capped at 45 MP; extracting archives capped at 300 entries. Avoid processing confidential data on shared/public devices. ZIP files from untrusted sources should be handled carefully. Verify behavior with real devices and files before production.

**Testing performed in this environment:** TypeScript/TSX parse and smoke tests for pure JS functions; npm install could not finish because package registry access timed out. Therefore a full Next.js build, browser E2E, mobile-device tests and production vulnerability scan are **not verified**. This package is a functional-source development release with explicit limitations, not a guarantee that all functions are error-free.

## V2.1 server routes (Option B)

This is a **Next.js App Router application**, not a standalone `index.html` site. The server-side code lives in `app/` route handlers:

- `GET /api/health` — no-store JSON health check with version and supported server capabilities.
- `POST /api/tools/text` — server-side text processing. Send `Content-Type: application/json` and JSON `{ "operation": "uppercase", "text": "hello" }`. The response contains `{ ok, operation, result, details }`.

Supported text operations: `uppercase`, `lowercase`, `titlecase`, `reverse`, `trim`, `remove-extra-spaces`, `remove-duplicate-lines`, `sort-lines`, `word-count`, `character-count`, `line-count`, `slug`, `url-encode`, `url-decode`, `base64-encode`, `base64-decode`. Requests are limited to 200,000 characters; invalid inputs receive JSON errors with suitable HTTP status codes. These routes do not store submitted text.

Test after starting the app:

```bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/tools/text -H 'Content-Type: application/json' -d '{"operation":"uppercase","text":"hello toolixa"}'
```

The sitemap intentionally lists only the homepage until actual crawlable category/tool pages exist; it no longer advertises non-existent `/tools/...` routes. Client-side file processing remains client-side to preserve the privacy-first workflow. This API is a starter server layer, not a claim that all catalog tools have backend implementations.

## V2.2 server hardening

- Request bodies are streamed and capped at 220 KB before JSON parsing; text input remains capped at 200,000 characters.
- API validates JSON object shape, content type, UTF-8 decoding and operation allowlist; error responses are not cached.
- Base64 decoding now rejects malformed input instead of relying on Node's permissive decoder.
- Shared server text operations live in `lib/server-text.ts` so they can be tested independently.
- Smoke tests include Unicode reversal, valid/invalid Base64 and malformed URL-encoding cases.

Run the available lightweight checks from the project folder with `node tests/smoke.cjs`. This does not replace `npm install`, `npm run build`, live API tests or a security audit; those still need to be run in a network-enabled deployment environment.


## V2.3 reliability and route tests

- Added `npm test` as a documented one-command smoke and route-handler test suite.
- Tests exercise the actual health and text API handlers through a lightweight `NextResponse` shim, including successful processing, malformed JSON, unsupported content type, schema errors, unknown operations, malformed URL/Base64 inputs, and oversized text.
- Health endpoint reports version `2.3.0`; health and text responses set explicit no-store/security headers.
- Run `npm test` from the project folder. These tests validate handler logic in Node but do not replace a full Next.js build, deployment test, browser E2E suite, or third-party security audit.

## V2.4 — Personal Workspace Upgrade

- Favorites are stored in browser `localStorage` and remain on that device/browser profile.
- Recently opened tools are stored locally (up to 12 entries).
- Tool cards include an accessible favorite toggle; tool workspace also lets users save/unsave a tool.
- Category sidebar counts now come from the actual catalog rather than a hard-coded count.
- Catalog metrics explicitly say `Catalog concepts`; they do not claim every catalog entry is implemented.
- Version metadata is updated to `2.4.0`.

### Verification note

Run `npm test` for the included smoke and API-handler tests. In the authoring environment, `node tests/smoke.cjs` passed. `npm run build` could not be verified here because project dependencies were not installed (`next: not found`); run `npm install` and then `npm run build` before deployment.


## V2.5 readiness and API notes
See `docs/FEATURE_AUDIT.md` for accurate catalog counts, supported local operations, limitations, and API-cost notes. `GET /api/tools/catalog` returns current catalog/readiness counts and ready-marked entries. The basic Schema Validator checks JSON-LD syntax and basic structure only; it is not a full Schema.org vocabulary validator.


## V2.5 — Functionality Audit & Readiness Upgrade
- Added a basic JSON-LD Schema Validator (syntax + basic structure; not full Schema.org validation).
- Added `GET /api/tools/catalog` to report the catalog counts and Ready-marked tools.
- Updated version/health metadata to 2.5.0.
- Added a live-action coverage assertion and API integration tests.
- Catalog truth: 52 categories, 1,040 concepts, 88 Ready-marked entries and 952 planned concepts. Ready-marked is not a claim of production certification.
- Third-party API keys: none are needed for the current local utilities or internal API routes. See `docs/FEATURE_AUDIT.md` for limitations and cost details.


## V2.6 deployment audit updates
- Updated Next.js to the patched 15.5 maintenance line and React/type packages to React 19 for App Router compatibility; dynamic route params now use the async API expected by Next.js 15.
- Sitemap includes the homepage and all 88 ready-marked tool routes.
- Planned catalog entries can show roadmap status, but processing is not available for them.
- Set `NEXT_PUBLIC_SITE_URL` in Netlify to your actual canonical HTTPS domain before production deployment.
- Automated smoke tests verify sitemap route coverage.
- Read `DEPLOY_CHECKLIST.md` before deployment; the production build still needs confirmation in Netlify.

## V2.7 — TOOLIXA COMMAND CENTER

- Added `/admin`, a responsive dark command-center prototype with 10 control modules: overview, theme, tool commander, page/content, SEO/marketing, media/storage, user/security, monetization, system/backup and integrations.
- Interactive local features include theme palette/radius controls and preview, template presets, tool search and local overrides, draft page/blog inventory, SEO snippet preview, media preview, role/plan drafts, JSON settings backup/restore and local activity log.
- Added a Prisma/PostgreSQL schema for users/roles, NextAuth adapter tables, settings, tool configs, themes, content, media, plans, subscriptions, coupons, usage events, activity logs, API keys, backups and feature flags.
- Added `lib/prisma.ts`, `.env.example` placeholders and `docs/COMMAND_CENTER_STATUS.md`.
- `npm test` passes the existing smoke and route-integration suite, including syntax parsing of the new admin page.

**V2.7 status at the time:** The Command Center settings were browser-local, the Prisma schema had no committed migration, and authentication had not yet been wired. V2.8 adds the login and protected API foundation, but does not yet connect the entire admin interface to the database. V2.9 adds a database-persistence bridge for the dashboard snapshot; remaining limitations are listed in the V2.9 section and `docs/V2.9_PERSISTENCE_BRIDGE.md`.

## V2.8 — secure admin access foundation
- Added server-side session gate for `/admin`, a dedicated `/admin/login` screen, and a NextAuth Credentials flow using a bcrypt hash stored in deployment secrets.
- Added session-protected `/api/admin/settings` GET/PUT handlers backed by Prisma `SiteSetting` when PostgreSQL is configured.
- Added admin password hash helper and deployment/security checklist in `docs/COMMAND_CENTER_STATUS.md`.
- **Important:** the visual Command Center UI is still browser-local and is not yet wired to the database settings API. This release is a security/authentication foundation, not a fully production-ready SaaS. Create and commit Prisma migrations and complete the deployment checks before launch.

## V2.9 — Persistence Bridge

- Added a dashboard persistence bridge: the Command Center loads the saved `commandCenter` snapshot from the protected `/api/admin/settings` endpoint when the server database is configured.
- The global **Save changes** action attempts to persist the complete dashboard snapshot as a `SiteSetting` JSON value in PostgreSQL. If the database endpoint is unavailable, it falls back to browser `localStorage` and clearly reports that limitation.
- Sidebar persistence status now distinguishes database mode, checking state, and local fallback.
- Health endpoint reports version `2.9.0` and the available admin persistence capabilities.

### Important scope boundary

This upgrade persists the Command Center snapshot; it does **not** make every module a complete production feature. Public storefront theme application, dedicated `ToolConfig` records, real media storage, CMS publishing, payments, scheduled jobs, and complete role management still need separate implementations and tests. A successful API save confirms that the JSON snapshot was stored, not that every setting has been applied to the public website.

### Verification

Run `node tests/smoke.cjs` to execute the included syntax, catalog, server-text, and route-level smoke tests. A complete production build and a live PostgreSQL round-trip must still be verified in an environment with installed dependencies and a configured database.


## V3.0 — Live Storefront Bridge

- Added `/api/site/config`, a public, read-only, allowlisted configuration endpoint. It exposes only brand presentation fields and validates color, font, text length, and radius values.
- The storefront fetches public branding from the endpoint and applies the saved brand name, tagline, heading, colors, font, radius token, and footer copy.
- Admin saves remain PostgreSQL-backed only when `DATABASE_URL`, Prisma Client, and the migration are configured. If the database is unavailable, admin configuration continues to use browser-local fallback; that fallback does not publish to other visitors.
- The public endpoint intentionally does not expose custom CSS, analytics IDs, AdSense IDs, roles, plans, activity logs, or other private admin settings. Custom CSS is not injected.

### Verification note
Smoke tests validate syntax and route behavior; they do not replace a real production build or a live PostgreSQL deployment test. Run `npm ci`, `npm run db:generate`, apply the Prisma migration, then `npm run build` and manually verify that a saved theme appears in a fresh browser session.


## V3.1 — Live Operations Bridge

V3.1 connects saved tool enablement overrides to the public catalog and workspace. The public catalog reads the `commandCenter.toolOverrides` snapshot from PostgreSQL when available, validates public fields, and never allows an admin toggle to make a roadmap-only concept executable. The admin settings write and its audit event are committed together. An authenticated operations endpoint exposes aggregate counts and recent usage/activity records without returning IP/session hashes or usage metadata.

### V3.1 verification and boundaries

- `npm test` runs the repository's dependency-light smoke suite; the suite passed in the authoring environment.
- The public catalog falls back to the source-code catalog when the database is not configured or unavailable.
- The admin operations endpoint requires a `SUPER_ADMIN` session and a configured, migrated PostgreSQL database.
- UsageEvent records are surfaced if another instrumented workflow writes them; this release does not claim every client-side operation is already metered.
- The full Next.js production build and a live PostgreSQL deployment were not verified in this environment. Configure secrets, run Prisma migration/generation, build, and perform deployment smoke tests before production use.
