interface Option {
  name: string;
  type?: string;
  description: string | React.ReactNode;
  defaultValue?: string;
}

interface HeadersLabel {
  name: string;
  type: string;
  description: string;
  defaultValue: string;
}

interface OptionsTableProps {
  options: Option[];
  labels?: HeadersLabel;
}

export function OptionsTable({ options, labels }: OptionsTableProps) {
  const hasTypeColumn = options.some((option) => Boolean(option.type));
  const hasDefaultValueColumn = options.some((option) =>
    Boolean(option.defaultValue)
  );

  return (
    <div className="-mx-6 mb-4 mt-6 overflow-x-auto overscroll-x-contain px-6 pb-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b py-4 text-left dark:border-neutral-700">
            <th className="py-2 font-semibold">{labels?.name || "Name"}</th>
            {hasTypeColumn && (
              <th className="py-2 pl-6 font-semibold">
                {labels?.type || "Type"}
              </th>
            )}
            <th className="px-6 py-2 font-semibold">
              {labels?.description || "Description"}
            </th>
            {hasDefaultValueColumn && (
              <th className="px-6 py-2 font-semibold">
                {labels?.defaultValue || "Default Value"}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="align-baseline text-gray-900 dark:text-gray-100">
          {options.map(({ name, type, description, defaultValue }) => (
            <tr
              key={name}
              className="border-b border-gray-100 dark:border-neutral-700/50"
            >
              <td className="whitespace-pre py-2 font-mono text-xs font-semibold leading-6 text-violet-600 dark:text-violet-500">
                {name}
              </td>
              {hasTypeColumn && (
                <td className="whitespace-pre py-2 pl-6 font-mono text-xs font-semibold leading-6 text-slate-500 dark:text-slate-400">
                  {Boolean(type) ? type : "-"}
                </td>
              )}
              <td className="py-2 pl-6">{description}</td>
              {hasDefaultValueColumn && (
                <td className="py-2 pl-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {Boolean(defaultValue) ? defaultValue : "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OptionsTable;
