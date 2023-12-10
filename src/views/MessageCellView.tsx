import { ReactElement, useEffect, useState } from 'react';
import { Message, MessageAttachment } from '../model/db';
import { useAttachment } from '../hooks/useAttachment';
import { shortAddress } from '../util/shortAddress';
import { ContentTypeId, ContentTypeText } from '@xmtp/xmtp-js';
import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
} from '@xmtp/content-type-remote-attachment';
import { ContentTypeReply, Reply } from '@xmtp/content-type-reply';
import MessageRepliesView from './MessageRepliesView';
import ReactionsView from './ReactionsView';
import ReadReceiptView from './ReadReceiptView';
import ReactTimeAgo from 'react-time-ago';

function ImageAttachmentContent({
  attachment,
}: {
  attachment: MessageAttachment;
}): ReactElement {
  const objectURL = URL.createObjectURL(
    new Blob([Buffer.from(attachment.data)], {
      type: attachment.mimeType,
    })
  );

  return (
    <img
      onLoad={() => {
        window.scroll({ top: 10000, behavior: 'smooth' });
      }}
      className='rounded w-48'
      src={objectURL}
      title={attachment.filename}
    />
  );
}

function AttachmentContent({ message }: { message: Message }): ReactElement {
  const attachment = useAttachment(message);

  if (!attachment) {
    return <span className='text-zinc-500'>Loading attachment…</span>;
  }

  if (attachment.mimeType.startsWith('image/')) {
    return <ImageAttachmentContent attachment={attachment} />;
  }

  return (
    <span>
      {attachment.mimeType} {attachment.filename || 'no filename?'}
    </span>
  );
}

export function Content({
  content,
  contentType,
}: {
  content: any;
  contentType: ContentTypeId;
}): ReactElement {
  if (ContentTypeText.sameAs(contentType)) {
    return <span className='text-gray-500 text-left'>{content}</span>;
  }

  if (ContentTypeReply.sameAs(contentType)) {
    const reply: Reply = content;
    return <Content content={reply.content} contentType={reply.contentType} />;
  }

  return (
    <span className='text-zinc-500 break-all'>
      Unknown content: {JSON.stringify(content)}
    </span>
  );
}

export function MessageContent({
  message,
}: {
  message: Message;
}): ReactElement {
  if (
    ContentTypeAttachment.sameAs(message.contentType as ContentTypeId) ||
    ContentTypeRemoteAttachment.sameAs(message.contentType as ContentTypeId)
  ) {
    return <AttachmentContent message={message} />;
  }

  return (
    <Content
      content={message.content}
      contentType={message.contentType as ContentTypeId}
    />
  );
}

export default function MessageCellView({
  message,
  readReceiptText,
}: {
  message: Message;
  readReceiptText: string | undefined;
}): ReactElement {
  const [showTime, setShowTime] = useState(false);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setCount(1);
    }, 1000);
  }, [showTime, count]);

  const handleShowTime = () => {
    setCount((prev) => prev + 1);
    if (count === 2) {
      setShowTime((prev) => !prev);
    }
  };

  return (
    <div
      onClick={handleShowTime}
      className={`flex justify-${
        message.sentByMe ? 'end' : 'start'
      }  p-0.5 rounded-md my-2`}
    >
      <div
        className={`flex flex-col max-w-[75%] ${
          message.sentByMe ? 'bg-green-100' : 'bg-blue-200'
        } rounded-md p-2`}
      >
        <span
          title={message.sentByMe ? 'You' : message.senderAddress}
          className={
            message.sentByMe
              ? 'text-red-900 px-2 text-right'
              : 'text-green-500 px-2 text-left'
          }
        >
          {shortAddress(message.senderAddress)}:
        </span>
        <div className={`ml-2 text-${message.sentByMe ? 'left' : 'left'} pr-2`}>
          <MessageContent message={message} />
          <div className={`flex justify-${message.sentByMe ? 'end' : 'start'}`}>
            <span>
              <MessageRepliesView message={message} />
            </span>
            <span>
              <ReactionsView message={message} />
            </span>
          </div>
          <ReadReceiptView readReceiptText={readReceiptText} />
        </div>
        {showTime && (
          <div
            className={`flex justify-${
              message.sentByMe ? 'end' : 'start'
            } px-2 border-t-2 py-1`}
          >
            <p className='text-xs'>
              <ReactTimeAgo date={message.sentAt} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
