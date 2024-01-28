import DialogAddFile from '../dialog-add-file/dialog-add-file.tsx'
import { Dispatch, SetStateAction } from 'react'
import directoryAddIcon from '../../assets/static/directory-add.svg'

interface SideNavProperties {
  sideNavOpen: boolean
  setReRender: Dispatch<SetStateAction<boolean>>
}

export default function SideNav({ sideNavOpen, setReRender }: Readonly<SideNavProperties>) {
  const widthNav = sideNavOpen ? 150 : 0

  return (
    <div
      className={`fixed left-5 h-screen top-20 bg-base-100 border-r-2 z-20 pr-5 ${
        widthNav === 0 ? 'hidden' : ''
      }`}
      style={{ width: `${widthNav}px` }}
    >
      <div className='flex flex-col items-center'>
        <div className='flex flex-col items-center'>
          <div className='flex flex-col'>
            <DialogAddFile setReRender={setReRender} sideNavOpen={sideNavOpen} />
            <button className='flex flex-row mb-3 mt-3 rounded hover:bg-base-300'>
              <img
                src={directoryAddIcon}
                className='w-8 h-8 text-base-content'
                alt='Create directory'
              />
              {sideNavOpen && <span className='text-base-content'>Create directory</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
