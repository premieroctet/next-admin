import clsx from "clsx";
import { useState } from "react";
import Checkbox from "./radix/Checkbox";

type BadgeProps = {
  name: string;
  isActive?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>;

const Badge = ({ isActive, onClick, ...props }: BadgeProps) => {
  const [active, setActive] = useState(isActive);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    setActive((active) => !active);
    onClick?.(e);
  };

  return (
    <div
      {...props}
      className={clsx(
        "bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis text-nextadmin-content-inverted dark:text-dark-nextadmin-content-subtle ring-nextadmin-border-default dark:ring-dark-nextadmin-border-default bg-nextadmin-dackground-default dark:bg-dark-nextadmin-background-strong peer flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 text-sm font-medium ring-1",
        props.className
      )}
    >
      <Checkbox
        onClick={handleClick}
        name={props.name}
        id={props.name}
        checked={active}
      />
      <label className="cursor-pointer" htmlFor={props.name}>
        {props.name}
      </label>
    </div>
  );
};

export default Badge;
