"use client";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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
import React, {
  ChangeEvent,
  cloneElement,
  useMemo,
  useRef,
  useState,
} from "react";
import { useConfig } from "../context/ConfigContext";
import { FormContext, FormProvider } from "../context/FormContext";
import { useI18n } from "../context/I18nContext";
import { PropertyValidationError } from "../exceptions/ValidationError";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  Field,
  ModelAction,
  ModelIcon,
  ModelName,
  NextAdminOptions,
  SubmitFormResult,
} from "../types";
import { getSchemas } from "../utils/jsonSchema";
import ActionsDropdown from "./ActionsDropdown";
import Breadcrumb from "./Breadcrumb";
import ArrayField from "./inputs/ArrayField";
import CheckboxWidget from "./inputs/CheckboxWidget";
import DateTimeWidget from "./inputs/DateTimeWidget";
import DateWidget from "./inputs/DateWidget";
import FileWidget from "./inputs/FileWidget";
import JsonField from "./inputs/JsonField";
import NullField from "./inputs/NullField";
import RichTextField from "./inputs/RichText/RichTextField";
import SelectWidget from "./inputs/SelectWidget";
import TextareaWidget from "./inputs/TextareaWidget";
import Button from "./radix/Button";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "./radix/Tooltip";
import { slugify } from "../utils/tools";

class CustomForm extends RjsfForm {
  onSubmit = (e: any) => {};
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
  icon?: ModelIcon;
};

const fields: CustomForm["props"]["fields"] = {
  ArrayField,
  NullField,
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
  icon,
}: FormProps) => {
  const [validation, setValidation] = useState(validationProp);
  const { edit, id, ...schemas } = getSchemas(data, schema, dmmfSchema);
  const { basePath } = useConfig();
  const { router } = useRouterInternal();
  const { t } = useI18n();
  const formRef = useRef<CustomForm>(null);

  const submitButton = (props: SubmitButtonProps) => {
    const { uiSchema } = props;
    const { norender, props: buttonProps } = getSubmitButtonOptions(uiSchema);

    if (norender) {
      return null;
    }

    return (
      <div className="flex space-x-2 mt-4 justify-between">
        <div>
          {edit && (
            <Button
              variant="destructiveOutline"
              className="flex gap-2"
              tabIndex={-1}
              onClick={(e) => {
                if (!confirm("Are you sure to delete this ?")) {
                  e.preventDefault();
                  return;
                }

                const deletionInput = document.createElement("input");
                deletionInput.type = "hidden";
                deletionInput.name = "__admin_action";
                deletionInput.value = "delete";

                e.currentTarget.form?.appendChild(deletionInput);

                e.currentTarget.form?.dispatchEvent(
                  new CustomEvent("submit", { cancelable: true })
                );
                e.currentTarget.form?.requestSubmit();
              }}
              type="button"
            >
              <TrashIcon className="h-4 w-4" />
              {t("form.button.delete.label")}
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            {...buttonProps}
            variant={"ghost"}
            className="hidden sm:block"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.form?.dispatchEvent(
                new CustomEvent("submit", { cancelable: true })
              );
              e.currentTarget.form?.requestSubmit();
            }}
            type="button"
          >
            {t("form.button.save_edit.label")}
          </Button>
          <Button
            {...buttonProps}
            className="flex gap-2"
            type="submit"
            {...(edit
              ? {
                  name: "__admin_redirect",
                  value: "list",
                }
              : {})}
          >
            <CheckCircleIcon className="h-6 w-6" />
            {t("form.button.save.label")}
          </Button>
        </div>
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

      console.log("SUBMIT RESULT", result);

      if (result?.deleted) {
        return router.replace({
          pathname: `${basePath}/${slugify(resource)}`,
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
          ? `${basePath}/${slugify(resource)}`
          : `${basePath}/${slugify(resource)}/${result.createdId}`;
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
          ? `${basePath}/${slugify(resource)}`
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
          schema,
        } = props;

        const labelAlias =
          options?.aliases?.[id as Field<typeof resource>] || label;
        let styleField = options?.edit?.styles?.[id as Field<typeof resource>];

        const tooltip =
          options?.edit?.fields?.[id as Field<typeof resource>]?.tooltip;

        const sanitizedClassNames = classNames
          ?.split(",")
          .filter((className) => className !== "null")
          .join(" ");

        return (
          <div
            style={style}
            className={clsx(sanitizedClassNames, styleField, "py-2 first:pt-0")}
          >
            {schema.type !== "null" && (
              <label
                className={clsx(
                  "flex items-center text-sm font-medium leading-6 text-gray-900 capitalize gap-2 mb-2"
                )}
                htmlFor={id}
              >
                {labelAlias}
                {required ? "*" : null}
                {!!tooltip && (
                  <TooltipProvider>
                    <TooltipRoot>
                      <TooltipTrigger asChild>
                        <InformationCircleIcon className="w-4 h-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipPortal>
                        <TooltipContent
                          side="right"
                          className="px-2 py-1"
                          sideOffset={4}
                        >
                          {tooltip}
                        </TooltipContent>
                      </TooltipPortal>
                    </TooltipRoot>
                  </TooltipProvider>
                )}
              </label>
            )}
            {children}
            {description}
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
              "block w-full transition-all duration-300 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-nextadmin-primary-600 text-sm sm:leading-6 px-2 disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed",
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
      DescriptionFieldTemplate: ({ description, schema }) => {
        return description && schema.type !== "null" ? (
          <span className="text-sm text-gray-500">{description}</span>
        ) : null;
      },
    }),
    [customInputs]
  );

  const breadcrumItems = [
    { label: title, href: `${basePath}/${slugify(resource)}`, icon },
    {
      label: edit ? `Edit` : "Create",
      href: `${basePath}/${slugify(resource)}/${id}`,
      current: !edit,
    },
  ];

  if (edit && id) {
    breadcrumItems.push({
      label: id.toString(),
      href: `${basePath}/${slugify(resource)}/${id}`,
      current: true,
    });
  }

  return (
    <div className="relative">
      <div className="flex h-16 justify-between items-center flex-row gap-3 px-4 sticky top-0 z-10 bg-white border-b border-b-slate-200 shadow-sm">
        <Breadcrumb breadcrumbItems={breadcrumItems} />
        {!!actions && actions.length > 0 && !!id && (
          <ActionsDropdown
            actions={actions}
            resource={resource}
            selectedIds={[id] as string[] | number[]}
            selectedCount={1}
          />
        )}
      </div>
      <div className="max-w-full align-middle p-4 sm:p-8">
        <div className="bg-white max-w-screen-md rounded-lg border p-4 sm:p-8">
          <FormProvider initialValue={data}>
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
                  ref={formRef}
                />
              )}
            </FormContext.Consumer>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default Form;
