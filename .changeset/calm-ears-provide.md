---
"@premieroctet/next-admin": minor
---

📄 add option for custom pages

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
