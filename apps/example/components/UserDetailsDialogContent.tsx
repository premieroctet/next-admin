"use client";
import { ClientActionDialogContentProps } from "@premieroctet/next-admin";
import { Button } from "@premieroctet/next-admin/components";

type Props = ClientActionDialogContentProps<"User">;

const UserDetailsDialog = ({ data, onClose }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-nextadmin-content-default dark:text-dark-nextadmin-content-default text-2xl font-semibold">
          {data?.email.value as string}
        </h2>
        <p className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle">
          {data?.name.value as string}
        </p>
        <p className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle">
          {data?.role.value as string}
        </p>
      </div>
      <div className="flex">
        <Button variant="default" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserDetailsDialog;
