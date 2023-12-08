import { ReactElement, useState } from 'react';
import { useSetClient } from '../hooks/useClient';
import { Wallet } from 'ethers';
import { Client } from '@xmtp/xmtp-js';
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import LoadingSVG from '../icons/Loading-svg-icon';
import { encryptData } from '../util/enc-dec-user';
import { Toaster } from '../providers/toast-provider';

export default function LoginView(): ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const setClient = useSetClient();

  async function generateWallet() {
    try {
      setIsLoading((prev) => !prev);
      const wallet = Wallet.createRandom();
      const client = await Client.create(wallet, {
        env: 'dev',
      });
      if (wallet && client) {
        // Don't do this in real life.
        const data = wallet.privateKey;
        const name = import.meta.env.VITE_APP_LOCNAME;

        encryptData(name, data);
        // localStorage.setItem('_insecurePrivateKey', wallet.privateKey);

        setClient(client);
        setIsLoading((prev) => !prev);
      }
    } catch (e: any) {
      setIsLoading((prev) => !prev);
      Toaster.error(e.message);
      console.error('error', e.message);
    }
  }

  return (
    // <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
    <div className='p-6 lg:w-100 mx-auto bg-black shadow-md flex items-center space-x-4 content-center h-screen'>
      {/* <div className='mx-auto max-w-3xl'></div> */}
      <div className='bg-black sm:rounded-lg m-auto lg:max-h-1000 shadow-md shadow-purple-500'>
        <div className='px-4 py-5 sm:p-6 text-center'>
          <h1 className='font-semibold mb-5 text-5xl md:text-7xl text-purple-500'>
            Login
          </h1>
          <div className='mt-2 max-w-xl text-sm text-gray-300'>
            <p className='text-center text-1xl md:text-3xl'>
              You can generate a wallet or connect your own.
            </p>
          </div>
          <div className='mt-5 flex flex-col space-x-4 column'>
            <div className='mt-5 flex flex-col space-x-4 column'>
              {/* <ConnectButton /> */}
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  // Note: If your app doesn't use authentication, you
                  // can remove all 'authenticationStatus' checks
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                          color: 'green',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <div className='p-2'>
                              <button
                                disabled={isLoading}
                                onClick={generateWallet}
                                type='button'
                                className='bg-purple-500 shadow-md p-2 my-1 text-white rounded-lg w-full flex justify-center tracking-wider'
                              >
                                <span>
                                  {isLoading ? (
                                    <span>
                                      <LoadingSVG />
                                    </span>
                                  ) : (
                                    'Generate Wallet'
                                  )}
                                </span>
                              </button>
                              <button
                                onClick={openConnectModal}
                                type='button'
                                className='border-solid border-2 border-lightgray-500 shadow-md p-2 my-1 text-purple-50 rounded-lg w-full tracking-wider'
                              >
                                Connect Wallet
                              </button>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// <?xml version="1.0" ?>
