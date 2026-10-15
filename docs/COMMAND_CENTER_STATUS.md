# TOOLIXA Command Center — V2.8 security upgrade

## Implemented in source
- Server-rendered `/admin` access gate redirects unauthenticated/non-super-admin sessions to `/admin/login`.
- NextAuth Credentials provider with an environment-configured admin email and bcrypt password hash; JWT sessions expire after eight hours.
- Admin settings API at `/api/admin/settings` checks the server session on every request and supports database-backed GET/PUT through Prisma `SiteSetting`.
- Login page with accessible labels, busy/error states, responsive layout, and noindex metadata inherited from the admin layout.
- Health endpoint/package version updated to 2.8.0.

## Required deployment setup
1. Use Node.js 20.9+ and configure a PostgreSQL database.
2. Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` as hosting environment secrets. Generate a hash using `node scripts/hash-admin-password.cjs "a-long-unique-password"`; do not put a plaintext password in environment variables.
3. Run `npm ci`, `npm run db:generate`, and `npm run db:dev` in a controlled setup to create/commit an initial migration, then use `npm run db:migrate` in deployment. Do not run development migrations automatically in production.
4. Deploy and verify that `/admin` redirects to `/admin/login` when signed out, bad credentials fail, good credentials open `/admin`, and `/api/admin/settings` returns 401 without a session.
5. Configure HTTPS and rotate the admin password/hash and auth secret if they were ever exposed.

## Important boundaries
- The current Command Center screen still stores its interactive state in browser `localStorage`; it does not yet call `/api/admin/settings`. The database API is a secured foundation, not a claim that every panel has been connected.
- This login uses a single environment-defined super-admin account. It does not implement user provisioning, database-backed RBAC, MFA, password reset, audit log persistence, or brute-force throttling. Add rate limiting at the edge/hosting layer before public production exposure.
- PostgreSQL schema exists but this repository has not been supplied with a generated Prisma migration. Create and commit the migration before expecting database operations to work.
- A full Next.js production build has not been confirmed in this environment. Run the deployment checks above before treating this as production-ready.
