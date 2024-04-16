import { cn } from "@/utils/cn";
import {
  AdjustmentsVerticalIcon,
  CheckBadgeIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export const SkeletonOne = () => {
  const variants = {
    initial: {
      opacity: 0,
      x: -10,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    hover: { x: 10 },
  };

  return (
    <motion.div
      initial="initial"
      animate="visible"
      whileHover="hover"
      className=" dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2"
    >
      {false && (
        <motion.div className="h-0 w-0 border-b-[50px] border-l-[30px] border-r-[30px] border-b-black border-l-transparent border-r-transparent" />
      )}
      <motion.div className="flex h-full flex-col justify-center text-sm font-light text-stone-600 dark:text-white/70">
        <motion.div variants={variants}>app/</motion.div>
        <motion.div variants={variants} className="ml-3">
          layout.tsx
        </motion.div>
        <motion.div variants={variants} className="ml-3">
          admin/
        </motion.div>
        <motion.div
          variants={variants}
          className="ml-6 rounded-lg bg-gradient-to-r from-green-100/80 to-green-100/10 p-1 px-2 font-medium dark:text-black/80"
        >
          [[...nextadmin]]/
        </motion.div>
        <motion.div
          variants={variants}
          className="ml-14 bg-gradient-to-r from-yellow-100/80 to-yellow-100/10 p-1 px-2 font-medium dark:text-black/80"
        >
          page.tsx
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const SkeletonTwo = () => {
  const variants = {
    initial: {
      opacity: 0,
      scale: 0.3,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      scale: 1.2,
    },
  };

  const CircleIcon = ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <motion.div
      variants={variants}
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full border bg-white shadow-sm",
        className
      )}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] flex-row items-center justify-center -space-x-4"
    >
      <CircleIcon className="bg-gradient-to-t">
        <PlusIcon className="h-5 w-5 text-neutral-500" />
      </CircleIcon>
      <CircleIcon>
        <EyeIcon className="h-5 w-5 text-neutral-500" />
      </CircleIcon>
      <CircleIcon>
        <PencilIcon className="h-5 w-5 text-neutral-500" />
      </CircleIcon>
      <CircleIcon>
        <TrashIcon className="h-5 w-5 text-neutral-500" />
      </CircleIcon>
    </motion.div>
  );
};

export const SkeletonThree = () => {
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col justify-center font-mono text-xs text-black/30 dark:text-white/70"
    >
      <motion.div>{`datasource db {`}</motion.div>
      <motion.div className="pl-4">{`provider = "postgresql"`}</motion.div>
      <motion.div className="pl-4">{`url = env("DATABASE_URL")`}</motion.div>
      <motion.div>{`}`}</motion.div>
      <motion.div className="mt-3">{`generator jsonSchema {`}</motion.div>
      <motion.div className="relative my-1 ml-2 rounded-lg bg-gradient-to-r from-green-100/80 to-green-100/10 py-2 pl-2 text-stone-600 dark:text-black/70">
        {`provider = "prisma-json-schema-generator"`}
        <div>
          <CheckBadgeIcon className="absolute right-0 top-6 h-6 w-6 text-teal-600" />
        </div>
      </motion.div>
      <motion.div className="pl-4 ">
        {`includeRequiredFields = true`}
      </motion.div>
      <motion.div>{`}`}</motion.div>
    </motion.div>
  );
};

export const SkeletonFour = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col justify-center space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100  bg-white p-2 dark:border-white/[0.4] dark:bg-black"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
        <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-700" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="ml-auto flex w-3/4 flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.4] dark:bg-black"
      >
        <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-700" />
        <FunnelIcon className="h-6 w-6" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-neutral-100 bg-white p-2 dark:border-white/[0.4] dark:bg-black"
      >
        <AdjustmentsVerticalIcon className="h-6 w-6" />
        <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-neutral-700" />
      </motion.div>
    </motion.div>
  );
};

export const SkeletonFive = () => {
  const variants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      y: 0,

      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
    hover: {
      scale: 1.1,
      rotate: -10,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center space-y-2"
    >
      <motion.div
        variants={variants}
        className="5 relative flex h-24 w-24 items-end justify-end rounded-lg bg-gradient-to-b from-green-100 to-green-100/10 p-1 text-4xl text-green-800 dark:text-gray-400"
      >
        TS
        <ShieldCheckIcon className="absolute -bottom-2 left-0 h-8 w-8 text-green-700 dark:text-gray-500" />
      </motion.div>
    </motion.div>
  );
};

export const SkeletonSix = () => {
  const container = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.5,
      },
    },
    hover: { scale: 1.1 },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      whileHover="hover"
      className="dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center space-y-2 text-xl font-light text-stone-400"
    >
      <motion.div variants={item}>Hello 👋</motion.div>
      <motion.div variants={item}>Bonjour 👋</motion.div>
      <motion.div variants={item}>Holà 👋</motion.div>
    </motion.div>
  );
};
