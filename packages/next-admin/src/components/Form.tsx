"use client";
import { Prisma } from "@prisma/client";
import RjsfForm from "@rjsf/core";
import {
  BaseInputTemplateProps,
  ErrorSchema,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
  SubmitButtonProps,
  getSubmitButtonOptions,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import clsx from "clsx";
import React, { ChangeEvent, cloneElement, useMemo, useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { FormContext, FormProvider } from "../context/FormContext";
import { useI18n } from "../context/I18nContext";
import { PropertyValidationError } from "../exceptions/ValidationError";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  AdminComponentProps,
  Field,
  ModelAction,
  ModelName,
  NextAdminOptions,
  SubmitFormResult,
} from "../types";
import { getSchemas } from "../utils/jsonSchema";
import ActionsDropdown from "./ActionsDropdown";
import ArrayField from "./inputs/ArrayField";
import CheckboxWidget from "./inputs/CheckboxWidget";
import DateTimeWidget from "./inputs/DateTimeWidget";
import DateWidget from "./inputs/DateWidget";
import FileWidget from "./inputs/FileWidget";
import JsonField from "./inputs/JsonField";
import RichTextField from "./inputs/RichText/RichTextField";
import SelectWidget from "./inputs/SelectWidget";
import TextareaWidget from "./inputs/TextareaWidget";
import Button from "./radix/Button";

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
  options?: Required<NextAdminOptions>["model"][ModelName];
  customInputs?: Record<Field<ModelName>, React.ReactElement | undefined>;
  actions?: ModelAction[];
  searchPaginatedResourceAction?: AdminComponentProps["searchPaginatedResourceAction"];
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
  TextareaWidget: TextareaWidget,
};

const Form = ({
  data,
  schema,
  dmmfSchema,
  resource,
  validation: validationProp,
  action,
  options,
  title,
  customInputs,
  actions,
  searchPaginatedResourceAction,
}: FormProps) => {
  const [validation, setValidation] = useState(validationProp);
  const { edit, id, ...schemas } = getSchemas(data, schema, dmmfSchema);
  const { basePath } = useConfig();
  const { router } = useRouterInternal();
  const { t } = useI18n();
  const submitButton = (props: SubmitButtonProps) => {
    const { uiSchema } = props;
    const { norender, props: buttonProps } = getSubmitButtonOptions(uiSchema);
    if (norender) {
      return null;
    }

    return (
      <div className="flex space-x-2 mt-4 justify-between">
        <div className="flex space-x-2">
          <Button {...buttonProps} name="__admin_redirect" value="list">
            {t("form.button.save.label")}
          </Button>
          <Button {...buttonProps} variant={"ghost"}>
            {t("form.button.save_edit.label")}
          </Button>
        </div>
        {edit && (
          <Button
            type="submit"
            name="__admin_action"
            value="delete"
            variant="destructive"
          >
            {t("form.button.delete.label")}
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
      } else {
        setValidation(undefined);
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
        const pathname = result?.redirect
          ? `${basePath}/${resource.toLowerCase()}`
          : `${basePath}/${resource.toLowerCase()}/${result.createdId}`;
        return router.replace({
          pathname,
          query: {
            message: JSON.stringify({
              type: "success",
              content: "Created successfully",
            }),
          },
        });
      }

      if (result?.updated) {
        const pathname = result?.redirect
          ? `${basePath}/${resource.toLowerCase()}`
          : location.pathname;
        return router.replace({
          pathname,
          query: {
            message: JSON.stringify({
              type: "success",
              content: "Updated successfully",
            }),
          },
        });
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

  const templates: CustomForm["props"]["templates"] = useMemo(
    () => ({
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
        const labelAlias =
          options?.aliases?.[id as Field<typeof resource>] || label;
        let styleField = options?.edit?.styles?.[id as Field<typeof resource>];
        const sanitizedClassNames = classNames
          ?.split(",")
          .filter((className) => className !== "null")
          .join(" ");
        return (
          <div style={style} className={clsx(sanitizedClassNames, styleField)}>
            <label
              className={clsx(
                "block text-sm font-medium leading-6 text-gray-900 capitalize"
              )}
              htmlFor={id}
            >
              {labelAlias}
              {required ? "*" : null}
            </label>
            {description}
            {children}
            {errors}
            {help}
          </div>
        );
      },
      ObjectFieldTemplate: (props: ObjectFieldTemplateProps) => {
        const styleForm = options?.edit?.styles?._form;
        return (
          <div className={clsx("grid", styleForm)}>
            {props.properties.map((element) => element.content)}
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

        if (customInputs?.[props.name as Field<ModelName>]) {
          return cloneElement(customInputs[props.name as Field<ModelName>]!, {
            value: props.value,
            onChange: onChangeOverride || onTextChange,
            readonly,
            rawErrors,
            name: props.name,
          });
        }

        if (schema?.format === "json") {
          return (
            <JsonField
              onChange={onChangeOverride || onTextChange}
              readonly={readonly}
              rawErrors={rawErrors}
              {...props}
            />
          );
        }
        if (schema?.format?.startsWith("richtext-")) {
          return (
            <RichTextField
              onChange={onChangeOverride || onTextChange}
              readonly={readonly}
              rawErrors={rawErrors}
              name={props.name}
              value={props.value}
              schema={schema}
            />
          );
        }

        return (
          // @ts-expect-error
          <input
            onChange={onChangeOverride || onTextChange}
            {...props}
            value={props.value ?? ""}
            className={clsx(
              "block w-full transition-all duration-300 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-nextadmin-primary-600 sm:text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed",
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
          <div className="text-sm text-red-600 mt-1">
            {errors.map((error, idx) => {
              if (typeof error === "string") {
                return <React.Fragment key={idx}>{t(error)}</React.Fragment>;
              }

              return <React.Fragment key={idx}>{error}</React.Fragment>;
            })}
          </div>
        ) : null;
      },
    }),
    [customInputs]
  );

  return (
    <div className="relative">
      <div className="sm:flex sm:items-center justify-between">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          {title}
        </h1>
        {!!actions && actions.length > 0 && !!id && (
          <ActionsDropdown
            actions={actions}
            resource={resource}
            selectedIds={[id] as string[] | number[]}
            selectedCount={1}
          />
        )}
      </div>
      <FormProvider
        initialValue={data}
        searchPaginatedResourceAction={searchPaginatedResourceAction}
        dmmfSchema={dmmfSchema}
        resource={resource}
      >
        <FormContext.Consumer>
          {({ formData, setFormData }) => (
            <CustomForm
              // @ts-expect-error
              action={action ? onSubmit : ""}
              {...(!action ? { method: "post" } : {})}
              onChange={(e) => {
                setFormData(e.formData);
              }}
              idPrefix=""
              idSeparator=""
              enctype={!action ? "multipart/form-data" : undefined}
              {...schemas}
              formData={formData}
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
          )}
        </FormContext.Consumer>
      </FormProvider>
    </div>
  );
};

export default Form;
