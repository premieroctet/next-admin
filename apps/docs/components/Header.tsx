import { GitHubIcon } from "./Hero";

const Header = () => (
  <header className="w-full border-b border-dashed border-gray-300 p-4">
    <div className="border-3 mx-auto flex max-w-6xl items-center gap-2">
      <img src="/logo.svg" width="40px" />
      <div className="font-semibold">Next Admin</div>
      <div className="ml-auto flex gap-4 text-sm font-light text-gray-500">
        <a
          className="hover:text-gray-700"
          href="https://next-admin-po.vercel.app/en/admin"
        >
          Demo
        </a>
        <a className="hover:text-gray-700" href="https://next-admin.js.org">
          Docs
        </a>
        <a
          href="https://github.com/premieroctet/next-admin"
          className="flex items-center gap-1 hover:text-gray-700"
        >
          <GitHubIcon /> GitHub
        </a>
      </div>
    </div>
  </header>
);

export default Header;
