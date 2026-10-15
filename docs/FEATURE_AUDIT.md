# TOOLIXA V2.6 — Feature audit

## Catalog totals
- 52 categories.
- 1,040 catalog concepts (20 per category). These are not 1,040 completed tools.
- 88 entries are marked Ready in the catalog.
- 952 entries are planned and should not be represented as implemented.
- V2.5 added the basic JSON-LD Schema Validator path. V2.6 adds sitemap coverage for all ready-marked tool routes; planned entries can be opened to show their roadmap status but cannot be processed, bringing the current Ready-marked paths into the implemented action map.

## Implemented local paths
- Image: compression/format conversion/resizing/rotation/flipping/grayscale/blur/quality optimization, PNG↔JPG/WebP conversions supported by browser canvas, image dimensions/metadata/format report.
- PDF: merge, split into pages (up to 250 pages), rotate, page count, metadata report, delete final page. Encrypted/password PDFs are unsupported.
- File: ZIP create/extract, file information reports, rename by creating a renamed ZIP, SHA-256 checksum, duplicate-content scan, extension/MIME inspection, file-list export.
- Text: 20 text utilities including case conversion, cleanup, line sorting/deduplication, slug, find/replace, diff, counts/reading estimate, Base64 and URL encode/decode.
- QR: local QR PNG generation for selected payload types and color setting. The barcode-related concepts are planned, not ready.
- SEO: meta/robots/canonical/Open Graph/Twitter card builders, SERP text preview, title/description length checks, keyword density, robots.txt, slug, pasted-HTML heading counts, checklist, basic structured-data generation and basic JSON-LD syntax/structure checks.
- Color: HEX/RGB display, contrast ratio, palette/shades, inversion, HSL, CSS gradient, random color, CSS variables, color export.

## Boundaries / not implemented
- Video and audio processing, AI background removal/upscaling, PDF-to-Word, full OCR, barcode creation, online website crawling/real SERP data, Schema.org's full vocabulary validation, account/database features and other planned concepts are not implemented.
- Basic JSON-LD validation checks JSON syntax and the presence/shape of common fields; it is not an authoritative Schema.org validator.
- Processing is browser-local unless a documented API route is explicitly called. The `/api/tools/text` and `/api/tools/catalog` endpoints are TOOLIXA's own routes, not third-party APIs.

## API keys and cost
- No third-party API key is required for the current implemented browser-local utilities, QR generation library, PDF library, or current text API.
- `/api/health`, `/api/tools/catalog`, and `/api/tools/text` are routes inside this Next.js application. They do not require a separate API provider or API key.
- npm packages are dependencies, not paid APIs. Hosting/build bandwidth or platform usage limits may still apply.
- External AI, live search/SEO metrics, OCR/cloud conversion, email delivery or similar services would require a provider account and may be paid; price depends on the selected provider and usage. Keep secret API keys in server-side environment variables, never in client-side JavaScript or committed source.

## Verification
The smoke test suite is run with `npm test`. Run `npm run build` after installing dependencies. The project was moved to the patched Next.js 15.5 maintenance line and React 19 for App Router compatibility; a full production build must still be verified after dependencies install. Configure `NEXT_PUBLIC_SITE_URL` in Netlify to the exact canonical production origin (for example, `https://your-real-domain.com`) before deploying; it drives canonical metadata, robots.txt, and sitemap URLs. Automated smoke tests validate syntax, key processing functions, API input handling, the basic JSON-LD validator and that each Ready-marked catalog action has a declared implementation path. A successful smoke test is not a substitute for a successful production build, browser/device testing or deployment verification.
