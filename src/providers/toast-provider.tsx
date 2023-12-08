import { ToastContainer, toast as Toaster } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProviderProps } from '../types/obj-types';
import { ReactElement } from 'react';

const ToasterProvider = ({ children }: ProviderProps): ReactElement => {
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {children}
    </>
  );
};

export { ToasterProvider, Toaster };
