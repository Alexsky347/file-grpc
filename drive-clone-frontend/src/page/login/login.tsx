import { FormEvent, JSX, useEffect } from 'react';
import { Avatar } from '@radix-ui/themes';
import driveJpg from '../../assets/static/drive.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from '../../store/slices/message.ts';
import { AppDispatch } from '../../store/store.ts';
import { login } from '../../store/slices/auth.ts';
import { useNavigate } from 'react-router-dom';

function Login(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: { auth: never }) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  async function loginUser(data: FormData) {
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    console.log(username, password);
    await dispatch(login({ username, password }));
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (event?.currentTarget instanceof HTMLFormElement) {
      const data = new FormData();
      const { username, password } = event.currentTarget;
      data.append('username', username.value);
      data.append('password', password.value);
      await loginUser(data);
    }
  };

  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content flex-col lg:flex-row-reverse'>
        <div className='text-center lg:text-left'>
          <h1 className='text-5xl font-bold'>My Clone</h1>
          <Avatar size='7' radius='full' fallback='T' color='indigo' src={driveJpg} />
        </div>
        <div className='card shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
          <form className='card-body' onSubmit={handleSubmit}>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Username</span>
              </label>
              <input
                id='username'
                name='username'
                placeholder='Username'
                type='text'
                className='input input-bordered'
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                id='password'
                name='password'
                placeholder='Password'
                type='password'
                className='input input-bordered'
                required
              />
            </div>
            <div className='form-control mt-6'>
              <button className='btn btn-primary'>Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
