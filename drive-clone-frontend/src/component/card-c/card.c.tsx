import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { renameFile, zipFile } from '../../store/slices/file';
import { FileState, MyFile } from '../../model/interface/file';
import { format } from 'date-fns';
import { ArchiveIcon, DownloadIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { displayToast } from '../../utils/toast/toast-service.ts';
import DialogDeleteFile from '../dialog-delete-file/dialog-delete-file.tsx';
import { MessageState } from '../../model/interface/message-state.ts';

interface MainProperties {
  metaData: MyFile;
  reRender: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export function CardC({ metaData, reRender, setReRender }: MainProperties): ReactElement {
  const [newFileName, setNewFileName] = useState<string | undefined>('');
  const { message } = useSelector((state: { message: MessageState }) => state.message);
  const { hasDeleted, hasRenamed } = useSelector((state: { file: FileState }) => state.file);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log(metaData);
    setNewFileName(metaData?.name);
  }, [message, hasDeleted, hasRenamed, metaData]);

  const handleDownload = () => {
    if (metaData?.name && metaData?.data) {
      const anchor = document.createElement('a');
      const contentType = metaData?.contentType;
      anchor.href = `data:${contentType};base64,${metaData?.data}`;
      anchor.type = contentType;
      anchor.download = metaData.name;
      anchor.click();
    } else {
      displayToast({ message: 'No file founded !', level: 'warning' });
    }
  };

  // Rename
  const handleRename = async () => {
    const newFileNamed = handleFileName(newFileName || '');
    await dispatch(renameFile({ metaData, newFileName: newFileNamed }));
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
          src={`data:${metaData.contentType};base64,${metaData?.data}`}
          alt='Picture'
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
          <button onClick={handleRename} className='btn btn-warning'>
            <Pencil1Icon />
          </button>
          <DialogDeleteFile metaData={metaData} setReRender={setReRender} />
        </div>
      </div>
    </div>
  );
}
