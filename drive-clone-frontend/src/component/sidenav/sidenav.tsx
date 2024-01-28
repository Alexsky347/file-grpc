import DialogAddFile from '../dialog-add-file/dialog-add-file.tsx';
import { Dispatch, SetStateAction } from 'react';
import directoryAddIcon from '../../assets/static/directory-add.svg';
import { isMobile } from 'react-device-detect';

interface SideNavProperties {
  sideNavOpen: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export default function SideNav({ sideNavOpen, setReRender }: Readonly<SideNavProperties>) {
  const screenMinWidth = isMobile ? 0 : 80;
  const widthNav = sideNavOpen ? 200 : screenMinWidth;

  return (
    <div
      className={`fixed h-screen bg-gray-100 border-r-2 z-20 p-7 ${widthNav === 0 ? 'hidden' : ''}`}
      style={{ width: `${widthNav}px`, top: '4.2rem' }}
    >
      <div className='flex flex-col items-center'>
        <div className='flex flex-col items-center'>
          <div className='flex flex-col'>
            <DialogAddFile setReRender={setReRender} sideNavOpen={sideNavOpen} />
            <button className='mt-4 flex flex-row rounded hover:bg-base-300'>
              <img
                src={directoryAddIcon}
                className='w-10 h-10 text-base-content'
                alt='Create directory'
              />
              {sideNavOpen && <span className='text-base-content'>Create directory</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
