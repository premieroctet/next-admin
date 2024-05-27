import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import "../../styles.css";

type Props = {
  params: {
    locale: "en" | "fr";
  };
};

const locales = ["en", "fr"];

export default function Layout({
  children,
  params: { locale },
}: PropsWithChildren<Props>) {
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  );
}
