import { ReactElement, useState, useEffect } from 'react';
import ConversationListView from './ConversationListView';
import { useClient, useSetClient } from '../hooks/useClient';
import { shortAddress } from '../util/shortAddress';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useDisconnect } from 'wagmi';
import { logoutEnc } from '../util/enc-dec-user';
import { Toaster } from '../providers/toast-provider';
import LogoutIcon from '../icons/logout-svg-icon';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { chat_features } from '../mock-data/chat-features';
import CopyIcon from '../icons/copy-svg-icon';
import NewConversationView from './NewConversationView';
import Modal from '../components/Modal';

export default function HomeView(): ReactElement {
  const client = useClient() as any;
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const loc_name = import.meta.env.VITE_APP_LOCNAME;

  function copy() {
    navigator.clipboard.writeText(client.address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const { disconnectAsync } = useDisconnect();
  const setClient = useSetClient();
  async function logout() {
    try {
      await disconnectAsync();
      indexedDB.deleteDatabase('DB');
      window.location.reload();
      // localStorage.removeItem("_insecurePrivateKey");
      logoutEnc(loc_name);

      const instanceOfSetTimeOut = setTimeout(() => {
        setClient(null);
      }, 1000);

      clearTimeout(instanceOfSetTimeOut);
    } catch (error: any) {
      Toaster.error(error.message);
    }
  }
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    // bg-[rgb(#,#,#)]/{opacity}.
    <div className='p-4 pt-14 h-screen  m-auto'>
      <Header>
        <div className='flex justify-between w-200 h-100 p-4'>
          <div className='text-black flex'>
            <p className='pr-1 text-cyan-500'>
              <span className='text-black pr-1'>Hi,</span>
              {shortAddress(client.address)}
            </p>
            <button className='text-x flex tracking-wide' onClick={copy}>
              <span className='px-1'>
                {copied ? 'Copied Address!' : 'Copy Address'}
              </span>
              <span>
                <CopyIcon />
              </span>
            </button>
          </div>
          <div>
            <button className='text-black flex' onClick={logout}>
              <span> Logout</span>
              <span>
                <LogoutIcon />{' '}
              </span>
            </button>
          </div>
        </div>
      </Header>
      <div>
        <small className='flex justify-between text-black'>
          <span className='text-black text-lg md:text-xl mb-2 '>
            Conversations will appear here
          </span>
          <span>
            <Modal show={show} setShow={setShow}>
              <div className='w-full'>
                <NewConversationView setShow={setShow} show={show} />
              </div>
            </Modal>
          </span>
          <span
            onClick={() => setShow(true)}
            className='text-blue-500 w-fit border-2 py-2 px-4 text-center items-center rounded-md border-blue-400 tracking-wide cursor-pointer'
          >
            Start a new conversation
          </span>
        </small>
      </div>
      <div className='flex py-4 justify-between gap-5 flex-col lg:flex-row'>
        <div className='lg:w-1/3 w-full'>
          <ConversationListView />
        </div>
        <div className='w-full'>
          <div>
            <h1 className='text-center text-4xl mt-5 lg:mt-0 md:text-6xl font-bold tracking-wide'>
              Chat Features
            </h1>
            <p className='text-center text-xm md:text-xl tracking-wide text-gray-500'>
              The web-3 secured chat application for business optimization
            </p>
          </div>
          <div className='flex gap-5 flex-wrap my-10'>
            {chat_features.map((data) => {
              return (
                <div
                  key={data.header}
                  data-aos='fade-up'
                  className='mb-5 text-center flex flex-col justify-center content-center items-center gap-2 w-full md:w-[30%]'
                >
                  {data.icon}
                  <h1 className='text-center text-xl md:text-xl font-bold tracking-wide'>
                    {data.header}
                  </h1>
                  <p className='text-center text-sm md:text-md text-gray-400'>
                    {data.paragraph}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
