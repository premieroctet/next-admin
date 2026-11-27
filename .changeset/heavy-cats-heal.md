---
"@premieroctet/next-admin": patch
---

Stop fetching the to-many relations of related rows in relation columns of list and edit views (#635). A related row now comes with its scalars and its to-one relations only.

A formatter, `toString` or `optionFormatter` that reads a to-many relation of a related row (for example `row.author.posts`) now gets `undefined`. In list views, add a virtual field to the same `list.display` with a dotted path in `dependsOn`, such as `dependsOn: ["author.posts"]`, to fetch it again. `dependsOn` now accepts dotted paths through relations. Edit views have no equivalent yet: `edit.display` does not accept virtual fields, so edit-form relation labels cannot read those arrays.
