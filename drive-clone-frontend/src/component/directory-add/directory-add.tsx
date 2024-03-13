import directoryAddIcon from '../../assets/static/directory-add.svg';

interface DirectoryAddProperties {
  sideNavOpen: boolean;
  addDirectory: () => void;
}

export default function DirectoryAdd({
  sideNavOpen,
  addDirectory,
}: Readonly<DirectoryAddProperties>) {
  return (
    <button onClick={addDirectory} className='mt-4 flex flex-row rounded hover:bg-base-300'>
      <img src={directoryAddIcon} className='w-8 h-10 text-base-content' alt='Create directory' />
      {sideNavOpen && <span className='text-base-content'>Create directory</span>}
    </button>
  );
}
