---
"@premieroctet/next-admin": minor
---

- Allow custom actions messages
- Allow custom dialog actions messages
- `type` prop is now required on `actions` items
- `action` function now can return a Message object to display a message after the action is done
- Error thrown by `action` function are now caught and displayed in a message
- `onClose` prop can now receive a Message object to display a message after the dialog is closed
