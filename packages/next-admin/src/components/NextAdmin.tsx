import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { clsx } from "clsx";

import { ADMIN_BASE_PATH } from "../config";
import { getSchemaForRessource } from "../utils/jsonSchema";
import Dashboard from "./Dashboard";
import Form from "./Form";
import List from "./List";
import { Prisma } from "@prisma/client";
import { capitalize, ressourceToUrl } from "../utils/tools";
import { ListData, ModelName, Schema } from "../types";
import Message from "./Message";

export type AdminComponentProps = {
  schema: Schema;
  data?: ListData<ModelName>;
  ressource: ModelName;
  message?: {
    type: "success" | "info";
    content: string;
  };
  error?: string;
  ressources?: ModelName[];
  total?: number;
  dmmfSchema: Prisma.DMMF.Field[];
};

export type CustomUIProps = {
  dashboard?: JSX.Element | (() => JSX.Element);
};

// Components

export function NextAdmin({
  data,
  ressource,
  schema,
  ressources,
  message,
  error,
  total,
  dmmfSchema,
  dashboard,
}: AdminComponentProps & CustomUIProps) {
  const modelSchema =
    ressource && schema ? getSchemaForRessource(schema, ressource) : undefined;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation: Array<{
    name: string;
    href: string;
    current: boolean;
    icon?: React.ElementType;
  }> =
    ressources?.map((ressource) => ({
      name: ressource,
      href: `${ADMIN_BASE_PATH}/${ressourceToUrl(ressource)}`,
      current: false,
    })) || [];

  const renderMainComponent = () => {
    if (Array.isArray(data) && ressource && typeof total != "undefined") {
      return (
        <List
          ressource={ressource}
          data={data}
          total={total}
          modelSchema={modelSchema}
        />
      );
    }

    if ((data && !Array.isArray(data)) || (modelSchema && !data)) {
      return (
        <Form
          data={data}
          schema={modelSchema}
          dmmfSchema={dmmfSchema}
          ressource={ressource}
        />
      );
    }

    if (ressources) {
      if (dashboard && typeof dashboard === "function") return dashboard();
      return dashboard || <Dashboard />;
    }
  };

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
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
              <div className="fixed inset-0 bg-gray-900/80" />
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
                      <Link href={ADMIN_BASE_PATH}>
                        <HomeIcon className="h-6 w-6 text-indigo-600" />
                      </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={clsx(
                                    item.current
                                      ? "bg-gray-50 text-indigo-600"
                                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  {item.icon && (
                                    <item.icon
                                      className={clsx(
                                        item.current
                                          ? "text-indigo-600"
                                          : "text-gray-400 group-hover:text-indigo-600",
                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                  )}
                                  {capitalize(item.name)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
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
              <Link href={ADMIN_BASE_PATH}>
                <HomeIcon className="h-6 w-6 text-indigo-600" />
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={clsx(
                            item.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          {item.icon && (
                            <item.icon
                              className={clsx(
                                item.current
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-indigo-600",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          )}
                          {capitalize(item.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            Dashboard
          </div>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-12 lg:px-20 space-y-4">
            <h1>
              <Link
                className="text-neutral-500 hover:text-neutral-700 hover:underline cursor-pointer"
                href={`${ADMIN_BASE_PATH}`}
              >
                Admin
              </Link>
            </h1>
            {message && (
              <Message message={message.content} type={message.type} />
            )}
            {error && <Message message={error} type="error" />}
            {renderMainComponent()}
          </div>
        </main>
      </div>
    </>
  );
}
