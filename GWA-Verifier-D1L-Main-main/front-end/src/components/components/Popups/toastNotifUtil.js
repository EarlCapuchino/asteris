import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifyError = (notif) => {
    toast.error(notif, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: true,
    });
}

export const notifySuccess = (notif) => {
    toast.success(notif, { 
        position: toast.POSITION.TOP_RIGHT,
        autoClose: true,
     });

}

export const notifyDelete = (notif) => {
    toast.success(notif, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: true, 
        onClose:()=>(window.location.href='/students'),
    });
}