# Deploy Firebase Hosting

## Current Firebase setup

- Project: `gzvmarketing`
- Hosting site: `gzvmarketing`
- Default URL: `https://gzvmarketing.web.app`
- Custom domain: `https://marketing.gzv.one`
- DNS currently resolves `marketing.gzv.one` to `gzvmarketing.web.app`.

## Required once on this Windows machine

Firebase framework deploy for Next.js creates symlinks while packaging the server function.
On Windows, enable one of these before deploying:

- Turn on **Developer Mode** in Windows settings, then restart the terminal.
- Or run PowerShell / Terminal as **Administrator**.

Then run:

```powershell
npm run firebase:enable-frameworks
npm run deploy:hosting
```

## Important billing note

This app has dynamic routes, admin pages, server actions, middleware, and API routes.
Firebase Hosting will package a Cloud Function for the Next.js server. That requires Firebase/Google Cloud backend resources, so the project may need the Blaze plan before the deploy can finish.

If Firebase App Hosting is preferred, the project must also be on Blaze before an App Hosting backend can be created.

## Why `gzvmarketing.web.app` currently shows Site Not Found

The repo previously had no `hosting` block in `firebase.json`, so only Firestore rules/indexes were configured. No Hosting release had been deployed for the default Hosting site.
