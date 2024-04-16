"use client";

import { cn } from "@/utils/cn";
import {
  BoltIcon,
  CircleStackIcon,
  CursorArrowRaysIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { BentoGrid, BentoGridItem } from "../effects/BentoGrid";
import {
  SkeletonFive,
  SkeletonFour,
  SkeletonOne,
  SkeletonSix,
  SkeletonThree,
  SkeletonTwo,
} from "./Skeletons";

const items = [
  {
    title: "App Router support",
    description: (
      <span className="text-sm">
        Built-in support for Next.js App Router and Page Router
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <BoltIcon className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "CRUD ready",
    description: (
      <span className="text-sm">
        Easily create, read, update and delete your data
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <CursorArrowRaysIcon className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "Prisma.js Support",
    description: (
      <span className="text-sm">
        Just add our generator and you are good to go
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <CircleStackIcon className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "Search and Filter",
    description: (
      <span className="text-sm">
        Visualize, search and filter your data with ease
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-1",
    icon: <MagnifyingGlassIcon className="h-5 w-5 text-neutral-500" />,
  },

  {
    title: "TypeScript",
    description: (
      <span className="text-sm">
        Built with TypeScript: browse your code with confidence
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <ShieldCheckIcon className="h-5 w-5 text-neutral-500" />,
  },
  {
    title: "i18n support",
    description: (
      <span className="text-sm">
        Built-in support for i18n and multiple languages
      </span>
    ),
    header: <SkeletonSix />,
    className: "md:col-span-1",
    icon: <LanguageIcon className="h-5 w-5 text-neutral-500" />,
  },
];

export function FeaturesBento() {
  return (
    <BentoGrid className="mx-auto max-w-4xl py-10 md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}
