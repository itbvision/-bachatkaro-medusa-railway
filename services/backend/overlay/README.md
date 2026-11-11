# Category images - backend overlay (Medusa, apps/backend)

Upload the `overlay` folder into the `overlay` folder of your BACKEND GitHub fork (it is copied onto apps/backend at build time).

1. If your backend repo already has overlay/src/api/middlewares.ts, merge the routes by hand instead of overwriting.
2. Add this line to the backend Dockerfile right after the `COPY overlay/ apps/backend/` line (before pnpm install / build):
       RUN cd apps/backend && node scripts/patch-medusa-config.mjs
   It registers ./src/modules/product-media in medusa-config.ts. The build fails loudly if it cannot.
3. Needs Medusa v2.21 or newer (allowFields). The migration is hand-written (src/modules/product-media/migrations) and runs with `medusa db:migrate`.
