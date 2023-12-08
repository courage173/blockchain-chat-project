import { ReactElement, useEffect, useState } from 'react';
import { useConversations } from '../hooks/useConversations';
import { useClient } from '../hooks/useClient';
import { Link } from 'react-router-dom';
import { useLatestMessages } from '../hooks/useLatestMessages';
import ConversationCellView from './ConversationCellView';

export default function ConversationListView(): ReactElement {
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(
    window.localStorage.getItem('readReceiptsEnabled') === 'true'
  );

  const client = useClient();
  const conversations = useConversations(client);
  const latestMessages = useLatestMessages(conversations);

  useEffect(() => {
    window.localStorage.setItem(
      'readReceiptsEnabled',
      String(readReceiptsEnabled)
    );
  }, [readReceiptsEnabled]);

  return (
    <div className='flex items-center space-x-4 content-center flex-col m-auto'>
      <button
        onClick={() => setReadReceiptsEnabled(!readReceiptsEnabled)}
        className='bg-purple-500 shadow-md p-2 my-1 text-white rounded-lg w-full flex justify-center tracking-wider'
        id={`read-receipt-${readReceiptsEnabled}`}
      >
        {readReceiptsEnabled ? 'Disable read receipts' : 'Enable read receipts'}
      </button>
      {conversations?.length == 0 && (
        <p className='text-white'>No conversations yet.</p>
      )}
      {conversations
        ? conversations.map((conversation, i) => (
            <Link to={`c/${conversation.topic}`} key={conversation.topic}>
              <ConversationCellView
                conversation={conversation}
                latestMessage={latestMessages[i]}
              />
            </Link>
          ))
        : 'Could not load conversations'}
    </div>
  );
}
