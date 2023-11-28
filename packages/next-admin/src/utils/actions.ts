import { ActionParams } from "../types";

export const createBoundServerAction = (
  { params, schema }: ActionParams,
  action: (params: ActionParams, formData: FormData) => Promise<any>
) => {
  return action.bind(null, {
    params,
    schema,
  });
};
