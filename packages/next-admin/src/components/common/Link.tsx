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
        e.persist();
        onClick?.(e);

        if (e.defaultPrevented) return;

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
