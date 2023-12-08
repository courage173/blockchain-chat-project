import { Client } from '@xmtp/xmtp-js';
import { Wallet } from 'ethers';
import { createContext, useState, ReactElement, useEffect } from 'react';
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from '@xmtp/content-type-remote-attachment';
import { ReplyCodec } from '@xmtp/content-type-reply';
import { ReactionCodec } from '@xmtp/content-type-reaction';
import { ReadReceiptCodec } from '@xmtp/content-type-read-receipt';
import { decryptData } from '../util/enc-dec-user';

type ClientContextValue = {
  client: Client | null;
  setClient: (client: Client | null) => void;
};

const NAME_LOC = import.meta.env.VITE_APP_LOCNAME as string;

export const ClientContext = createContext<ClientContextValue>({
  client: null,
  setClient: () => {
    return;
  },
});

export default function ClientProvider({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const [client, setClient] = useState<Client | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const decData = await decryptData(NAME_LOC);

      // const insecurePrivateKey = localStorage.getItem('_insecurePrivateKey');

      if (!decData) {
        // setIsLoading(false);

        return;
      }

      try {
        const wallet = new Wallet(decData);
        const client = await Client.create(wallet, {
          env: 'dev',
        });

        client.registerCodec(new AttachmentCodec());
        client.registerCodec(new RemoteAttachmentCodec());
        client.registerCodec(new ReplyCodec());
        client.registerCodec(new ReactionCodec());
        client.registerCodec(new ReadReceiptCodec());

        setClient(client);
      } catch (error: any) {
        console.log('error', error.message);
      }
    })();
  }, []);

  const clientContextValue = {
    client,
    setClient,
  };

  return (
    <ClientContext.Provider value={clientContextValue}>
      {/* {isLoading ? (
        <div className='w-full p-4 m-auto'>Loading client....</div>
      ) : (
        children
      )} */}

      {children}
    </ClientContext.Provider>
  );
}
