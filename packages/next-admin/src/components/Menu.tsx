"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Link from "next/link";
import { Fragment, useState } from "react";

import { useConfig } from "../context/ConfigContext";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  AdminComponentProps,
  ModelIcon,
  ModelName,
  SidebarConfiguration,
} from "../types";
import ResourceIcon from "./common/ResourceIcon";
import Divider from "./Divider";

export type MenuProps = {
  resource?: ModelName;
  resources?: ModelName[];
  resourcesTitles?: Record<ModelName, string | undefined>;
  customPages?: AdminComponentProps["customPages"];
  configuration?: SidebarConfiguration;
  resourcesIcons: AdminComponentProps["resourcesIcons"];
};

type NavigationElement = {
  name: string;
  href: string;
  current: boolean;
  icon?: React.ElementType;
};

export default function Menu({
  resources,
  resource: currentResource,
  resourcesTitles,
  customPages,
  configuration,
  resourcesIcons,
}: MenuProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { basePath } = useConfig();
  const { pathname } = useRouterInternal();

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
            ? "bg-gray-50 text-nextadmin-primary-600"
            : "text-gray-700 hover:text-nextadmin-primary-600 hover:bg-gray-50",
          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
        )}
      >
        {!!item.icon && (
          <ResourceIcon
            icon={item.icon}
            className={clsx(
              item.current
                ? "text-nextadmin-primary-600"
                : "text-gray-700 group-hover:text-nextadmin-primary-600",
              "h-6 w-6 shrink-0"
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
      name: resourcesTitles?.[model] || model,
      href: `${basePath}/${model.toLowerCase()}`,
      current: model === currentResource,
      icon: resourcesIcons?.[model],
    };
  };

  const renderNavigation = () => {
    return (
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-4">
          {configuration?.groups?.map((group) => (
            <li key={group.title}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.title}
              </div>
              <ul role="list" className="-ml-2 flex flex-col gap-y-1 mt-1">
                {group.models.map((model) => {
                  const item = getItemProps(model);
                  return <li key={model}>{renderNavigationItem(item)}</li>;
                })}
              </ul>
            </li>
          ))}
          <li>
            <ul className="-ml-2 flex flex-col gap-y-1">
              {ungroupedModels?.map((model) => {
                const item = getItemProps(model);
                return <li key={model}>{renderNavigationItem(item)}</li>;
              })}
            </ul>
          </li>
          {customPagesNavigation?.length && (
            <li>
              <ul role="list" className="-ml-2 flex flex-col gap-y-1">
                {customPagesNavigation?.map((item) => (
                  <li key={item.name}>{renderNavigationItem(item)}</li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </nav>
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
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link href={basePath}>
                      <HomeIcon className="h-6 w-6 text-nextadmin-primary--500" />
                    </Link>
                  </div>
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Link href={basePath}>
              <HomeIcon className="h-6 w-6 text-nextadmin-primary-600" />
            </Link>
          </div>
          {renderNavigation()}
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-slate-900">
          Dashboard
        </div>
      </div>
    </>
  );
}

const MenuNavigation = ({
  basePath,
  navigation,
  customPagesNavigation,
}: {
  basePath: string;
  navigation: Array<NavigationElement>;
  customPagesNavigation?: Array<Omit<NavigationElement, "icon">>;
}) => {
  const renderNavigationItem = (item: {
    name: string;
    href: string;
    current: boolean;
    icon?: React.ElementType;
  }) => {
    return (
      <Link
        href={item.href}
        className={clsx(
          item.current
            ? "bg-nextadmin-primary-50 text-nextadmin-primary-700"
            : "text-slate-700 hover:bg-slate-100",
          "group flex gap-x-1 rounded-lg py-2 px-3 text-sm leading-6 font-medium transition-colors"
        )}
      >
        {item.icon && (
          <item.icon
            className={clsx(
              item.current
                ? "text-nextadmin-primary-600"
                : "text-slate-400 group-hover:text-nextadmin-primary-600",
              "h-6 w-6 shrink-0"
            )}
            aria-hidden="true"
          />
        )}
        {item.name}
      </Link>
    );
  };

  return (
    <div className="flex grow flex-col overflow-y-auto bg-slate-50 pb-2 border-r border-r-slate-200">
      <div className="flex h-16 items-center px-6">
        <Link
          href={basePath}
          className="flex gap-2 items-center overflow-hidden"
        >
          <div className="text-md whitespace-nowrap text-ellipsis overflow-hidden font-semibold">
            Photobooth Admin
          </div>
        </Link>
      </div>
      <Divider />
      <nav className="flex flex-1 flex-col mt-4 gap-y-6 px-6">
        <ul role="list" className="flex flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>{renderNavigationItem(item)}</li>
              ))}
            </ul>
          </li>
        </ul>
        {Boolean(customPagesNavigation?.length) && (
          <>
            <Divider />
            <ul role="list" className="flex flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {customPagesNavigation?.map((item) => (
                    <li key={item.name}>{renderNavigationItem(item)}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </>
        )}
      </nav>
    </div>
  );
};
