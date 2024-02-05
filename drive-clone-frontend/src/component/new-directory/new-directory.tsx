import { ChangeEvent, MouseEventHandler, useState } from 'react';
import newDirectory from '../../assets/static/new-directory.svg';
import { TrashIcon } from '@radix-ui/react-icons';

interface NewDirectoryProperties {
  isAddingDirectory: boolean;
}

export default function NewDirectory({ isAddingDirectory }: Readonly<NewDirectoryProperties>) {
  const [directoryName, setDirectoryName] = useState('New Directory');

  const handleSetName = (event: ChangeEvent<HTMLInputElement>) => {
    setDirectoryName(event.target.value);
  };

  const handleMouseEvent = () => {
    console.log('event', directoryName);
  };

  const handleDelete = () => {
    console.log('delete directory', directoryName);
  };

  return (
    <>
      {isAddingDirectory && (
        <div className='w-90 bg-base-100 m-6 flex flex-col cursor-pointer justify-center relative '>
          <TrashIcon
            onClick={handleDelete}
            aria-label='Delete directory'
            className='absolute top-5 right-14'
            style={{ width: '30px', height: '30px', color: 'red' }}
          />
          <img
            src={newDirectory}
            alt=''
            onDoubleClick={handleMouseEvent}
            className='w-4/6 p-6 m-auto'
          />
          <input
            onChange={handleSetName}
            className='input input-bordered max-w-xs m-auto text-center'
            type='text'
            name='new-directory'
            value={directoryName}
            id=''
            readOnly={false}
          />
        </div>
      )}
    </>
  );
}
