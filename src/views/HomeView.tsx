import { ReactElement, useState } from 'react';
import ConversationListView from './ConversationListView';
import { useClient, useSetClient } from '../hooks/useClient';
import { shortAddress } from '../util/shortAddress';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useDisconnect } from 'wagmi';
import { logoutEnc } from '../util/enc-dec-user';
import { Toaster } from '../providers/toast-provider';
import LogoutIcon from '../icons/logout-svg-icon';

export default function HomeView(): ReactElement {
  const client = useClient()!;
  const [copied, setCopied] = useState(false);
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

  return (
    <div className='p-4 pt-14 bg-black h-screen  m-auto'>
      <Header>
        <div className='flex justify-between bg-black w-200 h-100 p-4'>
          <div className='text-white'>
            Hi {shortAddress(client.address)}{' '}
            <button className='text-xs text-white' onClick={copy}>
              {copied ? 'Copied Address!' : 'Copy Address'}
            </button>
          </div>
          <div>
            <button className='text-white flex' onClick={logout}>
              <span> Logout</span>
              <span>
                <LogoutIcon />{' '}
              </span>
            </button>
          </div>
        </div>
      </Header>
      <small className='flex justify-between text-white'>
        <span className='text-white'>Here are your conversations:</span>
        <Link to='new' className='text-purple-300'>
          Make a new one
        </Link>
      </small>
      <div className='flex justify-center mx-auto items-center align-center py-4'>
        <ConversationListView />
      </div>
    </div>
  );
}
