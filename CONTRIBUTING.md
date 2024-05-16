# next-admin

## What's inside?

An auto generated admin from Prisma models for your Next.js app.

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `next-admin`: the admin library used by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Workflow

The project workflow uses GitHub Actions to run tests, build, deploy (prod - preview - docs) and publish packages. To handle versioning up and publishing, we use [Changesets](https://github.com/changesets/changesets) 

#### Current major release features

If you want to contribute on the current major version, you can create a PR on the `develop` branch. Any merged PR on the `develop` branch that contains `changeset` files will create a `changeset-release/main` PR that you can merge into `main` to release a new version.

![schema-develop](https://github.com/premieroctet/next-admin/assets/7901622/8ceed2e3-6cca-449f-a250-8dc3e1f16fdf)


#### Hotfix current major release

If you want to do a hotfix for the current major version and there are already features on the `develop` branch, you can create a PR on the `hotfix` branch. Any merged PR on the `hotfix`  branch that contains `changeset` files will create a `hotfix-release/main` PR that you can merge into `main` to release a new version.

![schema-hotfix](https://github.com/premieroctet/next-admin/assets/7901622/a1429da9-3753-4157-ba7a-afb2c1a1f8bc)


#### Fixing an old major release

If you want to fix a previous major version, you can create a PR on the relative branch (fix `v1` on branch `v1`). Any merged PR on those branches that contains `changeset` files will create a PR `changeset-release/[v1|v2|v3]`, which you could merge into `[v1|v2|v3]` to release a new version.

> Note: Make sure that the branch was created from the latest release of the major version you want to fix.

![schema-fix](https://github.com/premieroctet/next-admin/assets/7901622/18d463a2-7bea-4a62-bedb-968c58bc0cd2)

Once a fix has been released, you can cherry-pick the fix on the `develop` branch if that fix is still relevant.

### Build

To build all apps and packages, run the following command:

```
yarn run build
```

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
docker-compose up
cd apps/example && yarn database
```

### E2E

Tests are using Playwright to test directly with a browser.

You can write and debug tests easily with this commande

```
cd apps/example
npx playwright install
npx playwright test --ui
```
