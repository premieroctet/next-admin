import { HTMLProps } from "react";
import { useRouterInternal } from "../../hooks/useRouterInternal";

type Props = Omit<HTMLProps<HTMLAnchorElement>, "href"> & {
  href: string;
};

const Link = ({ children, onClick, ...props }: Props) => {
  const { router } = useRouterInternal();

  return (
    <a
      onClick={(e) => {
        onClick?.(e);

        if ((e.target as HTMLAnchorElement).target === "_blank") {
          e.preventDefault();
          window.open(props.href, "_blank");
        }

        if (e.defaultPrevented) return;

        e.preventDefault();
        router.push({
          pathname: props.href,
        });
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
