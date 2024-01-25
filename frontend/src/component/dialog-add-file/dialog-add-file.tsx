import { Button, Dialog, Flex, TextField, Text } from '@radix-ui/themes';
import { PlusIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { ItResponse } from "../../model/interface/it-response.ts";
import { FileService } from "../../service/api/file.service.ts";
import { toast } from "react-toastify";

interface DialogAddFileProps {
    sideNavOpen: boolean;
    reRender: boolean;
    setReRender: Dispatch<SetStateAction<boolean>>;
}

export default function DialogAddFile({sideNavOpen, reRender, setReRender}: Readonly<DialogAddFileProps>) {
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
            case 0:
                toast.error("Please choose file(s) to upload");
                break;
            case  null:
                toast.error("Please choose file(s) to upload");
                break;
            case 1:
                setIsLoading(prevState => !prevState);
                data.append('file', files[0]);
                response = (await FileService.uploadOneFile(
                    data
                )) as unknown as ItResponse;
                break;
            default:
                setIsLoading(prevState => !prevState);
                Array.from(files).forEach((element) => {
                    data.append('file', element);
                });
                response = (await FileService.uploadMultipleFiles(
                    data
                )) as unknown as ItResponse;


        }

        if (response?.status === 200) {
            // reRender ? setReRender(0) : setReRender(1);
            setFiles(null);
            setMetaData([]);
            setIsFileUploaded(false);
            setReRender(prev => !prev);
            setIsLoading(prevState => !prevState);
        } else {
            toast.error(`${response?.response?.data?.errorMessage || 'Error uploading file(s)'}`);
        }
        // e.target?.value = "";
        handleClose();
    };
    const handleClose = () => setOpen(false);

    return (
        <>
        {isLoading ? (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        ) : <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <button className="flex flex-row items-center mb-3 mt-3 rounded hover:bg-base-300">
                    <PlusIcon className="w-10 h-10 text-base-content" fill="currentColor"
                              aria-label={"Add file(s)"}/>
                    {sideNavOpen && <span className="text-base-content">Add file(s)</span>}
                </button>
            </Dialog.Trigger>
            <Dialog.Content style={{maxWidth: 450}}>
                <Dialog.Title>Add one or multiple file(s)</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    It will be import.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <form>
                        <div className="form-control">
                            <input type="file"
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
                                   }}/>
                        </div>
                    </form>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <button className="btn">Cancel</button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <button
                            className="btn btn-primary"
                            onClick={handleUpload}>
                            Save
                        </button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>}</>

    );
}
