import { GitHubIcon } from "./Hero";

const Footer = () => (
  <footer className="border-t border-gray-300 w-full p-6 border-dashed">
    <div className="max-w-6xl border-3 mx-auto flex gap-2 items-center">
      <img src="/logo.svg" width="40px" />
      <a href="https://www.premieroctet.com/" className="font-semibold">
        by Premier Octet
      </a>
      <div className="ml-auto text-sm text-black font-light gap-3 flex">
        <a
          href="https://github.com/premieroctet/next-admin"
          className="flex items-center gap-2"
        >
          <GitHubIcon /> GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
