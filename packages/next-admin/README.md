<div align="center">

# Next Admin

**Open-source admin panel for Next.js and Prisma**

[![npm version](https://img.shields.io/npm/v/@premieroctet/next-admin/latest)](https://www.npmjs.com/package/@premieroctet/next-admin)
[![npm downloads](https://img.shields.io/npm/dm/@premieroctet/next-admin)](https://www.npmjs.com/package/@premieroctet/next-admin)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[Documentation](https://next-admin.js.org/docs) · [Live demo](https://next-admin-po.vercel.app) · [Getting started](https://next-admin.js.org/docs/getting-started) · [Changelog](https://next-admin.js.org/changelog)

<a href="https://next-admin-po.vercel.app">
  <img src="https://next-admin.js.org/screenshot.png" alt="Next Admin dashboard showing a users list with sidebar navigation, search, pagination and an Add button" />
</a>

</div>

Next Admin turns your Prisma schema into a customizable admin dashboard and back-office for your app. It gives you list and edit views, relationship management, search, filters, CSV export and custom pages, and works with the Next.js App Router and Pages Router, Remix and TanStack Start.

## Features

- 💅 Customizable admin dashboard
- 💽 Database relationships management
- 👩🏻‍💻 User management (CRUD operations)
- 🎨 Dashboard widgets and customizable panels
- ⚛️ Integration with Prisma ORM
- 👔 Customizable list and form
- ⚙️ Support for Next.js (App Router and Pages Router), Remix, TanStack Start
- 🚀 Support for any full stack framework

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

For detailed documentation, please refer to the [documentation](https://next-admin.js.org/docs).

## Usage

To use the library in your Next.js application, follow these steps:

1. Add tailwind preset to your `tailwind.config.js` file - [more details](https://next-admin.js.org/docs/getting-started#tailwindcss)
2. Add json schema generator to your Prisma schema file - [more details](https://next-admin.js.org/docs/getting-started#prisma)
3. Generate the schema with `yarn run prisma generate`
4. Create a catch-all segment page `page.tsx` in the `app/admin/[[...nextadmin]]` folder - [more details](https://next-admin.js.org/docs/getting-started)
5. Create an catch-all API route `route.ts` in the `app/api/[[...nextadmin]]` folder - [more details](https://next-admin.js.org/docs/getting-started)

Bonus: Customize the admin dashboard by passing the `NextAdminOptions` options to the router and customize the admin dashboard by passing `dashboard` props to `NextAdmin` component. (More details in the [documentation](https://next-admin.js.org/docs/getting-started#next-admin-options---optional))

## What does it look like?

<table>
  <tr>
    <th>List view</th>
    <th>Edit view</th>
  </tr>
  <tr>
    <td><img src="https://next-admin.js.org/docs/list-view.png" alt="Users list in dark mode with search, quick filters, CSV export and pagination" /></td>
    <td><img src="https://next-admin.js.org/docs/edit-view.png" alt="User edit form in dark mode with a validation notice, relation picker, enum select, file upload and JSON editor" /></td>
  </tr>
</table>

Everything is configured from a single options object:

```tsx
// app/admin/options.ts
import { NextAdminOptions } from "@premieroctet/next-admin";

export const options: NextAdminOptions = {
  title: "⚡️ My Admin Page",
  model: {
    User: {
      toString: (user) => `${user.name} (${user.email})`,
      list: {
        search: ["name", "email"],
        filters: [
          { name: "is Admin", active: false, value: { role: { equals: "ADMIN" } } },
        ],
      },
    },
  },
};
```

See the [options reference](https://next-admin.js.org/docs/api/options) and [model configuration](https://next-admin.js.org/docs/api/model-configuration) for everything you can customize.

## Sponsors

This project is being developed by [Premier Octet](https://www.premieroctet.com), a Web and mobile agency specializing in React and React Native developments.

## License

This library is open source and released under the [MIT License](https://opensource.org/licenses/MIT).
