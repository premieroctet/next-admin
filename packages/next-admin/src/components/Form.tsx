"use client";
import { Prisma } from "@prisma/client";
import RjsfForm from "@rjsf/core";
import {
  BaseInputTemplateProps,
  ErrorSchema,
  FieldTemplateProps,
  SubmitButtonProps,
  getSubmitButtonOptions,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import clsx from "clsx";
import { ChangeEvent, useState } from "react";
import { PropertyValidationError } from "../exceptions/ValidationError";
import { ModelName, SubmitFormResult } from "../types";
import { Schemas, getSchemas } from "../utils/jsonSchema";
import ArrayField from "./inputs/ArrayField";
import CheckboxWidget from "./inputs/CheckboxWidget";
import SelectWidget from "./inputs/SelectWidget";
import Button from "./radix/Button";
import DateTimeWidget from "./inputs/DateTimeWidget";
import DateWidget from "./inputs/DateWidget";
import FileWidget from "./inputs/FileWidget";
import { useConfig } from "../context/ConfigContext";
import { useRouterInternal } from "../hooks/useRouterInternal";

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
  resource: ModelName;
  validation?: PropertyValidationError[];
  action?: (formData: FormData) => Promise<SubmitFormResult | undefined>;
  title: string;
};

const fields: CustomForm["props"]["fields"] = {
  ArrayField,
};

const widgets: CustomForm["props"]["widgets"] = {
  DateWidget: DateWidget,
  DateTimeWidget: DateTimeWidget,
  SelectWidget: SelectWidget,
  CheckboxWidget: CheckboxWidget,
  FileWidget: FileWidget,
};

const templates: CustomForm["props"]["templates"] = {
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
          className="block text-sm font-medium leading-6 text-gray-900 capitalize"
          htmlFor={id}
        >
          {label}
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
    uiSchema,
    readonly,
    formContext,
    autofocus,
    rawErrors,
    schema,
    registry,
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
        className={clsx(
          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed",
          { "ring-red-600": rawErrors }
        )}
      />
    );
  },
  ErrorListTemplate: () => {
    return null; // Global error is already displayed outside of the form
  },
  FieldErrorTemplate: ({ errors }) => {
    return errors ? (
      <div className="text-sm text-red-600 mt-1">{errors}</div>
    ) : null;
  },
};

const Form = ({
  data,
  schema,
  dmmfSchema,
  resource,
  validation: validationProp,
  action,
  title,
}: FormProps) => {
  const [validation, setValidation] = useState(validationProp);
  const { edit, ...schemas } = getSchemas(data, schema, dmmfSchema);
  const { basePath } = useConfig();
  const { router } = useRouterInternal();
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
            name="__admin_action"
            value="delete"
            variant="destructive"
          >
            Delete
          </Button>
        )}
      </div>
    );
  };

  const extraErrors: ErrorSchema | undefined = validation?.reduce(
    (acc, curr) => {
      // @ts-expect-error
      acc[curr.property] = {
        __errors: [curr.message],
      };

      return acc;
    },
    {} as ErrorSchema
  );

  const onSubmit = async (formData: FormData) => {
    if (action) {
      const result = await action(formData);

      if (result?.validation) {
        setValidation(result.validation);
      }

      if (result?.deleted) {
        return router.replace({
          pathname: `${basePath}/${resource.toLowerCase()}`,
          query: {
            message: JSON.stringify({
              type: "success",
              content: "Deleted successfully",
            }),
          },
        });
      }

      if (result?.created) {
        return router.replace({
          pathname: `${basePath}/${resource.toLowerCase()}/${result.createdId}`,
          query: {
            message: JSON.stringify({
              type: "success",
              content: "Created successfully",
            }),
          },
        });
      }

      if (result?.updated) {
        location.search = `?message=${encodeURIComponent(
          JSON.stringify({
            type: "success",
            content: "Updated successfully",
          })
        )}`;
      }

      if (result?.error) {
        return router.replace({
          pathname: location.pathname,
          query: {
            error: result.error,
          },
        });
      }
    }
  };

  return (
    <div className="relative">
      <div className="sm:flex sm:items-center">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          {title}
        </h1>
      </div>
      <CustomForm
        // @ts-expect-error
        action={action ? onSubmit : ""}
        method="post"
        idPrefix=""
        idSeparator=""
        enctype={!action ? "multipart/form-data" : undefined}
        {...schemas}
        formData={data}
        validator={validator}
        extraErrors={extraErrors}
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
