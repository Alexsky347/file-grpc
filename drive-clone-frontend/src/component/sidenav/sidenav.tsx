import DialogAddFile from '../dialog-add-file/dialog-add-file.tsx';
import { Dispatch, SetStateAction } from 'react';
import { isMobile } from 'react-device-detect';
import DirectoryAdd from '../directory-add/directory-add.tsx';

interface SideNavProperties {
  sideNavOpen: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
  addDirectory: () => void;
}

export default function SideNav({
  sideNavOpen,
  setReRender,
  addDirectory,
}: Readonly<SideNavProperties>) {
  const screenMinWidth = isMobile ? 0 : 80;
  const widthNav = sideNavOpen ? 200 : screenMinWidth;

  return (
    <div
      className={`fixed h-screen bg-base-100 border-r-2 z-20 p-7 shadow-xl ${widthNav === 0 ? 'hidden' : ''}`}
      style={{ width: `${widthNav}px`, top: '4.2rem' }}
    >
      <div className='flex flex-col items-center'>
        <div className='flex flex-col items-center'>
          <div className='flex flex-col'>
            <DialogAddFile setReRender={setReRender} sideNavOpen={sideNavOpen} />
            <DirectoryAdd sideNavOpen={sideNavOpen} addDirectory={addDirectory} />
          </div>
        </div>
      </div>
    </div>
  );
}
