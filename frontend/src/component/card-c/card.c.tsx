import { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { deleteFile, renameFile, zipFile } from '../../store/slices/file';
import { MyFile } from '../../model/interface/file';
import { format } from 'date-fns';
import { ArchiveIcon, DownloadIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

interface MainProps {
    metaData: MyFile;
}


export function CardC({metaData}: MainProps): ReactElement {
    const [newFileName, setNewFileName] = useState<string | undefined>('');
    const {message} = useSelector((state: { message: any }) => state.message);
    const {hasDeleted, hasRenamed} = useSelector(
        (state: { file: any }) => state.file
    );

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setNewFileName(metaData?.name);
    }, [message, hasDeleted, hasRenamed, metaData?.name]);


    // Delete
    const handleDelete = async () => {
        await dispatch(deleteFile(metaData));
    };

    const handleDownload = () => {
        if (metaData?.name && metaData?.url) {
            const anchor = document.createElement('a');
            const contentType = metaData?.contentType;
            anchor.href = `data:${contentType};base64,${metaData?.url}`;
            anchor.type = contentType;
            anchor.download = metaData.name;
            anchor.click();
        } else {
            console.warn('No file founded !');
        }
    };

    // Rename
    const handleRename = async () => {
        const newFileNamed = handleFileName(newFileName || '');
        const response: any = await dispatch(
            renameFile({metaData, newFileName: newFileNamed})
        );
    };

    const handleZip = async () => {
        await dispatch(zipFile({name: metaData.name}));
    };

    const handleFileName = (fileName: string | undefined) => {
        if (fileName) {
            return fileName.replaceAll('%20', ' ');
        }
        return '';
    };

    return (
        <div className="card w-96 bg-base-100 m-6 shadow-xl">
            <figure>
                <img
                    className="object-contain w-full h-48"
                    src={
                        metaData?.url && metaData?.contentType.includes('image')
                            ? `data:${metaData.contentType};base64,${metaData?.url}`
                            : '/static/no-picture.jpg'}
                    alt="Picture"/>
            </figure>
            <div className="card-body">
                <h2 className="card-title">{format(new Date(metaData?.createdDate), 'yyyy-MM-dd')}</h2>
                <p>{(metaData?.size / 100).toFixed(2)} bytes</p>
                <div className="card-actions justify-end">

                    <button
                        onClick={handleZip}
                        className="btn btn-success">
                        <ArchiveIcon/>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="btn btn-success">
                        <DownloadIcon/>
                    </button>
                    <button
                        onClick={handleRename}
                        className="btn btn-warning">
                        <Pencil1Icon/>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="btn btn-error">
                        <TrashIcon/>
                    </button>
                </div>
            </div>
        </div>
    );
}
