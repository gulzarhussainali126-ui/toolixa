# TOOLIXA V2.6 — GitHub + Netlify deployment checklist

## Before uploading to GitHub
1. Extract this ZIP. The `package.json` file must be at the repository root, alongside `app/`, `components/`, `lib/`, `public/`, and `tests/`. Do not upload only the ZIP file.
2. Keep the repository private if you do not want the source code to be publicly visible. Never upload `.env.local`, `.env.production`, API secrets, or credentials. `.gitignore` excludes `.env*` except the safe `.env.example`.
3. Commit the project files to the repository's main branch.

## Netlify setup
1. In Netlify, choose **Add new site → Import an existing project** and connect the GitHub repository.
2. Set the base directory to the repository root (leave it blank if `package.json` is at the root).
3. Build command: `npm run build`. Do not set the publish directory to `public`; Netlify's Next.js adapter handles the Next.js output.
4. In **Site configuration → Environment variables**, set `NEXT_PUBLIC_SITE_URL` to the exact canonical HTTPS origin you own and have configured, for example `https://your-real-domain.com` (no trailing slash). Do not leave the example value if it is not your domain. This value is used for metadata, `robots.txt`, and `sitemap.xml`.
5. Deploy. If the build fails, open the deploy log and fix the first real build error before trying again.

## Post-deploy smoke checks
- Open `/` on desktop and mobile.
- Open `/api/health`; expect JSON with `ok: true` and version `2.6.0`.
- Open `/api/tools/catalog`; expect 52 categories, 1,040 catalog concepts, 88 ready-marked tools, and 952 planned entries.
- Open `/sitemap.xml`; it should include the homepage plus all ready-marked tool routes.
- Open `/tools/image-tools/image-compressor` directly in a fresh tab, refresh it, and test one small image.
- Test one small PDF merge/split, one ZIP create/extract, a QR code, a text utility, and the contrast checker.
- Test browser back/forward, theme, favorites, search, downloads, and mobile navigation.
- Check Netlify function logs and browser console for errors.

## Important verification boundary
The included `npm test` smoke suite has passed in the preparation environment. A full production build and real browser/device QA have **not** been verified here because the environment could not install the Next.js dependency (`next: not found`). Treat the Netlify build log and post-deploy checks above as mandatory before sharing the production URL.
