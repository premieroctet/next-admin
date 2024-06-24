# Next Admin

[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/npm/v/@premieroctet/next-admin/latest)](https://www.npmjs.com/package/@premieroctet/next-admin)

`next-admin` provides a customizable and turnkey admin dashboard for applications built with Next.js and powered by the Prisma ORM. It aims to simplify the development process by providing a turnkey admin system that can be easily integrated into your project.

<div align="center" style="display:flex;flex-direction:column;">
  <a href="https://next-admin.js.org">
    <img src="https://next-admin.js.org/screenshot.png" alt="Next Admin" />
  </a>
</div>

[https://next-admin.js.org](https://next-admin.js.org)

## Features

- 💅 Customizable admin dashboard
- 💽 Database relationships management
- 👩🏻‍💻 User management (CRUD operations)
- 🎨 Dashboard widgets and customizable panels
- ⚛️ Integration with Prisma ORM
- 👔 Customizable list and form
- ⚙️ Supports App Router and Page Router

## Installation

To install the library, run the following command:

```shell copy
yarn add @premieroctet/next-admin prisma-json-schema-generator
```

## Documentation

For detailed documentation, please refer to the [documentation](https://next-admin-docs.vercel.app/).

## Usage

To use the library in your Next.js application, follow these steps:

1. Add tailwind preset to your `tailwind.config.js` file - [more details](http://next-admin-docs.vercel.app/docs/getting-started#tailwindcss)
2. Add json schema generator to your Prisma schema file - [more details](http://next-admin-docs.vercel.app/docs/getting-started#prisma)
3. Generate the schema with `yarn run prisma generate`
4. Create a catch-all segment page `page.tsx` in the `app/admin/[[...nextadmin]]` folder - [more details](http://next-admin-docs.vercel.app/docs/getting-started#page-nextadmin)
5. Create an catch-all API route `route.ts` in the `app/api/[[...nextadmin]]` folder - [more details](http://next-admin-docs.vercel.app/docs/getting-started#api-route-nextadmin)

Bonus: Customize the admin dashboard by passing the `NextAdminOptions` options to the router and customize the admin dashboard by passing `dashboard` props to `NextAdmin` component. (More details in the [documentation](http://next-admin-docs.vercel.app/docs/getting-started#next-admin-options---optional))

## Example

Here's a basic example of how to use the library:

#### TailwindCSS

Add the following configuration to your `tailwind.config.js` file

```typescript copy
module.exports = {
  content: [
    "./node_modules/@premieroctet/next-admin/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  presets: [require("@premieroctet/next-admin/dist/preset")],
};
```

#### Prisma

Add the `jsonSchema` generator to your `schema.prisma` file

```prisma copy
// prisma/schema.prisma
generator jsonSchema {
  provider = "prisma-json-schema-generator"
  includeRequiredFields = "true"
}
```

Then run the following command :

```bash copy
yarn run prisma generate
```

#### App router

Configure `page.tsx` in the `app/admin/[[...nextadmin]]` folder

```tsx copy
// app/admin/[[...nextadmin]]/page.tsx
import { NextAdmin, PageProps } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/dist/appRouter";
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import "@/styles.css"; // .css file containing tailiwnd rules

export default async function AdminPage({ params, searchParams }: PageProps) {
  const props = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    schema,
    /*options*/
  });

  return <NextAdmin {...props} />;
}
```

Configure `route.ts` in the `app/api/[[...nextadmin]]` folder

```ts copy
// app/api/admin/[[...nextadmin]]/route.ts
import { prisma } from "@/prisma";
import schema from "@/prisma/json-schema/json-schema.json";
import { createHandler } from "@premieroctet/next-admin/dist/appHandler";

const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  schema,
  /*options*/
});

export { run as DELETE, run as GET, run as POST };
```

#### Start the server

Run the following command to start the server:

```bash copy
yarn dev
```

## 📄 Documentation

For detailed documentation, please refer to the [documentation](https://next-admin-docs.vercel.app/).

## 🚀 Demonstration

You can find the library code in the [next-admin](https://github.com/premieroctet/next-admin) repository.

Also you can find a deployed version of the library [here](https://next-admin-po.vercel.app/).

## Sponsors

This project is being developed by [Premier Octet](https://www.premieroctet.com), a Web and mobile agency specializing in React and React Native developments.

## License

This library is open source and released under the [MIT License](https://opensource.org/licenses/MIT).
