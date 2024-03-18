import Link from "next/link";
import { Spotlight } from "./effects/Spotlight";

export const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
    ></path>
  </svg>
);

export function Hero() {
  return (
    <div className="h-[35rem] w-full flex md:items-center md:justify-center bg-transparent antialiased relative overflow-hidden border-b border-dashed dark:border-b-stone-500">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#82e9a6"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-black/70 to-black/90 dark:text-white bg-opacity-50">
          Full-featured Admin
          <br /> for Next.js
        </h1>
        <p className="mt-4 font-normal text-2xl text-black dark:text-white max-w-xl text-center mx-auto">
          Ready-to-go Admin for Next.js and Prisma
        </p>
        <div className="mt-10 max-w-xl text-center mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/docs"
            className="bg-black dark:bg-white dark:hover:bg-gray-700 rounded-lg px-6 py-3 text-white dark:text-black text-md font-semibold hover:bg-gray-800 dark:hover:bg-white/80 transition-colors duration-300 ease-in-out"
          >
            Documentation
          </Link>
          <Link
            href="https://github.com/premieroctet/next-admin"
            target="_blank"
            className="dark:text-white dark:fill-white dark:hover:text-black dark:hover:fill-black rounded-lg px-6 py-3 text-black text-md font-semibold hover:bg-gray-100 transition-colors duration-300 ease-in-out border border-gray-300 flex gap-2 justify-center"
          >
            <GitHubIcon />
            View on GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
