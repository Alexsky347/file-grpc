import { toast } from 'react-toastify';
import { MessageState } from '../../model/interface/message-state';

function displayToast(opt: MessageState) {
  const { message, level } = opt;
  const durationInMs = 300;
  setTimeout(() => {
    switch (level) {
      case 'error': {
        toast.error(message);
        break;
      }
      case 'warning': {
        toast.warning(message);
        break;
      }
      case 'info': {
        toast.info(message);
        break;
      }
      default: {
        toast.success(message);
        break;
      }
    }
  }, durationInMs);
}

export { displayToast };
