"use client";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import RjsfForm from "@rjsf/core";
import {
  BaseInputTemplateProps,
  ErrorSchema,
  FieldTemplateProps,
  getSubmitButtonOptions,
  ObjectFieldTemplateProps,
  SubmitButtonProps,
} from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import clsx from "clsx";
import dynamic from "next/dynamic";
import React, {
  ChangeEvent,
  cloneElement,
  forwardRef,
  HTMLProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { useConfig } from "../context/ConfigContext";
import FormDataProvider, { useFormData } from "../context/FormDataContext";
import FormStateProvider, { useFormState } from "../context/FormStateContext";
import { useI18n } from "../context/I18nContext";
import { MessageProvider, useMessage } from "../context/MessageContext";
import { useDeleteAction } from "../hooks/useDeleteAction";
import { useRouterInternal } from "../hooks/useRouterInternal";
import {
  EditFieldsOptions,
  Field,
  FormProps,
  ModelName,
  ModelOptions,
  Permission,
} from "../types";
import { getSchemas } from "../utils/jsonSchema";
import { formatLabel, slugify } from "../utils/tools";
import FormHeader from "./FormHeader";
import ArrayField from "./inputs/ArrayField";
import CheckboxWidget from "./inputs/CheckboxWidget";
import DateTimeWidget from "./inputs/DateTimeWidget";
import DateWidget from "./inputs/DateWidget";
import FileWidget from "./inputs/FileWidget";
import JsonField from "./inputs/JsonField";
import NullField from "./inputs/NullField";
import SelectWidget from "./inputs/SelectWidget";
import TextareaWidget from "./inputs/TextareaWidget";
import Message from "./Message";
import Button from "./radix/Button";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "./radix/Tooltip";

const RichTextField = dynamic(() => import("./inputs/RichText/RichTextField"), {
  ssr: false,
});

const fields: RjsfForm["props"]["fields"] = {
  ArrayField,
  NullField,
};

const widgets: RjsfForm["props"]["widgets"] = {
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
  customInputs,
}: FormProps) => {
  const [validation, setValidation] = useState(validationProp);
  const { basePath, options, apiBasePath } = useConfig();
  const modelOptions: ModelOptions<typeof resource>[typeof resource] =
    options?.model?.[resource];
  const canDelete =
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(Permission.DELETE);
  const canEdit =
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(Permission.EDIT);
  const canCreate =
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(Permission.CREATE);
  const { edit, id, ...schemas } = getSchemas(
    data,
    schema,
    dmmfSchema,
    modelOptions?.edit?.fields as EditFieldsOptions<typeof resource>
  );
  const { router } = useRouterInternal();
  const { t } = useI18n();
  const formRef = useRef<RjsfForm>(null);
  const [isPending, setIsPending] = useState(false);
  const allDisabled = edit && !canEdit;
  const { runDeletion } = useDeleteAction(resource);
  const { showMessage } = useMessage();
  const { cleanAll } = useFormState();
  const { setFormData } = useFormData();

  useEffect(() => {
    if (!edit && !canCreate) {
      router.replace({ pathname: "/" });
    }
  }, [canCreate, edit, router]);

  const submitButton = useMemo(
    () => (props: SubmitButtonProps) => {
      const { uiSchema } = props;
      const { norender, props: buttonProps } = getSubmitButtonOptions(uiSchema);

      if (norender) {
        return null;
      }

      return (
        <div className="align-center mt-4 flex flex-wrap justify-between gap-2">
          {((edit && canEdit) || (!edit && canCreate)) && (
            <div className="order-2 flex gap-2">
              <Button
                {...buttonProps}
                className="order-2 flex gap-2"
                type="submit"
                name="__admin_redirect"
                value="list"
                loading={isPending}
              >
                {!isPending && <CheckCircleIcon className="h-6 w-6" />}
                {t("form.button.save.label")}
              </Button>
              <Button
                {...buttonProps}
                variant={"ghost"}
                className="order-1 hidden sm:block"
                tabIndex={-1}
                type="submit"
                loading={isPending}
                name="save_edit"
              >
                {t("form.button.save_edit.label")}
              </Button>
            </div>
          )}
          <div className="order-1">
            {edit && canDelete && (
              <Button
                variant="destructiveOutline"
                className="flex gap-2"
                formNoValidate
                tabIndex={-1}
                onClick={async (e) => {
                  if (!confirm(t("form.delete.alert"))) {
                    e.preventDefault();
                  } else {
                    try {
                      setIsPending(true);
                      await runDeletion([id!] as string[] | number[]);
                      router.replace({
                        pathname: `${basePath}/${slugify(resource)}`,
                        query: {
                          message: JSON.stringify({
                            type: "success",
                            message: "Deleted successfully",
                          }),
                        },
                      });
                    } catch (e) {
                      showMessage({
                        type: "error",
                        message: (e as Error).message,
                      });
                    } finally {
                      setIsPending(false);
                    }
                  }
                }}
                loading={isPending}
              >
                {!isPending && <TrashIcon className="h-4 w-4" />}
                {t("form.button.delete.label")}
              </Button>
            )}
          </div>
        </div>
      );
    },
    [isPending, id]
  );

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

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        setIsPending(true);
        const response = await fetch(
          `${apiBasePath}/${slugify(resource)}${id ? `/${id}` : ""}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (result?.validation) {
          setValidation(result.validation);
        } else {
          setValidation(undefined);
        }

        if (result?.data) {
          setFormData(result.data);
          cleanAll();
        }

        if (result?.deleted) {
          return router.replace({
            pathname: `${basePath}/${slugify(resource)}`,
            query: {
              message: JSON.stringify({
                type: "success",
                message: "Deleted successfully",
              }),
            },
          });
        }

        if (result?.created) {
          const pathname = result?.redirect
            ? `${basePath}/${slugify(resource)}`
            : `${basePath}/${slugify(resource)}/${result.createdId}`;
          return router.push({
            pathname,
            query: {
              message: JSON.stringify({
                type: "success",
                message: "Created successfully",
              }),
            },
          });
        }

        if (result?.updated) {
          const pathname = result?.redirect
            ? `${basePath}/${slugify(resource)}`
            : location.pathname;

          if (pathname === location.pathname) {
            showMessage({
              type: "success",
              message: "Updated successfully",
            });
          } else {
            return router.push({
              pathname,
              query: {
                message: JSON.stringify({
                  type: "success",
                  message: "Updated successfully",
                }),
              },
            });
          }
        }

        if (result?.error) {
          showMessage({
            type: "error",
            message: result.error,
          });
        }
      } finally {
        setIsPending(false);
      }
    },
    [apiBasePath, id]
  );

  const templates: RjsfForm["props"]["templates"] = {
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
        modelOptions?.aliases?.[id as Field<typeof resource>] ||
        formatLabel(label);
      const labelName = t(`model.${resource}.fields.${id}`, {}, labelAlias);

      let styleField =
        modelOptions?.edit?.styles?.[id as Field<typeof resource>];

      const tooltip =
        modelOptions?.edit?.fields?.[id as Field<typeof resource>]?.tooltip;

      const sanitizedClassNames = classNames
        ?.split(",")
        .filter((className) => className !== "null")
        .join(" ");

      return (
        <div style={style} className={clsx(sanitizedClassNames, styleField)}>
          {schema.type !== "null" && (
            <label
              className={clsx(
                "text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted mb-2 flex items-center gap-2 text-sm font-medium leading-6"
              )}
              htmlFor={id}
            >
              {labelName}
              {required ? "*" : null}
              {!!tooltip && (
                <TooltipProvider>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <InformationCircleIcon className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default h-4 w-4" />
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
      const styleForm = modelOptions?.edit?.styles?._form;
      return (
        <div className={twMerge("grid gap-4", styleForm)}>
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
      hideError,
      hideLabel,
      ...props
    }: BaseInputTemplateProps) => {
      const { setFieldDirty } = useFormState();
      const onTextChange = ({
        target: { value: val },
      }: ChangeEvent<HTMLInputElement>) => {
        // Use the options.emptyValue if it is specified and newVal is also an empty string
        setFieldDirty(props.name);
        onChange(val === "" ? options.emptyValue || "" : val);
      };

      if (customInputs?.[props.name as Field<ModelName>]) {
        return cloneElement(customInputs[props.name as Field<ModelName>]!, {
          value: props.value,
          onChange: onChangeOverride || onTextChange,
          readonly,
          rawErrors,
          name: props.name,
          required: props.required,
          disabled: props.disabled,
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
            disabled={props.disabled}
            required={props.required}
          />
        );
      }

      if (["time", "time-second"].includes(schema?.format as string)) {
        return (
          // @ts-expect-error
          <input
            type="time"
            onChange={onChangeOverride || onTextChange}
            {...props}
            value={
              props.value
                .split(":")
                .slice(0, schema?.format === "time-second" ? 3 : 2)
                .join(":") ?? ""
            }
            className={clsx(
              "dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default dark:ring-dark-nextadmin-border-strong block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-colors duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6",
              { "ring-red-600 dark:ring-red-400": rawErrors }
            )}
            step={schema?.format === "time-second" ? 1 : undefined}
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
            "dark:bg-dark-nextadmin-background-subtle text-nextadmin-content-inverted dark:text-dark-nextadmin-content-inverted ring-nextadmin-border-default focus:ring-nextadmin-brand-default dark:focus:ring-dark-nextadmin-brand-default dark:ring-dark-nextadmin-border-strong block w-full rounded-md border-0 px-2 py-1.5 text-sm shadow-sm ring-1 ring-inset transition-colors duration-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6",
            { "ring-red-600 dark:ring-red-400": rawErrors }
          )}
        />
      );
    },
    ErrorListTemplate: () => {
      return null; // Global error is already displayed outside of the form
    },
    FieldErrorTemplate: ({ errors }) => {
      return errors ? (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
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
        <span className="text-nextadmin-content-emphasis dark:text-dark-nextadmin-content-emphasis text-sm">
          {description}
        </span>
      ) : null;
    },
  };

  const CustomForm = forwardRef<HTMLFormElement, HTMLProps<HTMLFormElement>>(
    (props, ref) => {
      const { dirtyFields } = useFormState();
      return (
        <form
          {...props}
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
            const formValues = new FormData(e.target as HTMLFormElement);
            const data = new FormData();
            dirtyFields.forEach((field) => {
              data.append(field, formValues.get(field) as string);
            });

            // @ts-expect-error
            const submitter = e.nativeEvent.submitter as HTMLButtonElement;
            data.append(submitter.name, submitter.value);
            onSubmit(data);
          }}
        />
      );
    }
  );

  const RjsfFormComponent = useMemo(
    () =>
      forwardRef<RjsfForm>((_props, ref) => {
        const { formData } = useFormData();

        return (
          <RjsfForm
            tagName={CustomForm}
            idPrefix=""
            idSeparator=""
            {...schemas}
            onChange={(e) => {
              setFormData(e.formData);
            }}
            formData={formData}
            validator={validator}
            extraErrors={extraErrors}
            fields={fields}
            disabled={allDisabled}
            formContext={{ isPending }}
            templates={{
              ...templates,
              ButtonTemplates: { SubmitButton: submitButton },
            }}
            widgets={widgets}
            ref={ref}
            className="relative"
          />
        );
      }),
    [submitButton]
  );

  return (
    <div className="relative h-full">
      <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default max-w-full p-4 align-middle sm:p-8 ">
        <Message className="-mt-2 mb-2 sm:-mt-4 sm:mb-4" />
        <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-emphasis border-nextadmin-border-default dark:border-dark-nextadmin-border-default max-w-screen-md rounded-lg border p-4 sm:p-8">
          <RjsfFormComponent ref={formRef} />
        </div>
      </div>
    </div>
  );
};

const FormWrapper = (props: FormProps) => {
  return (
    <>
      <FormHeader {...props} />
      <MessageProvider>
        <FormDataProvider data={props.data}>
          <FormStateProvider>
            <Form {...props} />
          </FormStateProvider>
        </FormDataProvider>
      </MessageProvider>
    </>
  );
};

export default FormWrapper;
