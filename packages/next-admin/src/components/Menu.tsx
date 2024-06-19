"use client";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useState } from "react";

import { Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/solid";
import { useConfig } from "../context/ConfigContext";
import { useI18n } from "../context/I18nContext";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  AdminComponentProps,
  ModelIcon,
  ModelName,
  NextAdminOptions,
  SidebarConfiguration,
} from "../types";
import { slugify } from "../utils/tools";
import Divider from "./Divider";
import ResourceIcon from "./common/ResourceIcon";
import Button from "./radix/Button";
import {
  Dropdown,
  DropdownBody,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "./radix/Dropdown";

const ColorSchemeSwitch = dynamic(() => import("./ColorSchemeSwitch"), {
  ssr: false,
});

export type MenuProps = {
  resource?: ModelName;
  resources?: ModelName[];
  resourcesTitles?: Record<ModelName, string | undefined>;
  customPages?: AdminComponentProps["customPages"];
  configuration?: SidebarConfiguration;
  resourcesIcons: AdminComponentProps["resourcesIcons"];
  user?: AdminComponentProps["user"];
  externalLinks?: AdminComponentProps["externalLinks"];
  title?: string;
  forceColorScheme?: NextAdminOptions["forceColorScheme"];
};

export default function Menu({
  resources,
  resource: currentResource,
  resourcesTitles,
  customPages,
  configuration,
  resourcesIcons,
  user,
  externalLinks,
  title,
  forceColorScheme,
}: MenuProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { basePath } = useConfig();
  const { pathname } = useRouterInternal();
  const { t } = useI18n();

  const customPagesNavigation = customPages?.map((page) => ({
    name: page.title,
    href: `${basePath}${page.path}`,
    /**
     * In case the path includes a locale for i18n, we just
     * need to check if the pathname just ends with the page path
     */
    current: pathname.endsWith(`${basePath}${page.path}`),
    icon: page.icon,
  }));

  const ungroupedModels = resources?.filter(
    (resource) =>
      !configuration?.groups?.some((group) => group.models.includes(resource))
  );

  const renderNavigationItem = (item: {
    name: string;
    href: string;
    current: boolean;
    icon?: ModelIcon;
  }) => {
    return (
      <a
        href={item.href}
        className={clsx(
          item.current
            ? "bg-nextadmin-menu-muted dark:bg-dark-nextadmin-menu-muted dark:text-dark-nextadmin-menu-emphasis text-nextadmin-menu-emphasis"
            : "text-nextadmin-menu-color dark:text-dark-nextadmin-menu-color dark:hover:bg-dark-nextadmin-menu-muted hover:bg-nextadmin-menu-muted hover:text-nextadmin-menu-emphasis",
          "group flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm leading-6 transition-colors"
        )}
      >
        {!!item.icon && (
          <ResourceIcon
            icon={item.icon}
            className={clsx(
              item.current
                ? "text-nextadmin-menu-emphasis dark:text-dark-nextadmin-menu-emphasis"
                : "text-nextadmin-menu-color dark:text-dark-nextadmin-menu-color group-hover:text-nextadmin-menu-emphasis dark:group-hover:text-dark-nextadmin-menu-emphasis",
              "h-5 w-5 shrink-0"
            )}
            aria-hidden="true"
          />
        )}
        {item.name}
      </a>
    );
  };

  const getItemProps = (model: ModelName) => {
    return {
      name: t(`model.${model}.plural`, {}, resourcesTitles?.[model] || model),
      href: `${basePath}/${slugify(model)}`,
      current: model === currentResource,
      icon: resourcesIcons?.[model],
    };
  };

  const getInitials = () => {
    const username = user?.data.name;

    if (username) {
      const [firstName, lastName] = username.split(" ");

      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
      }

      return username.charAt(0);
    }
  };

  const renderUser = () => {
    if (!user) {
      return null;
    }

    return (
      <div className="text-nextadmin-menu-color dark:text-dark-nextadmin-menu-color flex flex-1 items-center gap-1 px-2 py-3 text-sm font-semibold leading-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {user.data.picture ? (
            <img
              className="flex h-8 w-8 flex-shrink-0 rounded-full"
              src={user.data.picture}
              alt="User picture"
            />
          ) : (
            <div className="bg-nextadmin-menu-color/20 dark:bg-dark-nextadmin-menu-color/95 text-nextadminmenu-emphasis dark:text-dark-nextadmin-menu-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full uppercase">
              {getInitials()}
            </div>
          )}
          <span className="sr-only">Logged in as</span>
          <span
            aria-hidden="true"
            className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {user.data.name}
          </span>
        </div>
        <Dropdown>
          <DropdownTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-grow-1 order-2 flex-shrink-0 basis-auto !px-2 py-2"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </Button>
          </DropdownTrigger>
          <DropdownBody>
            <DropdownContent side="top" sideOffset={5} className="px-1 py-2">
              <DropdownLabel className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted px-4 py-1 font-normal">
                {user.data.name}
              </DropdownLabel>
              <DropdownSeparator className="bg-nextadmin-border-default dark:bg-dark-nextadmin-border-emphasis" />
              <DropdownItem asChild>
                <Link
                  href={user.logoutUrl}
                  className="text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted hover:text-nextadmin-content-emphasis hover:bg-nextadmin-background-muted dark:hover:text-dark-nextadmin-content-inverted dark:hover:bg-dark-nextadmin-background-muted flex items-center gap-2 rounded px-4 py-1 font-medium"
                >
                  <PowerIcon className="h-4 w-4" />
                  <span>{t("user.logout")}</span>
                </Link>
              </DropdownItem>
            </DropdownContent>
          </DropdownBody>
        </Dropdown>
      </div>
    );
  };

  const renderExternalLinks = () => {
    if (!externalLinks) {
      return null;
    }

    return externalLinks.map((link) => (
      <Link
        key={link.url}
        href={link.url}
        className="text-nextadmin-menu-color dark:text-dark-nextadmin-menu-color hover:text-nextadmin-menu-emphasis hover:bg-nextadmin-menu-muted dark:hover:bg-dark-nextadmin-menu-muted flex flex-row items-center justify-between gap-2 rounded-lg p-3 text-sm font-medium transition-colors"
        target="_blank"
        rel="noopener"
      >
        {link.label}
        <ArrowTopRightOnSquareIcon className="h-5 w-5" />
      </Link>
    ));
  };

  const renderNavigation = () => {
    return (
      <>
        <div className="bg-nextadmin-menu-background dark:bg-dark-nextadmin-menu-background border-r-nextadmin-border-default dark:border-r-dark-nextadmin-border-default flex grow flex-col overflow-y-auto border-r pb-2">
          <div className="flex py-3 items-center px-2">
            <Link
              href={basePath}
              className="flex items-center gap-2 overflow-hidden h-[40px]"
            >
              <div className="text-md dark:text-dark-nextadmin-brand-inverted overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                {title}
              </div>
            </Link>
          </div>
          <Divider />
          <nav className="mt-4 flex flex-1 flex-col gap-y-6 px-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-4">
              {configuration?.groups?.map((group) => (
                <li key={group.title}>
                  <div className="text-nextadmin-menu-color dark:text-dark-nextadmin-menu-color mb-2 text-xs uppercase tracking-wider">
                    {group.title}
                  </div>
                  <ul role="list" className="-ml-2 mt-1 flex flex-col gap-y-1">
                    {group.models.map((model) => {
                      const item = getItemProps(model);
                      return <li key={model}>{renderNavigationItem(item)}</li>;
                    })}
                  </ul>
                </li>
              ))}
              {!!ungroupedModels?.length && (
                <>
                  {!!configuration?.groups.length && <Divider />}
                  <li>
                    <ul className="-ml-2 flex flex-col gap-y-1">
                      {ungroupedModels?.map((model) => {
                        const item = getItemProps(model);
                        return (
                          <li key={model}>{renderNavigationItem(item)}</li>
                        );
                      })}
                    </ul>
                  </li>
                </>
              )}
              {!!customPagesNavigation?.length && (
                <>
                  <Divider />
                  <li>
                    <ul role="list" className="-ml-2 flex flex-col gap-y-1">
                      {customPagesNavigation?.map((item) => (
                        <li key={item.name}>{renderNavigationItem(item)}</li>
                      ))}
                    </ul>
                  </li>
                </>
              )}
            </ul>
            <div className="flex flex-col">
              {renderExternalLinks()}
              {!forceColorScheme && <ColorSchemeSwitch />}
              {renderUser()}
            </div>
          </nav>
        </div>
      </>
    );
  };

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
                  {renderNavigation()}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {renderNavigation()}
        </div>
      </div>

      <div className="dark:bg-dark-nextadmin-background-default sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon
            className="dark:text-dark-nextadmin-content-default h-6 w-6"
            aria-hidden="true"
          />
        </button>
        <div className="text-md dark:text-dark-nextadmin-brand-inverted flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold leading-6 text-slate-900">
          {title}
        </div>
      </div>
    </>
  );
}
