---
"@premieroctet/next-admin": patch
---

Fix relation display columns fetching all related rows and their nested relations: at the scalar selection level, relations are no longer selected, only scalars are. To-many back-relation arrays are no longer fetched when displaying a relation column in list and edit views (#635)
