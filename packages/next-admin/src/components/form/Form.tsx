"use client";
import { CheckCircleIcon, InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import RjsfForm from "@rjsf/core";
import {
  BaseInputTemplateProps,
  ErrorSchema,
  FieldProps,
  FieldTemplateProps,
  getSubmitButtonOptions,
  ObjectFieldTemplateProps,
  SubmitButtonProps,
} from "@rjsf/utils";
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
  useState
} from "react";
import { twMerge } from "tailwind-merge";
import ClientActionDialogProvider from "../../context/ClientActionDialogContext";
import { useConfig } from "../../context/ConfigContext";
import { useI18n } from "../../context/I18nContext";
import { useMessage } from "../../context/MessageContext";
import { useDeleteAction } from "../../hooks/useDeleteAction";
import { useRouterInternal } from "../../hooks/useRouterInternal";
import {
  EditFieldsOptions,
  //Field,
  FormProps,
  ModelName,
  ModelOptions,
  Permission
} from "../../types";
import { getInfos, modifySchema } from "../../utils/jsonSchema";
import { cn, formatLabel, isFileUploadFormat, slugify } from "../../utils/tools";
import ArrayField from "../inputs/ArrayField";
import BaseInput from "../inputs/BaseInput";
import CheckboxWidget from "../inputs/CheckboxWidget";
import DateTimeWidget from "../inputs/DateTimeWidget";
import DateWidget from "../inputs/DateWidget";
import FileWidget from "../inputs/FileWidget/FileWidget";
import JsonField from "../inputs/JsonField";
import NullField from "../inputs/NullField";
import SelectWidget from "../inputs/SelectWidget";
import TextareaWidget from "../inputs/TextareaWidget";
import Message from "../Message";
import Button from "../radix/Button";
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from "../radix/Tooltip";
import FormHeader from "./FormHeader";
import {Group} from "./Group";
import { Field } from "./Field";
import { FormProvider, createForm } from "../../context/FormContext";
import { FormDisplay } from "./FormDisplay";
// const RichTextField = dynamic(() => import("../inputs/RichText/RichTextField"), {
//   ssr: false,
//   loading: () => <div className="h-48 animate-pulse rounded bg-gray-500" />,
// });

// const widgets: RjsfForm["props"]["widgets"] = {
//   DateWidget: DateWidget,
//   DateTimeWidget: DateTimeWidget,
//   SelectWidget: SelectWidget,
//   CheckboxWidget: CheckboxWidget,
//   FileWidget: FileWidget,
//   TextareaWidget: TextareaWidget,
// };

const Form = ({
  data,
  schema,
  resource,
  validation: validationProp,
  customInputs,
  actions,
  title,
  slug,
  icon
}: FormProps) => {
  const [validation, setValidation] = useState(validationProp);
  const { basePath, options, apiBasePath, modelOptions } = useConfig();
  const canDelete =
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(Permission.DELETE);
  const canEdit =
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(Permission.EDIT);
  const canCreate =
    !modelOptions?.permissions ||
    modelOptions?.permissions?.includes(Permission.CREATE);
  const { edit, id } = getInfos(
    data,
    schema,
  );

  modifySchema(data, schema, modelOptions?.edit?.fields as EditFieldsOptions<typeof resource>);
  const { router } = useRouterInternal();
  const { t } = useI18n();
  const [isPending, setIsPending] = useState(false);
  const allDisabled = edit && !canEdit;
  const { runSingleDeletion } = useDeleteAction(resource);
  const { showMessage } = useMessage();



  useEffect(() => {
    if (!edit && !canCreate) {
      router.replace({ pathname: "/" });
    }
  }, [canCreate, edit, router]);

  // const submitButton = useMemo(
  //   () => (props: SubmitButtonProps) => {
  //     const { uiSchema } = props;
  //     const { norender, props: buttonProps } = getSubmitButtonOptions(uiSchema);

  //     if (norender) {
  //       return null;
  //     }

  //     return (
  //       <div className="align-center mt-4 flex flex-wrap justify-between gap-2">
  //         {((edit && canEdit) || (!edit && canCreate)) && (
  //           <div className="order-2 flex gap-2">
  //             <Button
  //               {...buttonProps}
  //               className="order-2 flex gap-2"
  //               type="submit"
  //               name="__admin_redirect"
  //               value="list"
  //               loading={isPending}
  //             >
  //               {!isPending && <CheckCircleIcon className="h-6 w-6" />}
  //               {t("form.button.save.label")}
  //             </Button>
  //             <Button
  //               {...buttonProps}
  //               variant={"ghost"}
  //               className="order-1 hidden sm:block"
  //               tabIndex={-1}
  //               type="submit"
  //               loading={isPending}
  //               name="save_edit"
  //             >
  //               {t("form.button.save_edit.label")}
  //             </Button>
  //           </div>
  //         )}
  //         <div className="order-1">
  //           {edit && canDelete && (
  //             <Button
  //               variant="destructiveOutline"
  //               className="flex gap-2"
  //               formNoValidate
  //               tabIndex={-1}
  //               onClick={async (e) => {
  //                 if (!confirm(t("form.delete.alert"))) {
  //                   e.preventDefault();
  //                 } else {
  //                   try {
  //                     setIsPending(true);
  //                     await runSingleDeletion(id!);
  //                     router.replace({
  //                       pathname: `${basePath}/${slugify(resource)}`,
  //                       query: {
  //                         message: JSON.stringify({
  //                           type: "success",
  //                           message: t("form.delete.succeed"),
  //                         }),
  //                       },
  //                     });
  //                   } catch (e) {
  //                     showMessage({
  //                       type: "error",
  //                       message: t((e as Error).message),
  //                     });
  //                   } finally {
  //                     setIsPending(false);
  //                   }
  //                 }
  //               }}
  //               loading={isPending}
  //             >
  //               {!isPending && <TrashIcon className="h-4 w-4" />}
  //               {t("form.button.delete.label")}
  //             </Button>
  //           )}
  //         </div>
  //       </div>
  //     );
  //   },
  //   [isPending, id]
  // );

  // const extraErrors: ErrorSchema | undefined = validation?.reduce(
  //   (acc, curr) => {
  //     // @ts-expect-error
  //     acc[curr.property] = {
  //       __errors: [curr.message],
  //     };

  //     return acc;
  //   },
  //   {} as ErrorSchema
  // );

  // const onSubmit = useCallback(
  //   async (formData: FormData) => {
  //     try {
  //       setIsPending(true);
  //       const response = await fetch(
  //         `${apiBasePath}/${slugify(resource)}${id ? `/${id}` : ""}`,
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );
  //       const result = await response.json();
  //       if (result?.validation) {
  //         setValidation(result.validation);
  //       } else {
  //         setValidation(undefined);
  //       }
  //       if (result?.data) {
  //         setFormData(result.data);
  //         cleanAll();
  //       }
  //       if (result?.deleted) {
  //         return router.replace({
  //           pathname: `${basePath}/${slugify(resource)}`,
  //           query: {
  //             message: JSON.stringify({
  //               type: "success",
  //               message: t("form.delete.succeed"),
  //             }),
  //           },
  //         });
  //       }
  //       if (result?.created) {
  //         const pathname = result?.redirect
  //           ? `${basePath}/${slugify(resource)}`
  //           : `${basePath}/${slugify(resource)}/${result.createdId}`;
  //         return router.push({
  //           pathname,
  //           query: {
  //             message: JSON.stringify({
  //               type: "success",
  //               message: t("form.create.succeed"),
  //             }),
  //           },
  //         });
  //       }
  //       if (result?.updated) {
  //         const pathname = result?.redirect
  //           ? `${basePath}/${slugify(resource)}`
  //           : location.pathname;
  //         if (pathname === location.pathname) {
  //           showMessage({
  //             type: "success",
  //             message: t("form.update.succeed"),
  //           });
  //         } else {
  //           return router.push({
  //             pathname,
  //             query: {
  //               message: JSON.stringify({
  //                 type: "success",
  //                 message: t("form.update.succeed"),
  //               }),
  //             },
  //           });
  //         }
  //       }
  //       if (result?.error) {
  //         showMessage({
  //           type: "error",
  //           message: t(result.error),
  //         });
  //       }
  //     } finally {
  //       setIsPending(false);
  //     }
  //   },
  //   [apiBasePath, id]
  // );

  // const fields: RjsfForm["props"]["fields"] = {
  //   ArrayField: (props: FieldProps) => {
  //     const customInput = customInputs?.[props.name as Field<ModelName>];
  //     const improvedCustomInput = customInput
  //       ? cloneElement(customInput, {
  //         ...customInput.props,
  //         mode: edit ? "edit" : "create",
  //       })
  //       : undefined;
  //     return ArrayField({ ...props, customInput: improvedCustomInput });
  //   },
  //   NullField,
  // };

  // const templates: RjsfForm["props"]["templates"] = {
  //   BaseInputTemplate: ({
  //     onChange,
  //     options,
  //     onChangeOverride,
  //     uiSchema,
  //     readonly,
  //     formContext,
  //     autofocus,
  //     rawErrors,
  //     schema,
  //     registry,
  //     hideError,
  //     hideLabel,
  //     ...props
  //   }: BaseInputTemplateProps) => {

  //     const onTextChange = ({
  //       target: { value: val },
  //     }: ChangeEvent<HTMLInputElement>) => {
  //       // Use the options.emptyValue if it is specified and newVal is also an empty string

  //       onChange(val === "" ? options.emptyValue || "" : val);
  //     };

  //     const customInput = customInputs?.[props.name as Field<ModelName>];
  //     if (customInput) {
  //       return cloneElement(customInput, {
  //         value: props.value,
  //         onChange: onChangeOverride || onTextChange,
  //         readonly,
  //         rawErrors,
  //         name: props.name,
  //         required: props.required,
  //         disabled: props.disabled,
  //         mode: edit ? "edit" : "create",
  //       });
  //     }

  //     if (schema?.format === "json") {
  //       return (
  //         <JsonField
  //           onChange={onChangeOverride || onTextChange}
  //           readonly={readonly}
  //           rawErrors={rawErrors}
  //           {...props}
  //         />
  //       );
  //     }
  //     if (schema?.format?.startsWith("richtext-")) {
  //       return (
  //         <RichTextField
  //           onChange={onChangeOverride || onTextChange}
  //           readonly={readonly}
  //           rawErrors={rawErrors}
  //           name={props.name}
  //           value={props.value}
  //           schema={schema}
  //           disabled={props.disabled}
  //           required={props.required}
  //         />
  //       );
  //     }

  //     if (["time", "time-second"].includes(schema?.format as string)) {
  //       return (
  //         // @ts-expect-error
  //         <BaseInput
  //           type="time"
  //           onChange={onChangeOverride || onTextChange}
  //           {...props}
  //           value={
  //             props.value
  //               .split(":")
  //               .slice(0, schema?.format === "time-second" ? 3 : 2)
  //               .join(":") ?? ""
  //           }
  //           className={clsx({ "ring-red-600 dark:ring-red-400": rawErrors })}
  //           step={schema?.format === "time-second" ? 1 : undefined}
  //         />
  //       );
  //     }
  //     return (
  //       // @ts-expect-error
  //       <BaseInput
  //         onChange={onChangeOverride || onTextChange}
  //         {...props}
  //         value={props.value ?? ""}
  //         className={clsx({ "ring-red-600 dark:ring-red-400": rawErrors })}
  //       />
  //     );
  //   },
  //   ButtonTemplates: {
  //     SubmitButton: submitButton,
  //   },
  // };

  // const CustomForm = useMemo(
  //   () =>
  //     forwardRef<HTMLFormElement, HTMLProps<HTMLFormElement>>((props, ref) => {
  //       return (
  //         <form
  //           {...props}
  //           ref={ref}
  //           onSubmit={(e) => {
  //             e.preventDefault();
  //             const formValues = new FormData(e.target as HTMLFormElement);
  //             const data = new FormData();
  //             dirtyFields.forEach((field) => {
  //               const schemaProperties =
  //                 schema.properties[field as keyof typeof schema.properties];
  //               const isFieldArrayOfFiles =
  //                 schemaProperties?.type === "array" &&
  //                 isFileUploadFormat(schemaProperties.format ?? "");

  //               if (isFieldArrayOfFiles) {
  //                 const files = formValues
  //                   .getAll(field)
  //                   .filter(
  //                     (file) =>
  //                       typeof file === "string" ||
  //                       (file instanceof File && !!file.name)
  //                   );
  //                 const values = formData[
  //                   field as keyof typeof formData
  //                 ] as string[];

  //                 values.forEach((val) => {
  //                   data.append(field, val);
  //                 });

  //                 files.forEach((file) => {
  //                   data.append(field, file);
  //                 });
  //                 return;
  //               }

  //               data.append(field, formValues.get(field) as string);
  //             });

  //             // @ts-expect-error
  //             const submitter = e.nativeEvent.submitter as HTMLButtonElement;
  //             data.append(submitter.name, submitter.value);
  //             onSubmit(data);
  //           }}
  //         />
  //       );
  //     }),
  //   [onSubmit, schema]
  // );

  const headerProps = { title, slug, icon, actions, resource, data, schema };

  const form = createForm({ data, schema });

  return (
    <ClientActionDialogProvider>
      <FormHeader {...headerProps} />
      <div className="relative h-full">
        <div className="bg-nextadmin-background-default dark:bg-dark-nextadmin-background-default max-w-full p-4 align-middle sm:p-8">
          <Message className="-mt-2 mb-2 sm:-mt-4 sm:mb-4" />
          <FormProvider form={form}>
            <FormDisplay />
          </FormProvider>
        </div>
      </div>
    </ClientActionDialogProvider>
  );
};

export default Form;