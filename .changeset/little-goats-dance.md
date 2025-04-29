---
"@premieroctet/next-admin": major
"@premieroctet/next-admin-cli": patch
---

feat: support all frameworks, with provided adapters for Next.js, Remix and TanStack Start

This introduces a few breaking changes :

- The `NextAdmin` component now requires to be wrapped with `NextAdminRouterAdapter`

```tsx
import { NextAdminRouterAdapter } from "@premieroctet/next-admin/adapters/next";

// in the page render
<NextAdminRouterAdapter>
  <NextAdmin {...adminProps} />
</NextAdminRouterAdapter>;
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

<NextAdminRouterAdapter>
  <NextAdmin {...adminProps} pageLoader={<PageLoader />} />
</NextAdminRouterAdapter>;
```
