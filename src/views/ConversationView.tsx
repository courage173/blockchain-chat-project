import { ReactElement, useEffect, useState, useRef } from 'react';
import { Conversation, Message } from '../model/db';
import { useMessages } from '../hooks/useMessages';
import MessageComposerView from './MessageComposerView';
import MessageCellView from './MessageCellView';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useLiveConversation } from '../hooks/useLiveConversation';
import ConversationSettingsView from './ConversationSettingsView';
import { ContentTypeId } from '@xmtp/xmtp-js';
import { ContentTypeReaction } from '@xmtp/content-type-reaction';
import { useReadReceipts } from '../hooks/useReadReceipts';
import useScrollToLast from '../hooks/useScrollToLast';

const appearsInMessageList = (message: Message): boolean => {
  if (ContentTypeReaction.sameAs(message.contentType as ContentTypeId)) {
    return false;
  }

  return true;
};

export default function ConversationView({
  conversation,
}: {
  conversation: Conversation;
}): ReactElement {
  const liveConversation = useLiveConversation(conversation);

  const messages = useMessages(conversation);

  const showReadReceipt = useReadReceipts(conversation);

  const [isShowingSettings, setIsShowingSettings] = useState(false);

  // useEffect(() => {
  //   window.scrollTo({ top: 100000, behavior: 'smooth' });
  // }, [messages?.length]);

  //--------using ref to control the scrolling automatically to the bottom--------//
  const messagesEndRef = useRef<any>(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages?.length]);

  useScrollToLast(messages?.length, messagesEndRef);

  return (
    <div className='p-4 pb-20 pt-14 overflow-y-auto overflow-x-hidden h-screen bg-[url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)]'>
      <Header>
        <div className='flex justify-between font-bold px-4 py-2'>
          <span className='flex-grow'>
            {liveConversation?.title || conversation.peerAddress}
          </span>
          <div className='space-x-4'>
            <button
              className='inline-block space-x-1 text-zinc-600'
              onClick={() => {
                setIsShowingSettings(!isShowingSettings);
              }}
            >
              <Cog6ToothIcon className='h-4 inline-block align-top' />
              <span>Settings</span>
            </button>
            <button>
              <Link className='text-blue-700' to='/'>
                Go Back
              </Link>
            </button>
          </div>
        </div>
        {isShowingSettings && (
          <ConversationSettingsView
            conversation={conversation}
            dismiss={() => setIsShowingSettings(false)}
          />
        )}
      </Header>
      <div>
        {messages?.length == 0 && <p>No messages yet.</p>}
        {messages ? (
          messages.reduce((acc: ReactElement[], message: Message, index) => {
            const showRead = showReadReceipt && index === messages.length - 1;
            if (appearsInMessageList(message)) {
              acc.push(
                <MessageCellView
                  key={message.id}
                  message={message}
                  readReceiptText={showRead ? 'Read' : undefined}
                />
              );
            }

            return acc;
          }, [] as ReactElement[])
        ) : (
          <span>Could not load messages</span>
        )}
      </div>
      <div ref={messagesEndRef} />

      <MessageComposerView conversation={conversation} />
    </div>
  );
}
