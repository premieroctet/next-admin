# @premieroctet/next-admin

## 8.2.1

### Patch Changes

- [7ce7fee](https://github.com/premieroctet/next-admin/commit/7ce7fee61bad32fac6118dce49897edbae100cf8): chore: upgrade @rjsf/utils ([#545](https://github.com/premieroctet/next-admin/issues/545))

## 8.2.0

### Minor Changes

- [63b7b18](https://github.com/premieroctet/next-admin/commit/63b7b1869c316503db80aa796cee37735cfeaa14): feat: add default list size option ([#616](https://github.com/premieroctet/next-admin/issues/616))

### Patch Changes

- [891524f](https://github.com/premieroctet/next-admin/commit/891524f3f2d4ebfc2e0c11f9c53848d8020519b6): chore: remove forgotten log in app handler ([#617](https://github.com/premieroctet/next-admin/issues/617))

## 8.1.4

### Patch Changes

- [362aaaa](https://github.com/premieroctet/next-admin/commit/362aaaa92da7df8a49fd83dc26d6d400fc918a63): fix: infinite queries in select widget ([#612](https://github.com/premieroctet/next-admin/issues/612))

## 8.1.3

### Patch Changes

- [fe5e1c3](https://github.com/premieroctet/next-admin/commit/fe5e1c3c166265fa0316f2ad35a14baffdf652de): fix: default value for many to many in form ([#605](https://github.com/premieroctet/next-admin/issues/605))

## 8.1.2

### Patch Changes

- [7aefc45](https://github.com/premieroctet/next-admin/commit/7aefc45bdfdd192c5723a37cf3f66a376525beb0): fix: initGlobals app handler ([#605](https://github.com/premieroctet/next-admin/issues/605))

## 8.1.1

### Patch Changes

- [3cdf4e2](https://github.com/premieroctet/next-admin/commit/3cdf4e290b8fd057e8e31ad7dde876f52085bc3b): fix: advanced search on simple relations ([#602](https://github.com/premieroctet/next-admin/issues/602))

## 8.1.0

### Minor Changes

- [8121a90](https://github.com/premieroctet/next-admin/commit/8121a90ab59fe2215ea3c5f938b91fed86557168): feat: add support for Tailwind v4 ([#573](https://github.com/premieroctet/next-admin/issues/573))

## 8.0.0

### Major Changes

- [a05e12f](https://github.com/premieroctet/next-admin/commit/a05e12f9df24f0caf64a5cd6b77d0d48f73a695e): fix: page router display for functional filters
- [75a2932](https://github.com/premieroctet/next-admin/commit/75a2932981e788a051ab89679613b794231ee600): fix: page router formatters
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

- [75a2932](https://github.com/premieroctet/next-admin/commit/75a2932981e788a051ab89679613b794231ee600): feat: change the way to initialize globals

  This is a **Breaking Change**. This changes the `getMainLayoutProps` function to be asynchronous. This will mainly affect custom pages.

## 7.6.5

### Patch Changes

- [18cace8](https://github.com/premieroctet/next-admin/commit/18cace890a3d0840777d23989ea3257df6afb905): fix: default sort on id property

## 7.6.4

### Patch Changes

- [e14d6a4](https://github.com/premieroctet/next-admin/commit/e14d6a45b6544f3d47f335d20505d7facca4e87b): Fix request prisma latency on list
  `formatter` is now taking the count value as a parameter for OneToMany relation fields

## 7.6.3

### Patch Changes

- [0612716](https://github.com/premieroctet/next-admin/commit/061271623c8afee333488c0b0c300ceffd482e1d): fix: error when marking a FileWidget as required
- [e1879b1](https://github.com/premieroctet/next-admin/commit/e1879b1706435e723ab4213dd561107833efa861): feat: expose breadcrumbs to external client
- [e1879b1](https://github.com/premieroctet/next-admin/commit/e1879b1706435e723ab4213dd561107833efa861): feat: export more base components (Breadcrumb, Spinner) as well as inputs

## 7.6.2

### Patch Changes

- [6b6d4f5](https://github.com/premieroctet/next-admin/commit/6b6d4f551334aa09c39256b2be757e6c17937cdb): fix: wrong utils export

## 7.6.1

### Patch Changes

- [6c4fff3](https://github.com/premieroctet/next-admin/commit/6c4fff3ab49758dfa89094a726669710739f0fc5): fix: error with empty list when no display option is specified for a model

## 7.6.0

### Minor Changes

- [fcd835e](https://github.com/premieroctet/next-admin/commit/fcd835e8a6daf3784eec53c4837a1eec13df032c): feat: add custom input item data
  feat: add a new `utils` export, currently containing `useFormData`

## 7.5.2

### Patch Changes

- [d99f749](https://github.com/premieroctet/next-admin/commit/d99f7491ab7fe1d318b3db29db4671156defff34): fix: client dialog action error in prod build

## 7.5.1

### Patch Changes

- [9f4ba10](https://github.com/premieroctet/next-admin/commit/9f4ba10298f5bbd2c2ba9695baa88f7fbc5a61be): fix: absolute url for virtual fields

## 7.5.0

### Minor Changes

- [52a0faf](https://github.com/premieroctet/next-admin/commit/52a0faf2da1d3fa077fa327d885dfb5c2572d5db): feat: add virtual fields ([#559](https://github.com/premieroctet/next-admin/issues/559))

### Patch Changes

- [d22befa](https://github.com/premieroctet/next-admin/commit/d22befaf3791d4eae675cc5daaf8eadb278e220c): feat: add new server side action component ([#514](https://github.com/premieroctet/next-admin/issues/514))

## 7.4.0

### Minor Changes

- [eee26d8](https://github.com/premieroctet/next-admin/commit/eee26d84c3b7c515897c961e4d09fe3a52b24857): feat: add multiple fields for default sort

### Patch Changes

- [5a8031b](https://github.com/premieroctet/next-admin/commit/5a8031ba53f00ef205920f0566d0a3696edab552): Add order mode on table view [#362](https://github.com/premieroctet/next-admin/issues/362)
- [c5f0720](https://github.com/premieroctet/next-admin/commit/c5f0720435c2e07d15faf4088b0fab967d144607): feat: add max items for scalar arrays
- [4950153](https://github.com/premieroctet/next-admin/commit/49501530db21d746bb3b70bd87d364f7532b743e): feat: allow pagination for relationship display
- [323a929](https://github.com/premieroctet/next-admin/commit/323a9294bd0cf3116c8a6dc047bf45c335363d2b): Export <Message /> component to usage in custom pages

## 7.3.1

### Patch Changes

- [811813e](https://github.com/premieroctet/next-admin/commit/811813e7532719fae0b88396123a60b2abe551c4): Fix deleting files ([#535](https://github.com/premieroctet/next-admin/issues/535), [#536](https://github.com/premieroctet/next-admin/issues/536))
- [811813e](https://github.com/premieroctet/next-admin/commit/811813e7532719fae0b88396123a60b2abe551c4): Add scroll in advanced filter modal ([#509](https://github.com/premieroctet/next-admin/issues/509))

## 7.3.0

### Minor Changes

- [e390d30](https://github.com/premieroctet/next-admin/commit/e390d309fe6cc6b7bbb6bbe2f2d3cafb5fcda5a4): feat: allow multifile upload ([#519](https://github.com/premieroctet/next-admin/issues/519))
- [f4d1d95](https://github.com/premieroctet/next-admin/commit/f4d1d957812a353ea66e6bcdacf8c2d569b3711a): feat: add edit and delete middlewares ([#527](https://github.com/premieroctet/next-admin/issues/527) [#528](https://github.com/premieroctet/next-admin/issues/528))

### Patch Changes

- [5854cce](https://github.com/premieroctet/next-admin/commit/5854cce371999758c18f4ff0c9a2a522ed431cf9): feat: add loader skeleton for rich text ([#462](https://github.com/premieroctet/next-admin/issues/462))

## 7.2.0

### Minor Changes

- [7be5369](https://github.com/premieroctet/next-admin/commit/7be5369196355a8a24d6aaf74c7f49266fad6ac3): feat: support react node as title ([#512](https://github.com/premieroctet/next-admin/issues/512))

### Patch Changes

- [522c5b2](https://github.com/premieroctet/next-admin/commit/522c5b20a9920085dc6d532e557a79b990b71fdb): fix: Dialog title and description errors ([#520](https://github.com/premieroctet/next-admin/issues/520))

## 7.1.2

### Patch Changes

- [97ac9bf](https://github.com/premieroctet/next-admin/commit/97ac9bf99b8bb49bd8711cfbf4d06727094bc5a6): Allow custom inputs in array field ([#510](https://github.com/premieroctet/next-admin/issues/510))

## 7.1.1

### Patch Changes

- [5cb3457](https://github.com/premieroctet/next-admin/commit/5cb3457d5ce05cff524fa149030a2b3e706660c7): chore: upgrade heroicons ([#505](https://github.com/premieroctet/next-admin/issues/505))

## 7.1.0

### Minor Changes

- [07d8996](https://github.com/premieroctet/next-admin/commit/07d8996cf4c771fc0e70762518a083489e9d975a): feat: add dynamic filters ([#491](https://github.com/premieroctet/next-admin/issues/491))

### Patch Changes

- [e49ec99](https://github.com/premieroctet/next-admin/commit/e49ec991c538e49d3b593f20d31afd8120f5fb95): fix: broken clickoutside & example custom page
- [71f65ec](https://github.com/premieroctet/next-admin/commit/71f65ece06137baee4a10a8cbbb97f3fd8023a46): fix: dnd on touch devices ([#461](https://github.com/premieroctet/next-admin/issues/461))
- [b762132](https://github.com/premieroctet/next-admin/commit/b7621323bb80862a4d34ed3bcd1f69405bffc6c7): feat: update gear icon to logout icon ([#460](https://github.com/premieroctet/next-admin/issues/460))

## 7.0.2

### Patch Changes

- [bdb6ba0](https://github.com/premieroctet/next-admin/commit/bdb6ba0212a023f8bed10e57417a556c84c250ce): chore: upgrade to React 19, fix some serialization issues on Page Router

## 7.0.1

### Patch Changes

- [46a3dba](https://github.com/premieroctet/next-admin/commit/46a3dbab9b40f535b880fc28f66c7ab39df4feec): Add where clause to model options - Thanks to [@didrikmunther](https://github.com/didrikmunther)
- [9959cfd](https://github.com/premieroctet/next-admin/commit/9959cfdd666ba2789e2fa06855014deb1f35a3ba): When uploading, include record information - Thanks to [@huinalam](https://github.com/huinalam)

## 7.0.0

### Major Changes

- [64737aa](https://github.com/premieroctet/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): feat: add custom generator ([#414](https://github.com/premieroctet/next-admin/issues/414))

### Patch Changes

- [64737aa](https://github.com/premieroctet/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): Fix generator
- [64737aa](https://github.com/premieroctet/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): Explictly install lodash.debounce
- [64737aa](https://github.com/premieroctet/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): Merge main

## 7.0.0-rc.4

### Patch Changes

- Explictly install lodash.debounce

## 7.0.0-rc.3

### Patch Changes

- Fix generator

## 7.0.0-rc.1

### Patch Changes

- [6e060f2](https://github.com/premieroctet/next-admin/commit/6e060f2): Merge main

## 7.0.0-rc.0

### Major Changes

- [1fa56bc](https://github.com/premieroctet/next-admin/commit/1fa56bc): feat: add custom generator ([#414](https://github.com/premieroctet/next-admin/issues/414))

## 6.1.8

### Patch Changes

- [fa0b2af](https://github.com/premieroctet/next-admin/commit/fa0b2af118ba7ec5922ba42904385e9fa7adc2f3): Support Next 15

## 6.1.8-beta.0

### Patch Changes

- [ba36b45](https://github.com/premieroctet/next-admin/commit/ba36b456e4530ae52b96bd1087e21e732e743cc2): Support Next 15

## 6.1.7

### Patch Changes

- [cb7987d](https://github.com/premieroctet/next-admin/commit/cb7987d): Fix advanced filter on nullable field

## 6.1.6

### Patch Changes

- [56ea03b](https://github.com/premieroctet/next-admin/commit/56ea03b): feat: add depth selection for actions ([#443](https://github.com/premieroctet/next-admin/issues/443))
- [81b2e54](https://github.com/premieroctet/next-admin/commit/81b2e54): Fix relation one-to-many - nullable relation
- [3225788](https://github.com/premieroctet/next-admin/commit/3225788): Fix image (get async)

## 6.1.5

### Patch Changes

- [6077955](https://github.com/premieroctet/next-admin/commit/6077955): fix: default boolean display ([#466](https://github.com/premieroctet/next-admin/issues/466))
- [c25f61c](https://github.com/premieroctet/next-admin/commit/c25f61c): fix: crash on undefined relationship length ([#465](https://github.com/premieroctet/next-admin/issues/465))

## 6.1.4

### Patch Changes

- [11dff98](https://github.com/premieroctet/next-admin/commit/11dff98): Fix in/notin operators in advanced filters

## 6.1.3

### Patch Changes

- [62436a5](https://github.com/premieroctet/next-admin/commit/62436a5): fix: pass locale to page router props ([#452](https://github.com/premieroctet/next-admin/issues/452))

## 6.1.2

### Patch Changes

- [017a2e0](https://github.com/premieroctet/next-admin/commit/017a2e0): Add refresh on action perform (list and form)
- [89b38df](https://github.com/premieroctet/next-admin/commit/89b38df): add refresh on dialog action

## 6.1.1

### Patch Changes

- [003805d](https://github.com/premieroctet/next-admin/commit/003805d): fix: correctly display path in advanced search
- [84ae5d6](https://github.com/premieroctet/next-admin/commit/84ae5d6): improve dialog UI

## 6.1.0

### Minor Changes

- [68700e6](https://github.com/premieroctet/next-admin/commit/68700e6): - Allow custom actions messages
  - Allow custom dialog actions messages
  - `type` prop is now required on `actions` items
  - `action` function now can return a Message object to display a message after the action is done
  - Error thrown by `action` function are now caught and displayed in a message
  - `onClose` prop can now receive a Message object to display a message after the dialog is closed

### Patch Changes

- [0ccbbab](https://github.com/premieroctet/next-admin/commit/0ccbbab): Add align on RichText Editor
- [a338dda](https://github.com/premieroctet/next-admin/commit/a338dda): Add conditional action through `canExecute` function
- [68700e6](https://github.com/premieroctet/next-admin/commit/68700e6): Fix form action message

## 6.0.1

### Patch Changes

- [497ab87](https://github.com/premieroctet/next-admin/commit/497ab87): Add translation for success/error messages in form
- [f5347cf](https://github.com/premieroctet/next-admin/commit/f5347cf): Fix dialog action in form
- [f5347cf](https://github.com/premieroctet/next-admin/commit/f5347cf): Add icons on action dropdown
- [32f5562](https://github.com/premieroctet/next-admin/commit/32f5562): Fix user pictures in menu

## 6.0.0

### Major Changes

- [db30b5c](https://github.com/premieroctet/next-admin/commit/db30b5c): feat: use exports field ([#379](https://github.com/premieroctet/next-admin/issues/379))

### Minor Changes

- [cdebaac](https://github.com/premieroctet/next-admin/commit/cdebaac): feat: add client actions ([#401](https://github.com/premieroctet/next-admin/issues/401))

## 5.5.0

### Minor Changes

- [0ad77be](https://github.com/premieroctet/next-admin/commit/0ad77be): feat: add advanced search ([#326](https://github.com/premieroctet/next-admin/issues/326))

## 5.4.2

### Patch Changes

- [8c9405f](https://github.com/premieroctet/next-admin/commit/8c9405f): fix crash when edit object is not defined in options.model

## 5.4.1

### Patch Changes

- [c868ce7](https://github.com/premieroctet/next-admin/commit/c868ce7): fix: set hashed password optional

## 5.4.0

### Minor Changes

- [0c80933](https://github.com/premieroctet/next-admin/commit/0c80933): add ability to define custom fields in edit

## 5.3.1

### Patch Changes

- [a554eaf](https://github.com/premieroctet/next-admin/commit/a554eaf): default resource names to title before the resource in lowercase

## 5.3.0

### Minor Changes

- [7dda967](https://github.com/premieroctet/next-admin/commit/7dda967): feat: add hooks to model edition ([#386](https://github.com/premieroctet/next-admin/issues/386))

## 5.2.0

### Minor Changes

- [2bf5933](https://github.com/premieroctet/next-admin/commit/2bf5933): eat: allow controlling the visibility of an edit field ([#372](https://github.com/premieroctet/next-admin/issues/372))
- [d16560a](https://github.com/premieroctet/next-admin/commit/d16560a): fix: fix one-to-one display for one side ([#393](https://github.com/premieroctet/next-admin/issues/393))
- [b013f25](https://github.com/premieroctet/next-admin/commit/b013f25): add support to arrays of enums
- [5fb2889](https://github.com/premieroctet/next-admin/commit/5fb2889): feat: add search by relation ([#385](https://github.com/premieroctet/next-admin/issues/385))
- [e161e99](https://github.com/premieroctet/next-admin/commit/e161e99): chore: upgrade to headlessui v2 ([#396](https://github.com/premieroctet/next-admin/issues/396))
- [b013f25](https://github.com/premieroctet/next-admin/commit/b013f25): feat: add support for scalar array ([#322](https://github.com/premieroctet/next-admin/issues/322))

### Patch Changes

- [2fa281d](https://github.com/premieroctet/next-admin/commit/2fa281d): feat: display actions in table rows ([#387](https://github.com/premieroctet/next-admin/issues/387))

## 5.1.0

### Minor Changes

- [9f5affb](https://github.com/premieroctet/next-admin/commit/9f5affb): 1. Avoid importing Head in app router project 2. Allow to change styles of sidebar group title

## 5.0.0

### Major Changes

- [a005fdf](https://github.com/premieroctet/next-admin/commit/a005fdf): ## Major Changes

  - **Breaking Change**:

    - New implementation of `NextAdmin`. Usage of `API route` instead of `server actions`.
    - Configuration of `page.tsx` and `route.ts` files in the `app/admin/[[...nextadmin]]` and `app/api/[[...nextadmin]]` folders respectively.
    - `createHandler` function now available in `appHandler` and `pageHandler` modules to configure the API route.
    - `getNextAdminProps` function now available in `appRouter` and `pageRouter` modules to configure the page route.

### Patch Changes

- [f120d10](https://github.com/premieroctet/next-admin/commit/f120d10): Add `next-themes` to handle color scheme
- [119a053](https://github.com/premieroctet/next-admin/commit/119a053): Redirect useEffect
- [5b295bb](https://github.com/premieroctet/next-admin/commit/5b295bb): add dist
- [12de962](https://github.com/premieroctet/next-admin/commit/12de962): Change logout system (Request or server action)
- [170a48b](https://github.com/premieroctet/next-admin/commit/170a48b): Fix images CORS issues
- [f3636ad](https://github.com/premieroctet/next-admin/commit/f3636ad): Small fixes (select, dark mode, dashboard, layout, doc)
- [60afe2f](https://github.com/premieroctet/next-admin/commit/60afe2f): Add history on redirect `Save`
- [0221476](https://github.com/premieroctet/next-admin/commit/0221476): Fix date input and add time-second format
- [4e0e774](https://github.com/premieroctet/next-admin/commit/4e0e774): Add `isDirty` for form to submit only fields touched
- [ed78f46](https://github.com/premieroctet/next-admin/commit/ed78f46): Dependency `next-themes`
- [b5322db](https://github.com/premieroctet/next-admin/commit/b5322db): add URL redirect support for logout
- [818f1e4](https://github.com/premieroctet/next-admin/commit/818f1e4): Merge main branch

## 5.0.0-rc.14

### Patch Changes

- add dist

## 5.0.0-rc.13

### Patch Changes

- add URL redirect support for logout

## 5.0.0-rc.12

### Patch Changes

- [170a48b](https://github.com/premieroctet/next-admin/commit/170a48b): Fix images CORS issues

## 5.0.0-rc.11

### Patch Changes

- Fix date input and add time-second format

## 5.0.0-rc.10

### Patch Changes

- Add `isDirty` for form to submit only fields touched

## 5.0.0-rc.9

### Patch Changes

- Change logout system (Request or server action)

## 5.0.0-rc.8

### Patch Changes

- Small fixes (select, dark mode, dashboard, layout, doc)

## 5.0.0-rc.7

### Patch Changes

- Redirect useEffect

## 5.0.0-rc.6

### Patch Changes

- [60afe2f](https://github.com/premieroctet/next-admin/commit/60afe2f): Add history on redirect `Save`

## 5.0.0-rc.5

### Patch Changes

- Dependency `next-themes`

## 5.0.0-rc.4

### Patch Changes

- [f120d10](https://github.com/premieroctet/next-admin/commit/f120d10): Add `next-themes` to handle color scheme

## 5.0.0-rc.3

### Patch Changes

- Merge main branch

## 4.4.5

### Patch Changes

- - [e52ed18](https://github.com/premieroctet/next-admin/commit/e52ed18): Don't prefetch export Link in header
- [8512b5e](https://github.com/premieroctet/next-admin/commit/8512b5e): Restore Buffer for `upload` function, add informations as second parameter
- [6da22fc](https://github.com/premieroctet/next-admin/commit/6da22fc): Add loader on select

## 4.4.4

### Patch Changes

- [192c4e8](https://github.com/premieroctet/next-admin/commit/192c4e8): Reponsive breadcrumb and actions

## 4.4.3

### Patch Changes

- [46683c4](https://github.com/premieroctet/next-admin/commit/46683c4): Fix selection in form for Safari browser ([#355](https://github.com/premieroctet/next-admin/issues/355))
- [e709378](https://github.com/premieroctet/next-admin/commit/e709378): Fix padding form

## 4.4.2

### Patch Changes

- [c45a87d](https://github.com/premieroctet/next-admin/commit/c45a87d): Add resizable button and scroll richtext ([#348](https://github.com/premieroctet/next-admin/issues/348))
- [b33de41](https://github.com/premieroctet/next-admin/commit/b33de41): Set null value instead of empty string ([#345](https://github.com/premieroctet/next-admin/issues/345))
- [c5180af](https://github.com/premieroctet/next-admin/commit/c5180af): Minify html for richtext and support div ([#347](https://github.com/premieroctet/next-admin/issues/347))
- [e1c455f](https://github.com/premieroctet/next-admin/commit/e1c455f): Modify to be undeleteable from the list if you do not have permission to delete
- [9b194f6](https://github.com/premieroctet/next-admin/commit/9b194f6): Fix disabled fields when default value ([#340](https://github.com/premieroctet/next-admin/issues/340))

## 4.4.1

### Patch Changes

- [e79b338](https://github.com/premieroctet/next-admin/commit/e79b338): Add row context to formatter function
- [4d5b7f8](https://github.com/premieroctet/next-admin/commit/4d5b7f8): Fix selector fields for enum and relationships
- [9d778ae](https://github.com/premieroctet/next-admin/commit/9d778ae): Disable creation button on list based on permission
- [9a139fb](https://github.com/premieroctet/next-admin/commit/9a139fb): Possibility to translate model names and field names
- [7ce8ebf](https://github.com/premieroctet/next-admin/commit/7ce8ebf): Fix boolean fields submission

## 4.4.0

### Minor Changes

- [af271ed](https://github.com/premieroctet/next-admin/commit/af271ed): feat: handle explicit many-to-many and sorting ([#261](https://github.com/premieroctet/next-admin/issues/261))

### Patch Changes

- [4d90eb5](https://github.com/premieroctet/next-admin/commit/4d90eb5): Fix search on all scalar list

## 4.3.0

### Minor Changes

- [7ebf263](https://github.com/premieroctet/next-admin/commit/7ebf263): minor typo fix

### Patch Changes

- [3dc9fd2](https://github.com/premieroctet/next-admin/commit/3dc9fd2): Add possibility to set an export url for data ([#265](https://github.com/premieroctet/next-admin/issues/265))
- [3dc9fd2](https://github.com/premieroctet/next-admin/commit/3dc9fd2): Add code snippets in doc
- [324e99b](https://github.com/premieroctet/next-admin/commit/324e99b): feat: update preset to apply on body
  feat: add form header to add new resource from edit form

## 4.2.4

### Patch Changes

- [b202581](https://github.com/premieroctet/next-admin/commit/b202581): Fill package information
- [2751e7d](https://github.com/premieroctet/next-admin/commit/2751e7d): Remove html warning ([#307](https://github.com/premieroctet/next-admin/issues/307))

## 4.2.3

### Patch Changes

- [484d087](https://github.com/premieroctet/next-admin/commit/484d087): Upgrade Prisma to 5.13.0

## 4.2.2

### Patch Changes

- [6cd3362](https://github.com/premieroctet/next-admin/commit/6cd3362): Add slug inside breadcrumb ([#263](https://github.com/premieroctet/next-admin/issues/263))

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
