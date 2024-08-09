---
"@premieroctet/next-admin": major
---

## Major Changes

- **Breaking Change**:

  - New implementation of `NextAdmin`. Usage of `API route` instead of `server actions`.
  - Configuration of `page.tsx` and `route.ts` files in the `app/admin/[[...nextadmin]]` and `app/api/[[...nextadmin]]` folders respectively.
  - `createHandler` function now available in `appHandler` and `pageHandler` modules to configure the API route.
  - `getNextAdminProps` function now available in `appRouter` and `pageRouter` modules to configure the page route.

## Migration

### API Route `[[...nextadmin]]`

Create a dynamic route `[[...nextadmin]]` to handle all the API routes.

<details>
<summary>App router</summary>

```tsx
// app/api/admin/[[...nextadmin]]/route.ts
import { prisma } from "@/prisma";
import { createHandler } from "@premieroctet/next-admin/dist/appHandler";

const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  /*options*/
});

export { run as DELETE, run as GET, run as POST };
```

</details>

<details>
<summary>Page router</summary>

```ts copy
  // pages/api/admin/[[...nextadmin]].ts
  import { prisma } from "@/prisma";
  import { createApiRouter } from "@premieroctet/next-admin/dist/pageHandler";
  import schema from "@/prisma/json-schema/json-schema.json";

  export const config = {
    api: {
      bodyParser: false,
    },
  };

  const { run } = createHandler({
    apiBasePath: "/api/admin",
    prisma,
    schema: schema,
    /*options*/,
  });

  export default run;
```

</details>

### Change `getPropsFromParams` to `getNextAdminProps`

<details>
<summary>App router</summary>

Replace the `getPropsFromParams` function with the `getNextAdminProps` function in the `page.tsx` file.

```tsx
// app/admin/[[...nextadmin]]/page.tsx
import { NextAdmin, PageProps } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/dist/appRouter";
import { prisma } from "@/prisma";

export default async function AdminPage({ params, searchParams }: PageProps) {
  const props = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    /*options*/
  });

  return <NextAdmin {...props} />;
}
```

</details>

<details>
<summary>Page router</summary>

Do not use `nextAdminRouter` anymore. Replace it with the `getNextAdminProps` function in the `[[...nextadmin]].ts` file for `getServerSideProps`.

```tsx copy
// pages/admin/[[...nextadmin]].tsx
import { AdminComponentProps, NextAdmin } from "@premieroctet/next-admin";

import { getNextAdminProps } from "@premieroctet/next-admin/dist/pageRouter";
import { GetServerSideProps } from "next";
import { prisma } from " @/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import "@/styles.css";

export default function Admin(props: AdminComponentProps) {
  return (
    <NextAdmin
      {...props}
      /*options*/
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) =>
  await getNextAdminProps({
    basePath: "/pagerouter/admin",
    apiBasePath: "/api/pagerouter/admin",
    prisma,
    schema,
    /*options*/
    req,
  });
```
