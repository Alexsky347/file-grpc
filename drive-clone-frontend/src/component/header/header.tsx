import { AuthService } from '../../service/api/auth.service.ts'
import { logout } from '../../store/slices/auth.ts'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store/store.ts'

interface HeaderProperties {
  handleSideNav: () => void
}

export default function Header({ handleSideNav }: HeaderProperties) {
  const userName = AuthService.getCurrentUser()?.username ?? ''
  const dispatch = useDispatch<AppDispatch>()

  const handleSideNavChildren = () => {
    handleSideNav()
  }

  const handleLogout = (): void => {
    dispatch(logout())
  }

  return (
    <div className='navbar bg-base-100 w-full border-b-2 fixed top-0 z-20'>
      <div className='flex-none ml-6'>
        <button className='btn btn-square btn-ghost' onClick={handleSideNavChildren}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h7'
            />
          </svg>
        </button>
      </div>
      <div className='flex-auto'>
        <a className='btn btn-ghost text-xl'>My Drive</a>
      </div>
      <div className='flex-none mr-6'>
        <div className='dropdown dropdown-end'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
            <div className='w-10 rounded-full'>
              <img
                alt='Tailwind CSS Navbar component'
                src='https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <a className='justify-between'>
                Profile
                <span className='badge'>{userName}</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
