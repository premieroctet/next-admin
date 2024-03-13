import { WidgetProps } from "@rjsf/utils";

const CheckboxWidget = ({
  options,
  onChange,
  value,
  ...props
}: WidgetProps) => {
  return (
    <div className="relative flex items-start py-1">
      <div className="flex items-center h-5">
        <input
          type="hidden"
          value={value ? "on" : "off"}
          name={props.name}
          className="absolute -z-10 inset-0 w-full h-full opacity-0"
        />
        <input
          id={props.id}
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
          className="focus:ring-nextadmin-primary-500 h-4 w-4 text-nextadmin-primary-600 border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default CheckboxWidget;
