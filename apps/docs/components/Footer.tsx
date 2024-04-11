import { GitHubIcon } from "./Hero";

const Footer = () => (
  <footer className="w-full border-t border-dashed border-gray-300 p-6">
    <div className="border-3 mx-auto flex max-w-6xl items-center gap-2">
      <img src="/logo.svg" width="40px" />
      <a href="https://www.premieroctet.com/" className="font-semibold">
        by Premier Octet
      </a>
      <div className="ml-auto flex gap-3 text-sm font-light text-black">
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
