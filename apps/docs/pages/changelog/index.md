# @premieroctet/next-admin

## 4.2.1

### Patch Changes

- [d6e88ea](https://github.com/premieroctet/next-admin/commit/d6e88ea): Remove querystring library ([#273](https://github.com/premieroctet/next-admin/issues/273))

## 4.2.0

### Minor Changes

- [167517b](https://github.com/premieroctet/next-admin/commit/167517b): Add preconfigured prisma filters on list page
- [f5afd73](https://github.com/premieroctet/next-admin/commit/f5afd73): feat: add field selection for relationship sort ([#258](https://github.com/premieroctet/next-admin/issues/258))
- [58a2727](https://github.com/premieroctet/next-admin/commit/58a2727): Change file handler function parameter type to File (more informations)
- [3049a83](https://github.com/premieroctet/next-admin/commit/3049a83): Add possibly to apply required HTML validation on fields ([#257](https://github.com/premieroctet/next-admin/issues/257))
- [50ed9a0](https://github.com/premieroctet/next-admin/commit/50ed9a0): feat: add deletion message customization ([#254](https://github.com/premieroctet/next-admin/issues/254))

### Patch Changes

- [4fe6dac](https://github.com/premieroctet/next-admin/commit/4fe6dac): Fix no fields options error ([#268](https://github.com/premieroctet/next-admin/issues/268))
- [8093d5f](https://github.com/premieroctet/next-admin/commit/8093d5f): Fix outline for checkbox and sr-only span position

## 4.1.0

### Minor Changes

- [31685cb](https://github.com/premieroctet/next-admin/commit/31685cb): feat: add possibility to disable fields
- [ec6bf9f](https://github.com/premieroctet/next-admin/commit/ec6bf9f): Add display for relation fields

### Patch Changes

- [8621043](https://github.com/premieroctet/next-admin/commit/8621043): Allow permissions to model ('create', 'edit', 'delete') ([#222](https://github.com/premieroctet/next-admin/issues/222))
- [33dd15b](https://github.com/premieroctet/next-admin/commit/33dd15b): fix: sort many-to-one relationship in list ([#248](https://github.com/premieroctet/next-admin/issues/248))
- [41cdf6e](https://github.com/premieroctet/next-admin/commit/41cdf6e): fix: formatter on boolean fields ([#249](https://github.com/premieroctet/next-admin/issues/249))
- [07a076e](https://github.com/premieroctet/next-admin/commit/07a076e): - Remove dynamic metadata from appRouter
  - `suppressHydrationWarning` on html tag in example
  - Remove manual submission on form
  - Add empty string as default value for RichTextEditor
- [afe70ec](https://github.com/premieroctet/next-admin/commit/afe70ec): - Move alert message
  - Fix reponsive style
- [0a2f3e8](https://github.com/premieroctet/next-admin/commit/0a2f3e8): Fix dropdown - filter with non-selected value only ([#236](https://github.com/premieroctet/next-admin/issues/236))

## 4.0.0

### Major Changes

- [cd2accd](https://github.com/premieroctet/next-admin/commit/cd2accd): Create an internal preset tailwind

  # Breaking change

  You cannot import the `styles.css` file from the library. You now need to configure Tailwind in your app. See [docs](https://next-admin.js.org/docs/getting-started)

### Minor Changes

- [eae1f85](https://github.com/premieroctet/next-admin/commit/eae1f85): feat: add default sort option

### Patch Changes

- [cd2accd](https://github.com/premieroctet/next-admin/commit/cd2accd): Add dark mode system
- [f67fa2f](https://github.com/premieroctet/next-admin/commit/f67fa2f): fix: throw error for missing params
- [6f87ce8](https://github.com/premieroctet/next-admin/commit/6f87ce8): fix: handle plain strings for rich text html

## 3.6.1

### Patch Changes

- [664160d](https://github.com/premieroctet/next-admin/commit/664160d): fix: richtext html field render
- [c899971](https://github.com/premieroctet/next-admin/commit/c899971): feat: add default label formatting
- [2572ab9](https://github.com/premieroctet/next-admin/commit/2572ab9): chore: upgrade prisma-json-schema-generator version
  fix: selector field for Enums

## 3.6.0

### Minor Changes

- [ddf9c8f](https://github.com/premieroctet/next-admin/commit/ddf9c8f): - Remove search on formatted fields in selector
  - Add new `searchPaginatedResourceAction` option that is required for App Router to do research in Select fields other than enums

### Patch Changes

- [b784778](https://github.com/premieroctet/next-admin/commit/b784778): fix: slugify all resources in urls
- [c050494](https://github.com/premieroctet/next-admin/commit/c050494): feat: add loading state on form
- [02518f0](https://github.com/premieroctet/next-admin/commit/02518f0): fix: label margin with input

## 3.5.3

### Patch Changes

- [2735171](https://github.com/premieroctet/next-admin/commit/2735171): fix: fix checkboxes appearance + firefox issue

## 3.5.2

### Patch Changes

- [8ee0209](https://github.com/premieroctet/next-admin/commit/8ee0209): fix: custom pages in menu

## 3.5.1

### Patch Changes

- [15482d4](https://github.com/premieroctet/next-admin/commit/15482d4): fix: ui fixes on Menu component

## 3.5.0

### Minor Changes

- [c09c70c](https://github.com/premieroctet/next-admin/commit/c09c70c): feat: revamp design
- [3fa5cd7](https://github.com/premieroctet/next-admin/commit/3fa5cd7): feat: add tooltip, helper text and notice
- [9aec4d0](https://github.com/premieroctet/next-admin/commit/9aec4d0): feat: configure global title
- [03bdc6d](https://github.com/premieroctet/next-admin/commit/03bdc6d): feat: add icons for resources in sidebar and titles
- [2325ddd](https://github.com/premieroctet/next-admin/commit/2325ddd): feat: add option for external links in sidebar
- [289539d](https://github.com/premieroctet/next-admin/commit/289539d): feat: update checkbox ui, fix rich text editor
- [e8b0225](https://github.com/premieroctet/next-admin/commit/e8b0225): feat: add user informations & logout
- [df2efce](https://github.com/premieroctet/next-admin/commit/df2efce): feat: add groups configuration in sidebar
- [f6ba512](https://github.com/premieroctet/next-admin/commit/f6ba512): feat: redirect to first resource if dashboard doesnt exist

## 3.4.0

### Minor Changes

- [150787b](https://github.com/premieroctet/next-admin/commit/150787b): feat: ui revamp, add theming capability

## 3.3.1

### Patch Changes

- [4c34134](https://github.com/premieroctet/next-admin/commit/4c34134): feat: migrate to nextjs-toploader, compatible with app dir
- [5d40824](https://github.com/premieroctet/next-admin/commit/5d40824): feat: add clipboard for table cells
- [5ca2b7b](https://github.com/premieroctet/next-admin/commit/5ca2b7b): feat: add search for enum fields
- [cbc3797](https://github.com/premieroctet/next-admin/commit/cbc3797): fix: fix combobox search on nullable values

## 3.3.0

### Minor Changes

- [e16aa42](https://github.com/premieroctet/next-admin/commit/e16aa42): feat: add custom error message for upload handler ([#144](https://github.com/premieroctet/next-admin/issues/144))
  feat: add custom error message for form submission

### Patch Changes

- [104aaba](https://github.com/premieroctet/next-admin/commit/104aaba): fix: image display in file input field ([#154](https://github.com/premieroctet/next-admin/issues/154))

## 3.2.7

### Patch Changes

- [55a6506](https://github.com/premieroctet/next-admin/commit/55a6506): Fix: allow sublevel on items in select
- [15d2e83](https://github.com/premieroctet/next-admin/commit/15d2e83): Turn utils function file into non server component
- [b4b8a92](https://github.com/premieroctet/next-admin/commit/b4b8a92): Remove query-builder and unused styles
- [4ef126f](https://github.com/premieroctet/next-admin/commit/4ef126f): Fix: Order by alias name in list

## 3.2.6

### Patch Changes

- [382ac9a](https://github.com/premieroctet/next-admin/commit/382ac9a): Richtext Editor : Add `slate` dependencies as optional = To use richtext editor, install the corresponding version of `slate`, `slate-history` and `slate-react`
- [bb41a1d](https://github.com/premieroctet/next-admin/commit/bb41a1d): Change button in form, add save and continue button
- [c01ca4d](https://github.com/premieroctet/next-admin/commit/c01ca4d): Fix text area input field
- [5098926](https://github.com/premieroctet/next-admin/commit/5098926): Add a warning message if the form is modified and not saved
- [89d1a85](https://github.com/premieroctet/next-admin/commit/89d1a85): Custom style for form
- [2253dbd](https://github.com/premieroctet/next-admin/commit/2253dbd): Apply search on formatted field in form
- [c3b875e](https://github.com/premieroctet/next-admin/commit/c3b875e): Add `@monaco-editor` as optionalDependencies - To use the JSON editor, install the corresponding version of `@monaco-editor/react`

## 3.2.5

### Patch Changes

- [6697dd2](https://github.com/premieroctet/next-admin/commit/6697dd2): Add deep access for relationship formatter

## 3.2.4

### Patch Changes

- [8434ec4](https://github.com/premieroctet/next-admin/commit/8434ec4): BigInt support

## 3.2.3

### Patch Changes

- [b26d0ae](https://github.com/premieroctet/next-admin/commit/b26d0ae): Support Decimal and Float Prisma
- [e3ee58a](https://github.com/premieroctet/next-admin/commit/e3ee58a): Add one level of access model in optionFormatter option

## 3.2.2

### Patch Changes

- [08d8a1e](https://github.com/premieroctet/next-admin/commit/08d8a1e): Add redirection on relationship fields
- [961996d](https://github.com/premieroctet/next-admin/commit/961996d): Fix optional relationship on creation
- [84dc855](https://github.com/premieroctet/next-admin/commit/84dc855): Possibility hide even id column in form
- [6285e36](https://github.com/premieroctet/next-admin/commit/6285e36): Possibility to not display search field on list if search option is an empty array. In case search options are not defined, all scalar fields are concerned
- [a1aa499](https://github.com/premieroctet/next-admin/commit/a1aa499): Add aliases options to rename columns name and form label

## 3.2.1

### Patch Changes

- [8af3cc9](https://github.com/premieroctet/next-admin/commit/8af3cc9): Fix parse error on relationship

## 3.2.0

### Minor Changes

- [ce1c30c](https://github.com/premieroctet/next-admin/commit/ce1c30c): Only allow the relationship field in the configuration, not the field that carries the relationship at all - this allows several fields to be used in the Prisma @relation options
- [2da9588](https://github.com/premieroctet/next-admin/commit/2da9588): 🌐 add i18n support

### Patch Changes

- [8fcfa08](https://github.com/premieroctet/next-admin/commit/8fcfa08): Add limit of 20 items on select for relationship
- [8fcfa08](https://github.com/premieroctet/next-admin/commit/8fcfa08): Fix search in enumeration selector
- [7204981](https://github.com/premieroctet/next-admin/commit/7204981): Fix search for relationship fields and enum fields
- [c962865](https://github.com/premieroctet/next-admin/commit/c962865): Order fields in form according to display options order
- [e1ee443](https://github.com/premieroctet/next-admin/commit/e1ee443): Fix insensitive search for MySQL providers
- [ce1c30c](https://github.com/premieroctet/next-admin/commit/ce1c30c): Form submitted with error will keep the state with user modification

## 3.1.2

### Patch Changes

- [318748b](https://github.com/premieroctet/next-admin/commit/318748b): Fix form issue: relationship field are not displayed in form
- [318748b](https://github.com/premieroctet/next-admin/commit/318748b): Display all properties even if editOptions are not empty

## 3.1.1

### Patch Changes

- [3c67158](https://github.com/premieroctet/next-admin/commit/3c67158): Fix optionFormatter function

## 3.1.0

### Minor Changes

- [cbf6925](https://github.com/premieroctet/next-admin/commit/cbf6925): 📄 add option for custom pages

  In the `options`, add

  ```tsx
  pages: {
    "/custom": {
      title: "Custom page",
      component: CustomPage,
    },
  },
  ```

  In the above example, navigating to `<basePath>/custom` will render the `CustomPage` component, in addition with the persistent Next Admin components (header, sidebar, message).

- [a261bc5](https://github.com/premieroctet/next-admin/commit/a261bc5): # New feature

  ✏️ add ability to render a custom input

- [4ddf12f](https://github.com/premieroctet/next-admin/commit/4ddf12f): 🛠 add ability to create custom actions on resources
- [244820a](https://github.com/premieroctet/next-admin/commit/244820a): use the `@id` field of a model as the id field instead of defaulting to "id"
- [2d3f8ac](https://github.com/premieroctet/next-admin/commit/2d3f8ac): # New feature

  ✨ Override model name in UI

- [28053ff](https://github.com/premieroctet/next-admin/commit/28053ff): add option `optionFormatter` to format select option of a related model at field option level
- [603b499](https://github.com/premieroctet/next-admin/commit/603b499): 🛠 add support for JSON fields
- [af7f123](https://github.com/premieroctet/next-admin/commit/af7f123): 🪄 allow sort by relationship count

### Patch Changes

- [11c3b5a](https://github.com/premieroctet/next-admin/commit/11c3b5a): feat: allow slug version of model in url

## 3.0.1

### Patch Changes

- [84ea409](https://github.com/premieroctet/next-admin/commit/84ea409): chore: update docs

## 3.0.0

### Major Changes

- [16aba39](https://github.com/premieroctet/next-admin/commit/16aba39): # New feature

  - App router is now supported. You can find an exemple of its usage in the example app.
  - New context object, currently passed only to the `formatter` function

  You can now use App Router like the following:

  ```tsx
  // app/admin/[[...nextadmin]]/page.tsx
  import { NextAdmin } from "@premieroctet/next-admin";
  import { getPropsFromParams } from "@premieroctet/next-admin/dist/appRouter";
  import "@premieroctet/next-admin/dist/styles.css";
  import Dashboard from "../../../components/Dashboard";
  import { options } from "../../../options";
  import { prisma } from "../../../prisma";
  import schema from "../../../prisma/json-schema/json-schema.json"; // generated by prisma-json-schema-generator on yarn run prisma generate
  import "../../../styles.css";
  import { submitFormAction } from "../../../actions/nextadmin";

  export default async function AdminPage({
    params,
    searchParams,
  }: {
    params: { [key: string]: string[] };
    searchParams: { [key: string]: string | string[] | undefined } | undefined;
  }) {
    const props = await getPropsFromParams({
      params: params.nextadmin,
      searchParams,
      options,
      prisma,
      schema,
      action: submitFormAction,
    });

    return <NextAdmin {...props} dashboard={Dashboard} />;
  }
  ```

## 2.0.0

### Major Changes

- [dbb5a3e](https://github.com/premieroctet/next-admin/commit/dbb5a3e): - Always fetch `id` property from items

  - Hide `id`column in list if it doesn't have `display: true` options
  - Mutualize `NextAdminOptions` to reduce useless duplication of code
  - Add file upload input

  ⚠️ **Breaking Changes**

  To reduce the complexity and duplication of next-admin options, this PR contains major changes to the structure of the options.

  - Changed structure for `display` and `search` properties: fields are now entered as an array

### Patch Changes

- [dbb5a3e](https://github.com/premieroctet/next-admin/commit/dbb5a3e): Add formatting system to relationship column
- [dbb5a3e](https://github.com/premieroctet/next-admin/commit/dbb5a3e): Add ability to choose format type for Date property between date-time and date in edit options
  Introduce handler object to handle custom logic for a property in edit mode
  Add ability to use input variant in edit mode
  Fix datetime-local input to store correct datetime

## 1.4.1

### Patch Changes

- [02a7fac](https://github.com/premieroctet/next-admin/commit/02a7fac): fix: validation crash and improve typing
- [52d5838](https://github.com/premieroctet/next-admin/commit/52d5838): feat: improve ui and demo

## 1.4.0

### Minor Changes

- [1fe2774](https://github.com/premieroctet/next-admin/commit/1fe2774): feat: display currently selected menu
- [dd0aa0d](https://github.com/premieroctet/next-admin/commit/dd0aa0d): feat: loading indicator on client side navigation
- [96dd99b](https://github.com/premieroctet/next-admin/commit/96dd99b): Add e2e tests
- [c6459e8](https://github.com/premieroctet/next-admin/commit/c6459e8): feat: add Prisma 5 compatibility
- [06c44a7](https://github.com/premieroctet/next-admin/commit/06c44a7): feat: dynamic base path
- [088bfc9](https://github.com/premieroctet/next-admin/commit/088bfc9): feat: data server validation

## 1.3.8

### Patch Changes

- [649b547](https://github.com/premieroctet/next-admin/commit/649b547): feat: field formatter option
- [1c3f590](https://github.com/premieroctet/next-admin/commit/1c3f590): feat: hide models that are not defined in admin options
- [bb27872](https://github.com/premieroctet/next-admin/commit/bb27872): refactor: ressource -> resource

## 1.3.7

### Patch Changes

- [7bcf33c](https://github.com/premieroctet/next-admin/commit/7bcf33c): change package properties

  Change type: fix

## 1.3.6

### Patch Changes

- [7bcf33c](https://github.com/premieroctet/next-admin/commit/7bcf33c): change package properties

## 1.3.5

### Patch Changes

- [c7bbf42](https://github.com/premieroctet/next-admin/commit/c7bbf42): Support differents name case

## 1.3.4

### Patch Changes

- Date input changes

## 1.3.3

### Patch Changes

- change list style, serialize date

## 1.3.2

### Patch Changes

- Patch

## 1.3.1

### Patch Changes

- Support id as string

## 1.3.0

### Minor Changes

- Relationships of model

## 1.2.0

### Minor Changes

- Fix prisma peer dependency

## 1.1.1

### Patch Changes

- Fix router compat

## 1.1.0

### Minor Changes

- [e752c5b](https://github.com/premieroctet/next-admin/commit/e752c5b): Fix multiple entry points and css bundling

## 1.0.0

### Major Changes

- [6af8145](https://github.com/premieroctet/next-admin/commit/6af8145): Fist release of @premieroctet/next-admin package (unstable)
