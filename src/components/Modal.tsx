import ReactDom from "react-dom";
import { useEffect } from "react";
import { ModalInterface } from "../types/obj-types";
import AOS from "aos";
import "aos/dist/aos.css";
import Close from "../icons/Close";

export default function Modal({
  children,
  show,
  headerText,
  setShow,
}: ModalInterface) {
  const handleClickOutside = (e: any) => {
    if (e.target.id === "modal") setShow(false);
  };
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
      id="modal"
      onClick={handleClickOutside}
      data-aos="zoom-in"
      className="fixed top-0 bottom-0 left-0 right-0 z-20 bg-black/50 overflow-auto backdrop-filter "
    >
      <div className="flex flex-col bg-[rgba(32,33,35,1)] w-[80%] max-w-[680px] m-auto relative top-50 left-50 z-21 transform translate-x-50 translate-y-[35vh] p-2 shadow-2xl rounded">
        <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 border-white/10">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-gray-200">
            {headerText}
          </h3>
          <button
            onClick={() => setShow(false)}
            className="ml-auto text-gray-500 transition hover:text-gray-700 text-gray-400 hover:text-gray-200"
          >
            <Close />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.getElementById("portal") as HTMLElement
  );
}
