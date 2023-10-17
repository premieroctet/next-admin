---
"@premieroctet/next-admin": major
---

- Always fetch `id` property from items
- Hide `id`column in list if it doesn't have `display: true` options
- Mutualize `NextAdminOptions` to reduce useless duplication of code 

⚠️ **Breaking Changes**

To reduce the complexity and duplication of next-admin options, this PR contains major changes to the structure of the options. 

- Changed structure for `display` and `search` properties: fields are now entered as an array
