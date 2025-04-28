"use client";
import { ClientActionDialogContentProps } from "@premieroctet/next-admin";
import { Button } from "@premieroctet/next-admin/components";

type Props = ClientActionDialogContentProps<"User">;

const UserDetailsDialog = ({ data, onClose }: Props) => {
  return (
    <div className="flex flex-col gap-8">
      {data?.map((user) => (
        <div className="flex flex-col gap-2" key={user.id}>
          <div className="flex flex-col gap-2">
            <div className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle text-lg font-semibold">
              User Information
            </div>
            <div className="text-nextadmin-content-subtle/50 dark:text-dark-nextadmin-content-subtle/50 text-sm font-medium">
              Details about the current user.
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle font-medium">
                Name:
              </span>
              <span className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle col-span-3 font-medium">
                {user.name as string}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle font-medium">
                Email:
              </span>
              <span className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle col-span-3">
                {user.email as string}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle font-medium">
                Role:
              </span>
              <span className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle col-span-3">
                {user.role as string}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="flex">
        <Button variant="default" onClick={() => onClose?.()}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserDetailsDialog;
