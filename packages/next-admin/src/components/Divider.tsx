import { cva, VariantProps } from "class-variance-authority";

const divider = cva("flex border-b", {
  variants: {
    type: {
      default:
        "border-b-nextadmin-border-default dark:border-b-dark-nextadmin-border-default",
      strong:
        "border-b-nextadmin-border-strong dark:border-b-dark-nextadmin-border-strong",
    },
  },
  defaultVariants: {
    type: "default",
  },
});

type Props = VariantProps<typeof divider>;

export default function Divider({ type }: Props) {
  return <div className={divider({ type })} />;
}
