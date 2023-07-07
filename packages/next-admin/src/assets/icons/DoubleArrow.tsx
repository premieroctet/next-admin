import clsx from "clsx";

const DoubleArrow = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      className={clsx("w-5 h-5 text-gray-400 cursor-pointer", className)}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default DoubleArrow;
