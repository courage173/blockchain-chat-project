import { ReactElement, useState } from 'react';
import { Message } from '../model/db';
import { useReplies } from '../hooks/useReplies';
import ReplyComposer from './ReplyComposer';
import { MessageContent } from './MessageCellView';
import { shortAddress } from '../util/shortAddress';

export default function MessageRepliesView({
  message,
}: {
  message: Message;
}): ReactElement {
  const replies = useReplies(message);

  const [isShowingReplies, setIsShowingReplies] = useState(false);

  return isShowingReplies ? (
    <div className=''>
      {replies.length > 0 && (
        <div>
          {replies.map((message) => (
            <div className='flex text-xs ' key={message.xmtpID}>
              <span>{shortAddress(message.senderAddress)}:</span>
              <MessageContent message={message} />
            </div>
          ))}
        </div>
      )}

      <ReplyComposer
        inReplyToMessage={message}
        dismiss={() => setIsShowingReplies(false)}
      />
    </div>
  ) : (
    <button
      className='text-blue-600 text-xs )'
      onClick={() => setIsShowingReplies(true)}
    >
      {replies.length == 0
        ? 'Reply'
        : `${replies.length} repl${replies.length == 1 ? 'y' : 'ies'}`}
    </button>
  );
}
