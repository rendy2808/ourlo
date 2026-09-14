# Ourlo

Nuxt landing page and guest-flow demo for **Ourlo — This moment is ours.**

## Run

```sh
npm install
npm run dev
```

## Local database

Development uses Node's built-in SQLite driver and stores data in `.data/ourlo.sqlite`.

```sh
npm run db:migrate
npm run db:seed
npm run db:status
```

Set `NUXT_LOCAL_DATABASE_PATH` to use another database file. The database file is ignored by Git.

Create or reset the single local admin account with environment variables:

```sh
OURLO_ADMIN_EMAIL="you@example.com" OURLO_ADMIN_PASSWORD="a-long-local-password" npm run db:admin
```

Then open `/admin/login`. Admin passwords use scrypt hashes and login sessions are stored as hashed, expiring tokens in SQLite. No admin credentials are committed to the repository.

## Build

```sh
npm run build
```

## Preview access

Every page is covered by a lightweight browser prompt. The passcode is shared privately with preview viewers and is not printed in this repository.

The passcode gate runs in client-side JavaScript and is intended to keep a public concept preview out of casual view. It is not secure authentication; use server-side access control before hosting sensitive material.

## GitHub Pages

Pushes to `main` run `.github/workflows/deploy-pages.yml`. The workflow generates the static Nuxt site using the repository name as its base path and deploys `.output/public` to GitHub Pages.

The project includes:

- `/` — responsive Ourlo landing page with an interactive frame/style preview.
- `/demo` — a complete guest-flow prototype covering event entry, visible allowances, layout selection, local photo selection, sample photos, local and simulated AI styles, processing, and a finished save/share screen.
- `/admin/login` — server-authenticated local admin access.
- `/admin/events` — local event creation, editing, status, quotas, and deletion.

The guest demo runs entirely in the browser. Its AI effect and processing step are simulated, and selected local photos are never uploaded. The admin API needs a running Nuxt server and is unavailable in the static GitHub Pages build. Supabase, R2, payments, Google Drive delivery, and a real image compositor are not connected.

Original generated assets are in `public/images/`. Font families: DM Sans, DM Serif Display, and Caveat (Google Fonts). See `ASSETS.md` for image prompts and provenance.
