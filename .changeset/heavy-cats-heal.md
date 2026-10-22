---
"@premieroctet/next-admin": patch
---

Stop fetching the to-many relations of related rows in relation columns of list and edit views (#635). A related row now comes with its scalars and its to-one relations only. A formatter, `toString` or `optionFormatter` that reads a to-many relation of a related row (for example `row.author.posts`) now gets `undefined`; use a dotted `dependsOn` such as `"author.posts"` to fetch it.
