//NotificationManager.js

import { toast } from 'react-toastify';

const NotificationManager = {
  showNotification: (message, options = {}) => {
    toast(message, { position: "bottom-center", ...options });
  },

  showSuccessNotification: (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { fontSize: '20px', padding: '20px' },
    });
  },

  
};

export default NotificationManager;
