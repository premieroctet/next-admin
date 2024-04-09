import { PropsWithChildren } from "react";
import "../../styles.css";
import { notFound } from "next/navigation";

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
    <html lang={locale}>
      <body className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default">
        {children}
      </body>
    </html>
  );
}
