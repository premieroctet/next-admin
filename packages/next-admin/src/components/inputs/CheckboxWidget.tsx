import { WidgetProps } from "@rjsf/utils";
import { SwitchRoot, SwitchThumb } from "../radix/Switch";

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
        <SwitchRoot checked={value} onCheckedChange={onChange}>
          <SwitchThumb />
        </SwitchRoot>
      </div>
    </div>
  );
};

export default CheckboxWidget;
