import clsx from "clsx";
import { useState } from "react";

type BadgeProps = {
  name: string;
  isActive?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>;

const Badge = ({ name, isActive, ...props }: BadgeProps) => {
  const [active, setActive] = useState(isActive);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    setActive((active) => !active);
    props?.onClick?.(e);
  };

  return (
    <span
      {...props}
      onClick={handleClick}
      className={clsx(
        "inline-flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm font-medium",
        active
          ? "text-nextadmin-brand-inverted dark:text-dark-nextadmin-brand-inverted bg-nextadmin-brand-subtle dark:bg-dark-nextadmin-brand-sublte hover:bg-nextadmin-brand-default hover:dark:bg-dark-nextadmin-brand-emphasis"
          : "text-nextadmin-brand-subtle hover:ring-nextadmin-brand-default hover:dark:ring-dark-nextadmin-brand-default hover:text-nextadmin-brand-default hover:dark:text-dark-nextadmin-brand-default dark:text-dark-nextadmin-brand-subtle bg-nextadmin-dackground-default dark:bg-dark-nextadmin-background-strong ring-nextadmin-brand-subtle dark:ring-dark-nextadmin-brand-subtle ring-1 ring-inset",
        props.className
      )}
    >
      {name}
    </span>
  );
};

export default Badge;
