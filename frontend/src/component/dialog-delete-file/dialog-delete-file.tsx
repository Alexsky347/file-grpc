import {
  Button,
  Flex,
  AlertDialog,
} from "@radix-ui/themes";
import {  TrashIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { deleteFile } from "../../store/slices/file.ts";
import { MyFile } from "../../model/interface/file.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";

interface DialogDeleteFileProperties {
  metaData: MyFile;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export default function DialogDeleteFile({
  metaData,
  setReRender,
}: Readonly<DialogDeleteFileProperties>) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading((previousState) => !previousState);
    const response: any = await dispatch(deleteFile(metaData));
    if (!response?.error) {
      setReRender((previous) => !previous);
    }
    setIsLoading((previousState) => !previousState);
  };
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <button className="btn btn-error">
              <TrashIcon />
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Content style={{ maxWidth: 450 }}>
            <AlertDialog.Title>Delete Item</AlertDialog.Title>
            <AlertDialog.Description size="2">
              Are you sure? This picture will no longer be accessible.
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button variant="solid" color="red" onClick={handleDelete}>
                  Delete
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )}
    </>
  );
}
