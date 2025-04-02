import { useField } from "../../hooks/useField";
import { cn } from "../../utils/tools";
import BaseInput from "../inputs/BaseInput";
import { FieldTemplate } from "./templates/FieldTemplate";

export type FieldProps = {
  name: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export const Field = ({ name, className, ...props }: FieldProps) => {
  const { tooltip, required, disabled, description, errors, help, label, value, onChange } = useField({ name });

  return (
    <div className={cn(className)} {...props}>
      <FieldTemplate
        labelName={label}
        required={required}
        tooltip={tooltip}
        description={description}
        errors={errors}
        help={help}
        name={name}
      >
        <BaseInput
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={cn({ "ring-red-600 dark:ring-red-400": errors?.length > 0 })}
          disabled={disabled}
        />
      </FieldTemplate>
    </div>
  );
};