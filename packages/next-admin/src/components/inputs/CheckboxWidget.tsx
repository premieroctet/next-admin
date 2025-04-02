import { WidgetProps } from "@rjsf/utils";

import { SwitchRoot, SwitchThumb } from "../radix/Switch";

const CheckboxWidget = ({
  options,
  onChange,
  value,
  disabled,
  ...props
}: WidgetProps) => {

  return (
    <div className="relative flex items-start py-1">
      <div className="flex h-5 items-center">
        <input
          id={props.name}
          value={value ? "on" : "off"}
          name={props.name}
          className="absolute inset-0 -z-10 h-full w-full opacity-0"
          readOnly
        />
        <SwitchRoot
          id={props.name}
          checked={value}
          onCheckedChange={(value) => {

            onChange(value);
          }}
          disabled={disabled}
        >
          <SwitchThumb />
        </SwitchRoot>
      </div>
    </div>
  );
};

export default CheckboxWidget;
