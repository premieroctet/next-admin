# @premieroctet/next-admin-cli

## 0.0.8

### Patch Changes

- [8c3e567](https://github.com/premieroctet/next-admin/commit/8c3e567de41f85902266ef89e88b4dc2776dffe5): feat: support all frameworks, with provided adapters for Next.js, Remix and TanStack Start

  This introduces a few breaking changes :

  - The `NextAdmin` component now requires to be imported from the correct adapter

  ```tsx
  import { NextAdmin } from "@premieroctet/next-admin/adapters/next";

  // in the page render
  <NextAdmin {...adminProps} />;
  ```

  - For Next.js Page Router, the `req` property of the `getNextAdminProps` function has been removed in favor of `url`, since we only need the URL from the request. Example :

  ```ts
  await getNextAdminProps({
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    options,
    url: req.url!,
  });
  ```

  - Page loading indicator has now been removed and can be provided directly as a prop. A loader is exposed by the library to be used in Next.js projects.

  ```tsx
  import PageLoader from "@premieroctet/next-admin/pageLoader";

  <NextAdmin {...adminProps} pageLoader={<PageLoader />} />;
  ```

## 0.0.7

### Patch Changes

- [97d9a35](https://github.com/premieroctet/next-admin/commit/97d9a35bb60b1bd03c5bae767f297fad956885fb): feat: support Next 15

## 0.0.6

### Patch Changes

- [248838e](https://github.com/premieroctet/next-admin/commit/248838e05921f4ac9225588ef184448858c65cea): chore: add extra instructions for app router

## 0.0.5

### Patch Changes

- [64737aa](https://github.com/premieroctet/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): Apply dist/
- [64737aa](https://github.com/premieroctet/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): Fix generator
- [64737aa](https://github.com/premieroctet/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): feat: support new generator ([#414](https://github.com/premieroctet/next-admin/issues/414))

## 0.0.5-rc.3

### Patch Changes

- Fix generator

## 0.0.5-rc.1

### Patch Changes

- Apply dist/

## 0.0.5-rc.0

### Patch Changes

- [1fa56bc](https://github.com/premieroctet/next-admin/commit/1fa56bc): feat: support new generator ([#414](https://github.com/premieroctet/next-admin/issues/414))

## 0.0.4

### Patch Changes

- [1751f93](https://github.com/premieroctet/next-admin/commit/1751f93): fix: add missing package name in install instructions in CLI

## 0.0.3

### Patch Changes

- [62436a5](https://github.com/premieroctet/next-admin/commit/62436a5): fix: update for page router

## 0.0.2

### Patch Changes

- [dce87b0](https://github.com/premieroctet/next-admin/commit/dce87b0): fix: remove useless headlessui tailwind plugin

## 0.0.1

### Patch Changes

- [99ae52e](https://github.com/premieroctet/next-admin/commit/99ae52e): feat: next-admin CLI to init the required files ([#413](https://github.com/premieroctet/next-admin/issues/413))
