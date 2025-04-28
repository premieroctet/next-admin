"use client";
import { ClientActionDialogContentProps } from "@premieroctet/next-admin";
import { BaseInput, Button } from "@premieroctet/next-admin/components";
import { useState } from "react";
import addTag from "../actions/addTag";

type Props = ClientActionDialogContentProps<"User">;

const AddTagDialog = ({ data, onClose }: Props) => {
  const [tag, setTag] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = () => {
    setIsPending(true);
    addTag(
      tag,
      data?.map((d) => d.id)
    )
      .then(() => {
        onClose?.({
          type: "success",
          message: "Tag added successfully",
        });
      })
      .catch((e) => {
        console.error(e);
        onClose?.({
          type: "error",
          message: "An error occured",
        });
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4">
        <div className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle text-lg font-semibold">
          Add a new tag
        </div>
        <BaseInput
          type="text"
          placeholder="Tag name"
          className="col-span-4 row-start-3 md:col-span-2"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </form>

      <div className="flex justify-between">
        <Button variant="primary" onClick={() => onClose?.()}>
          Close
        </Button>
        <Button variant="default" loading={isPending} onClick={handleSubmit}>
          Add Tag
        </Button>
      </div>
    </div>
  );
};

export default AddTagDialog;
