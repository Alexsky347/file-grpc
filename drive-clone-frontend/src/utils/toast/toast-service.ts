import { toast } from 'react-toastify';
import { ToastLevel } from '../../model/type/level';

function displayToast(
  msg: string,
  level: ToastLevel = 'success',
  duration = 300
) {
  setTimeout(() => {
    switch (level) {
      case 'error':
        toast.error(msg);
        break;
      case 'warning':
        toast.warning(msg);
        break;
      case 'info':
        toast.info(msg);
        break;
      default:
        toast.success(msg);
        break;
    }
  }, duration);
}

export { displayToast };
