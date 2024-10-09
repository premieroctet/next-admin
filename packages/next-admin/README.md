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

### With the CLI

```shell copy
npx @premieroctet/next-admin-cli@latest init
```

### Manually

To install the library, run the following command:

```shell copy
yarn add @premieroctet/next-admin @premieroctet/next-admin-generator-prisma
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

## What does it look like?

An example of `next-admin` options:

```tsx
// app/admin/options.ts
import { NextAdminOptions } from "@premieroctet/next-admin";

export const options: NextAdminOptions = {
  title: "⚡️ My Admin Page",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      title: "Users",
      icon: "UsersIcon",
      list: {
        search: ["name", "email"],
        filters: [
          {
            name: "is Admin",
            active: false,
            value: {
              role: {
                equals: "ADMIN",
              },
            },
          },
        ],
      },
    },
    Post: {
      toString: (post) => `${post.title}`,
    },
    Category: {
      title: "Categories",
      icon: "InboxStackIcon",
      toString: (category) => `${category.name}`,
      list: {
        display: ["name", "posts"],
      },
      edit: {
        display: ["name", "posts"],
      },
    },
  },
  pages: {
    "/custom": {
      title: "Custom page",
      icon: "AdjustmentsHorizontalIcon",
    },
  },
  externalLinks: [
    {
      label: "Website",
      url: "https://www.myblog.com",
    },
  ],
  sidebar: {
    groups: [
      {
        title: "Users",
        models: ["User"],
      },
      {
        title: "Categories",
        models: ["Category"],
      },
    ],
  },
};
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
