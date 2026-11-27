---
"@premieroctet/next-admin": patch
---

Stop sending unused raw list rows to the browser. Displaying a relation in a list fetched every column of the related row, such as a user's `hashedPassword` behind a post's `author`, and serialized it into the page through `rawData`. The App Router no longer sends `rawData`, since its formatters run on the server. The Page Router (also used by Remix and TanStack Start) only sends the fields that have a `list.fields` formatter, or the whole row when the list has a virtual field. A relation field with a Page Router formatter still receives every column of the related row. If you read `rawData` from the props returned by `getNextAdminProps`, it is now `null` in the App Router and only holds those fields in the Page Router.
