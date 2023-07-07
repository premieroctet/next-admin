import RjsfForm from "@rjsf/core";
import {
  BaseInputTemplateProps,
  FieldTemplateProps,
  SubmitButtonProps,
  getSubmitButtonOptions,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { ChangeEvent } from "react";
import Button from "./radix/Button";
import clsx from "clsx";
import { Schemas, getSchemas } from "../utils/jsonSchema";
import { Prisma } from "@prisma/client";
import SelectWidget from "./inputs/SelectWidget";
import { capitalize, formatCamelCase } from "../utils/tools";
import { ModelName } from "../types";
import ArrayField from "./inputs/ArrayField";
import CheckboxWidget from "./inputs/CheckboxWidget";

// Override Form functions to not prevent the submit
class CustomForm extends RjsfForm {
  onSubmit = (e: any) => {
    if (
      e.nativeEvent.submitter.value === "delete" &&
      !confirm("Are you sure to delete this ?")
    ) {
      e.preventDefault();
      return false;
    }
  };
}

export type FormProps = {
  data: any;
  schema: any;
  dmmfSchema: Prisma.DMMF.Field[];
  ressource: ModelName;
};

const fields = {
  ArrayField,
};

const widgets = {
  SelectWidget: SelectWidget,
  CheckboxWidget: CheckboxWidget,
};

const templates = {
  FieldTemplate: (props: FieldTemplateProps) => {
    const {
      id,
      classNames,
      style,
      label,
      help,
      required,
      description,
      errors,
      children,
    } = props;
    return (
      <div className={clsx(classNames, "py-1")} style={style}>
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor={id}
        >
          {formatCamelCase(label)}
          {required ? "*" : null}
        </label>
        {description}
        {children}
        {errors}
        {help}
      </div>
    );
  },
  BaseInputTemplate: ({
    onChange,
    options,
    onChangeOverride,
    ...props
  }: BaseInputTemplateProps) => {
    const onTextChange = ({
      target: { value: val },
    }: ChangeEvent<HTMLInputElement>) => {
      // Use the options.emptyValue if it is specified and newVal is also an empty string
      onChange(val === "" ? options.emptyValue || "" : val);
    };

    return (
      // @ts-expect-error
      <input
        onChange={onChangeOverride || onTextChange}
        {...props}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
      />
    );
  },
};

const Form = ({ data, schema, dmmfSchema, ressource }: FormProps) => {
  const schemas: Schemas = getSchemas(data, schema, dmmfSchema);
  const edit = data?.id !== undefined;
  const submitButton = (props: SubmitButtonProps) => {
    const { uiSchema } = props;
    const {
      norender,
      submitText,
      props: buttonProps,
    } = getSubmitButtonOptions(uiSchema);
    if (norender) {
      return null;
    }

    return (
      <div className="flex space-x-2 mt-4">
        <Button {...buttonProps}>{submitText}</Button>
        {edit && (
          <Button
            type="submit"
            name="action"
            value="delete"
            className="bg-red-700"
          >
            Delete
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="sm:flex sm:items-center">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          {capitalize(ressource)}
        </h1>
      </div>
      <CustomForm
        action=""
        method="post"
        idPrefix=""
        idSeparator=""
        {...schemas}
        formData={data}
        validator={validator}
        fields={fields}
        templates={{
          ...templates,
          ButtonTemplates: { SubmitButton: submitButton },
        }}
        widgets={widgets}
        onSubmit={(e) => console.log("onSubmit", e)}
        onError={(e) => console.log("onError", e)}
      />
    </div>
  );
};

export default Form;
