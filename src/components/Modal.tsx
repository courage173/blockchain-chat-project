import ReactDom from 'react-dom';
import { useEffect } from 'react';
import { ModalInterface } from '../types/obj-types';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Modal({ children, show }: ModalInterface) {
  useEffect(() => {
    AOS.init();
  }, []);
  if (show === false) return <></>;
  //   <Box
  //         sx={{
  //           position: 'fixed',
  //           top: 0,
  //           bottom: 0,
  //           left: 0,
  //           right: 0,
  //           zIndex: 20,
  //           background: 'rgba(255, 255, 255, 0.1)',
  //           backdropFilter: 'blur(5px)',
  //           overflow: 'auto',
  //         }}
  //       >
  //         <Paper
  //           sx={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             width: '80%',
  //             margin: 'auto',
  //             position: 'fixed',
  //             top: '50%',
  //             left: '50%',
  //             zIndex: 21,
  //             transform: 'translate(-50%, -50%)',
  //             // my: 2,
  //             p: 2,
  //             boxShadow: ' 15px 15px 50px  rgb(200, 123, 12)',
  //           }}
  //         ></Paper>
  return ReactDom.createPortal(
    <div
      data-aos='zoom-in-up'
      className='fixed top-0 bottom-0 left-0 right-0 z-20 bg-black/10 overflow-auto backdrop-filter backdrop-blur-sm'
    >
      <div className='flex flex-col bg-white w-[80%] m-auto relative top-50 left-50 z-21 transform translate-x-50 translate-y-[35vh] p-2 shadow-2xl'>
        {children}
      </div>
    </div>,
    document.getElementById('portal') as HTMLElement
  );
}
