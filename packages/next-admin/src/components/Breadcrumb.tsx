import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useConfig } from "../context/ConfigContext";
import { ModelIcon } from "../types";
import ResourceIcon from "./common/ResourceIcon";

export default function Breadcrumb({
  breadcrumbItems,
}: {
  breadcrumbItems: {
    href: string;
    label: string;
    icon?: ModelIcon;
    current?: boolean;
  }[];
}) {
  const { basePath } = useConfig();

  return (
    <nav className="flex h-[40px]" aria-label="Breadcrumb">
      <ol role="list" className="flex flex-wrap items-center gap-2">
        <li>
          <div>
            <a
              href={basePath}
              className="text-nextadmin-menu-default dark:text-dark-nextadmin-menu-color hover:text-nextadmin-content-emphasis dark:hover:text-dark-nextadmin-content-emphasis"
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {breadcrumbItems.map((page) => (
          <li key={page.label}>
            <div className="flex items-center" title={page.label}>
              <svg
                className="text-next-admin-menu-default dark:text-dark-nextadmin-menu-color h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                href={page.href}
                className={`hover:text-nextadmin-brand-emphasis dark:hover:text-dark-nextadmin-brand-emphasis ml-2 flex gap-2 text-sm font-medium ${
                  page.current
                    ? "text-nextadmin-brand-subtle dark:text-dark-nextadmin-brand-subtle"
                    : "text-nextadmin-menu-default dark:text-dark-nextadmin-menu-color"
                }
                `}
                aria-current={page.current ? "page" : undefined}
              >
                {!!page.icon && (
                  <ResourceIcon icon={page.icon} className="h-5 w-5 " />
                )}
                <span className="flex-basis-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {page.label}
                </span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
