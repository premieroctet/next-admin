import { ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { MouseEvent, useMemo, useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useI18n } from "../../context/I18nContext";
import { ModelName, Schema } from "../../types";
import {
  contentTypeFromSchemaType,
  isFieldNullable,
  isSchemaPropertyScalarArray,
  UIQueryBlock,
} from "../../utils/advancedSearch";
import { DropdownItem } from "../radix/Dropdown";

type Props = {
  property: string;
  schema: Schema;
  resource: ModelName;
  path?: string;
  displayPath?: string;
  onAddBlock: (block: UIQueryBlock) => void;
};

const AdvancedSearchDropdownItem = ({
  property,
  schema,
  resource,
  path,
  onAddBlock,
  displayPath,
}: Props) => {
  const { options } = useConfig();
  const { t } = useI18n();
  const schemaDef = schema.definitions[resource];
  const schemaProperty =
    schemaDef.properties[property as keyof typeof schemaDef.properties];
  const hasChildren = isSchemaPropertyScalarArray(schemaDef, property)
    ? false
    : schemaProperty?.$ref ||
      // @ts-expect-error
      schemaProperty?.anyOf?.[0]?.$ref ||
      schemaProperty?.type === "array";
  const [openChildren, setOpenChildren] = useState(false);

  const childResource = useMemo(() => {
    if (!hasChildren) {
      return null;
    }

    const modelRef =
      schemaProperty?.type === "array"
        ? schemaProperty?.items?.$ref
        : // @ts-expect-error
          (schemaProperty?.anyOf?.[0]?.$ref ?? schemaProperty?.$ref);

    const model = modelRef?.split("/")?.at(-1);

    const schemaModel = schema.definitions[model as ModelName];

    if (!schemaModel) {
      return null;
    }

    return {
      model: model as ModelName,
      properties: Object.keys(schemaModel.properties),
    };
  }, [hasChildren, schemaProperty, schema]);

  const aliases = options?.model?.[resource]?.aliases;
  const displayedProperty = t(
    `model.${resource}.fields.${property}`,
    {},
    aliases?.[property as keyof typeof aliases] ?? property
  );

  const onClick = (evt: MouseEvent<HTMLDivElement>) => {
    if (hasChildren) {
      evt.preventDefault();
      setOpenChildren((prev) => !prev);
    } else {
      onAddBlock({
        type: "filter",
        path: [path, property].filter(Boolean).join("."),
        value: "",
        contentType: contentTypeFromSchemaType(schemaProperty as Schema),
        enum: (schemaProperty?.enum?.filter(Boolean) ?? []) as string[],
        defaultValue: schemaProperty?.default as
          | string
          | number
          | boolean
          | null,
        canHaveChildren: false,
        condition: "equals",
        id: crypto.randomUUID(),
        nullable: isFieldNullable(schemaProperty!.type),
        displayPath: [displayPath, displayedProperty]
          .filter(Boolean)
          .join(" → "),
      });
    }
  };

  return (
    <>
      <DropdownItem className="cursor-pointer rounded-md p-2" onClick={onClick}>
        <div className="flex items-center justify-between">
          {displayedProperty}
          {hasChildren && (
            <ChevronRightIcon
              className={clsx("h-5 w-5 transition-all", {
                "rotate-90 transform": openChildren,
              })}
              aria-hidden="true"
              onClick={(e) => {
                e.stopPropagation();
                setOpenChildren((prev) => !prev);
              }}
            />
          )}
        </div>
      </DropdownItem>
      {childResource && openChildren && (
        <div className="border-l-nextadmin-border-strong dark:border-l-dark-nextadmin-border-strong ml-2 border-l pl-2">
          {childResource.properties.map((childProperty) => {
            return (
              <AdvancedSearchDropdownItem
                key={childProperty}
                property={childProperty}
                schema={schema}
                resource={childResource.model}
                path={[path, property].filter(Boolean).join(".")}
                displayPath={[displayPath, displayedProperty]
                  .filter(Boolean)
                  .join(" → ")}
                onAddBlock={onAddBlock}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default AdvancedSearchDropdownItem;
