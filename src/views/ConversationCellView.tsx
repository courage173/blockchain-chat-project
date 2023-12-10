import { ReactElement } from 'react';
import { Conversation, Message } from '../model/db';
import { shortAddress } from '../util/shortAddress';
import ReactTimeAgo from 'react-time-ago';
import { MessageContent } from './MessageCellView';

export default function ConversationCellView({
  conversation,
  latestMessage,
}: {
  conversation: Conversation;
  latestMessage: Message | undefined;
}): ReactElement {
  return (
    <div className='mt-2 p-2 border dark:border-zinc-600 rounded ß'>
      <div className='flex items-left justify-between space-x-2'>
        <div className='hover:underline'>
          <span className='text-blue-700 dark:text-blue-500'>
            {conversation.title || shortAddress(conversation.peerAddress)}
          </span>{' '}
        </div>
        <div className='text-xs text-zinc-500 flex flex-col'>
          <ReactTimeAgo date={conversation.updatedAt} />
        </div>
      </div>
      {latestMessage ? (
        <div className=' text-zinc-500 flex justify-between'>
          {/* <MessageContent message={latestMessage} /> */}
          <p className='p-1 flex-1'>{latestMessage.content.slice(0, 30)}...</p>
          <p className='bg-blue-500 text-white p-1 rounded-full w-16 h-8 flex justify-center items-center ml-5'>
            {latestMessage?.sentByMe ? 'You' : 'Others'}
          </p>
        </div>
      ) : (
        <div className='block text-zinc-500'>No messages yet.</div>
      )}
    </div>
  );
}
