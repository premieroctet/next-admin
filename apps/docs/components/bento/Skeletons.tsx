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
      className=" flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {false && (
        <motion.div className="w-0 h-0 border-l-[30px] border-b-[50px] border-r-[30px] border-l-transparent border-r-transparent border-b-black" />
      )}
      <motion.div className="dark:text-white/70 text-sm text-stone-600 font-light flex flex-col justify-center h-full">
        <motion.div variants={variants}>app/</motion.div>
        <motion.div variants={variants} className="ml-3">
          layout.tsx
        </motion.div>
        <motion.div variants={variants} className="ml-3">
          admin/
        </motion.div>
        <motion.div
          variants={variants}
          className="dark:text-black/80 ml-6 p-1 rounded-lg px-2 bg-gradient-to-r from-green-100/80 to-green-100/10 font-medium"
        >
          [[...nextadmin]]/
        </motion.div>
        <motion.div
          variants={variants}
          className="dark:text-black/80 ml-14 bg-gradient-to-r from-yellow-100/80 to-yellow-100/10 font-medium px-2 p-1"
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
        "bg-white border w-16 h-16 rounded-full flex justify-center items-center shadow-sm",
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
      className="min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] h-full flex flex-row -space-x-4 justify-center items-center"
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
      className="dark:text-white/70 flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col text-xs font-mono justify-center text-black/30"
    >
      <motion.div>{`datasource db {`}</motion.div>
      <motion.div className="pl-4">{`provider = "postgresql"`}</motion.div>
      <motion.div className="pl-4">{`url = env("DATABASE_URL")`}</motion.div>
      <motion.div>{`}`}</motion.div>
      <motion.div className="mt-3">{`generator jsonSchema {`}</motion.div>
      <motion.div className="dark:text-black/70 ml-2 pl-2 py-2 my-1 bg-gradient-to-r from-green-100/80 to-green-100/10 text-stone-600 rounded-lg relative">
        {`provider = "prisma-json-schema-generator"`}
        <div>
          <CheckBadgeIcon className="h-6 w-6 absolute right-0 top-6 text-teal-600" />
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
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 justify-center"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <FunnelIcon className="h-6 w-6" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black"
      >
        <AdjustmentsVerticalIcon className="h-6 w-6" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
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
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 items-center justify-center"
    >
      <motion.div
        variants={variants}
        className="dark:text-gray-400 h-24 w-24 flex items-end justify-end p-1 relative rounded-lg text-4xl bg-gradient-to-b from-green-100 to-green-100/10 5 text-green-800"
      >
        TS
        <ShieldCheckIcon className="w-8 h-8 absolute -bottom-2 left-0 dark:text-gray-500 text-green-700" />
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
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 items-center justify-center text-stone-400 text-xl font-light"
    >
      <motion.div variants={item}>Hello 👋</motion.div>
      <motion.div variants={item}>Bonjour 👋</motion.div>
      <motion.div variants={item}>Holà 👋</motion.div>
    </motion.div>
  );
};
