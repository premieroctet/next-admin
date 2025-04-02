import { useConfig } from "../../context/ConfigContext";
import { useForm } from "../../context/FormContext";
import { cn } from "../../utils/tools";
import { Field } from "./Field";
import { Group } from "./Group";

export const FormDisplay = () => {

  const { modelOptions } = useConfig();
  const { form: { schema } } = useForm();

  const renderField = (property: any, key: string) => {
    return <Field key={key} name={key} />
  }

  return <Group className={cn("max-w-screen-md", modelOptions?.edit?.styles?._form)}>
    {Object.entries(schema.properties).map(([key, property]) => (
      renderField(property, key)
    ))}
  </Group>
};
