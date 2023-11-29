import { ActionParams } from "../types";

/**
 * Following https://nextjs.org/docs/app/api-reference/functions/server-actions#binding-arguments
 * We need the params and schema options to be there when the action is called.
 * Other params (prisma, options) will be added by the app's action implementation.
 */
export const createBoundServerAction = (
  { params, schema }: ActionParams,
  action: (params: ActionParams, formData: FormData) => Promise<any>
) => {
  return action.bind(null, {
    params,
    schema,
  });
};
