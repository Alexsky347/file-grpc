import { Dialog, Flex } from "@radix-ui/themes";
import { FileIcon, FilePlusIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { ItResponse } from "../../model/interface/it-response.ts";
import { FileService } from "../../service/api/file.service.ts";
import { toast } from "react-toastify";

interface DialogAddFileProperties {
  sideNavOpen: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export default function DialogAddFile({
  sideNavOpen,
  setReRender,
}: Readonly<DialogAddFileProperties>) {
  const [metaData, setMetaData] = useState<Record<string, any>>([]);
  const [files, setFiles] = useState<FileList | null>();
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleUpload = async () => {
    let response: ItResponse | undefined;
    const data = new FormData();
    if (!files) {
      toast.error("Please choose file(s) to upload");
      return;
    }
    switch (files?.length) {
      case 0: {
        toast.error("Please choose file(s) to upload");
        break;
      }
      case undefined: {
        toast.error("Please choose file(s) to upload");
        break;
      }
      case 1: {
        setIsLoading((previousState) => !previousState);
        data.append("file", files[0]);
        response = (await FileService.uploadOneFile(
          data
        )) as unknown as ItResponse;
        break;
      }
      default: {
        setIsLoading((previousState) => !previousState);
        for (const element of files) {
          data.append("file", element);
        }
        response = (await FileService.uploadMultipleFiles(
          data
        )) as unknown as ItResponse;
      }
    }

    if (response?.status === 200) {
      // reRender ? setReRender(0) : setReRender(1);
      setFiles(undefined);
      setMetaData([]);
      setIsFileUploaded(false);
      setReRender((previous) => !previous);
      setIsLoading((previousState) => !previousState);
    } else {
      toast.error(
        `${response?.response?.data?.errorMessage || "Error uploading file(s)"}`
      );
    }
    // e.target?.value = "";
    handleClose();
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      {sideNavOpen ? (
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <button className="flex flex-row mb-3 mt-3 rounded hover:bg-base-300">
              <FileIcon
                className="w-8 h-8 text-base-content"
                fill="currentColor"
                aria-label={"Add file(s)"}
              />
              {sideNavOpen && (
                <span className="text-base-content ml-4">Add file(s)</span>
              )}
            </button>
          </Dialog.Trigger>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Add one or multiple file(s)</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              It will be import.
            </Dialog.Description>

            <Flex direction="column" gap="3">
              <form>
                <div className="form-control">
                  <input
                    type="file"
                    multiple
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    onChange={(e) => {
                      setMetaData({
                        fileName: e.target.files?.[0].name,
                        createDate: new Date(
                          e.target.files![0].lastModified
                        ).toDateString(),
                        lastModified: new Date(
                          e.target.files![0].lastModified
                        ).toDateString(),
                        fileSize: (
                          Math.round(
                            e.target.files![0].size * Math.pow(10, -6) * 100
                          ) / 100
                        ).toFixed(3),
                        type: e.target.files![0].type,
                      });

                      setFiles(e.target.files);
                      setIsFileUploaded(true);
                    }}
                  />
                </div>
              </form>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <button className="btn">Cancel</button>
              </Dialog.Close>
              <Dialog.Close>
                <button className="btn btn-primary" onClick={handleUpload}>
                  Save
                </button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      ) : undefined}
    </>
  );
}
