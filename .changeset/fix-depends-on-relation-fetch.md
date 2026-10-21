---
"@premieroctet/next-admin": patch
---

Fix `dependsOn` not fetching relation data for virtual fields. Fields of relation kind are now seeded with a proper nested select (parity with the display path), dotted dependency paths such as `"author.profile.bio"` are resolved recursively, and virtual field seeds are no longer dropped on models without a single id field.
