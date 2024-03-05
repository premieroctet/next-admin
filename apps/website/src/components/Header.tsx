import { GitHubIcon } from "./Hero";

const Header = () => (
  <header className="border-b border-gray-300 w-full p-4 border-dashed">
    <div className="max-w-6xl border-3 mx-auto flex gap-2 items-center">
      <img src="/logo.svg" width="40px" />
      <div className="font-semibold">Next Admin</div>
      <div className="ml-auto text-sm text-gray-500 font-light gap-4 flex">
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
          className="hover:text-gray-700 flex items-center gap-1"
        >
          <GitHubIcon /> GitHub
        </a>
      </div>
    </div>
  </header>
);

export default Header;
