import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { deleteFile, renameFile, zipFile } from '../../store/slices/file';
import { FileState, MyFile } from '../../model/interface/file';
import { format } from 'date-fns';
import { ArchiveIcon, DownloadIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { displayToast } from '../../utils/toast/toast-service.ts';
import { MessageState } from '../../model/interface/message-state.ts';
import DialogActionFile from '../dialog-action-file copy/dialog-action-file.tsx';

interface MainProperties {
  metaData: MyFile;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export function CardC({ metaData, setReRender }: MainProperties): ReactElement {
  const [newFileName, setNewFileName] = useState<string | undefined>('');
  const { message } = useSelector((state: { message: MessageState }) => state.message);
  const { hasDeleted, hasRenamed } = useSelector((state: { file: FileState }) => state.file);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setNewFileName(metaData?.name);
  }, [message, hasDeleted, hasRenamed, metaData]);

  const handleDownload = () => {
    if (metaData?.name && metaData?.url) {
      const anchor = document.createElement('a');
      const contentType = metaData?.contentType;
      anchor.href = `data:${contentType};base64,${metaData?.url}`;
      anchor.type = contentType;
      anchor.download = metaData.name;
      anchor.click();
    } else {
      displayToast({ message: 'No file founded !', level: 'warning' });
    }
  };

  const handleRename = async () => {
    const newFileNamed = handleFileName(newFileName ?? '');
    const response: any = await dispatch(renameFile({ metaData, newFileName: newFileNamed }));
    if (!response?.error) {
      setReRender((previous: boolean) => !previous);
    }
  };

  const handleDelete = async () => {
    const response: any = await dispatch(deleteFile(metaData));
    if (!response?.error) {
      setReRender((previous: boolean) => !previous);
    }
  };

  const handleZip = async () => {
    await dispatch(zipFile({ name: metaData.name }));
  };

  const handleFileName = (fileName: string | undefined) => {
    if (fileName) {
      return fileName.replaceAll('%20', ' ');
    }
    return '';
  };

  return (
    <div className='card w-90 bg-base-100 m-6 shadow-xl'>
      <figure>
        <img
          loading='lazy'
          className='object-contain w-full h-48'
          src={
            metaData?.url && metaData?.contentType.includes('image')
              ? `data:${metaData.contentType};base64,${metaData?.url}`
              : '/static/no-picture.jpg'
          }
          alt={metaData?.name}
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title truncate'>{metaData?.name}</h2>
        <div className='card-body space-x-4 inline-block'>
          <span>{format(new Date(metaData?.createdDate), 'yyyy-MM-dd')}</span>
          <span>{(metaData?.size / 100).toFixed(2)} bytes</span>
        </div>
        <div className='card-actions justify-end'>
          <button onClick={handleZip} className='btn btn-success'>
            <ArchiveIcon />
          </button>
          <button onClick={handleDownload} className='btn btn-success'>
            <DownloadIcon />
          </button>
          <DialogActionFile
            title={'Rename Item'}
            IconComponent={Pencil1Icon}
            actionColor={'amber'}
            actionLabel={'Rename'}
            callBackFn={handleRename}
            dataToEdit={metaData?.name}
            setterCallBackFn={setNewFileName}
          />
          <DialogActionFile
            title={'Delete Item'}
            description={'Are you sure? This picture will no longer be accessible.'}
            IconComponent={TrashIcon}
            actionColor={'red'}
            actionLabel={'Delete'}
            callBackFn={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
