import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
