import { PropsWithChildren } from "react";
import "../styles.css";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
