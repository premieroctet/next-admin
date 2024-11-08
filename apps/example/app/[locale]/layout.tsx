import { notFound } from "next/navigation";
import { PropsWithChildren, use } from "react";
import "../../styles.css";

type ParamsProps = Promise<{
  locale: "en" | "fr";
}>;
const locales = ["en", "fr"];

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: ParamsProps }>) {
  const locale = use(params)?.locale;
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  );
}
