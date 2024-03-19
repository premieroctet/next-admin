import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useConfig } from "../context/ConfigContext";

export default function MainHeader({
  breadcrumbItems,
}: {
  breadcrumbItems: { href: string; label: string; current?: boolean }[];
}) {
  const { basePath } = useConfig();

  return (
    <div className="h-16 px-4 lg:flex items-center hidden">
      <nav className="flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2">
          <li>
            <div>
              <a href={basePath} className="text-gray-400 hover:text-slate-500">
                <HomeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {breadcrumbItems.map((page) => (
            <li key={page.label}>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-slate-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link
                  href={page.href}
                  className={`ml-2 text-sm font-medium hover:text-slate-700 ${
                    page.current
                      ? "text-nextadmin-primary-500"
                      : "text-slate-500"
                  }`}
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.label}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
