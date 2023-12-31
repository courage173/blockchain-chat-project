import { ReactElement, useState, useRef } from "react";
import { Conversation, Message } from "../model/db";
import { useMessages } from "../hooks/useMessages";
import MessageComposerView from "./MessageComposerView";
import MessageCellView from "./MessageCellView";

import { useLiveConversation } from "../hooks/useLiveConversation";

import { ContentTypeId } from "@xmtp/xmtp-js";
import { ContentTypeReaction } from "@xmtp/content-type-reaction";
import { useReadReceipts } from "../hooks/useReadReceipts";
import useScrollToLast from "../hooks/useScrollToLast";
import { useAuth } from "../hooks/useAuth";

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
  //console.log(liveConversation.topic, "liveConversation", conversation.topic);

  const messages = useMessages(conversation);
  const { activeChat } = useAuth();

  const showReadReceipt = useReadReceipts(conversation);

  const [isShowingSettings, setIsShowingSettings] = useState(false);

  const messagesEndRef = useRef<any>(null);

  useScrollToLast(messages?.length, messagesEndRef);

  return (
    <div className="relative">
      <div className="relative pt-14 overflow-y-auto overflow-x-hidden h-screen bg-[url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)] pb-[100px]">
        <div className="px-4">
          {messages?.length == 0 && <p>No messages yet.</p>}
          {messages ? (
            messages.reduce((acc: ReactElement[], message: Message, index) => {
              const showRead = showReadReceipt && index === messages.length - 1;
              if (appearsInMessageList(message)) {
                acc.push(
                  <MessageCellView
                    key={message.id}
                    message={message}
                    activeChat={activeChat}
                    readReceiptText={showRead ? "Read" : undefined}
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
      </div>
      <MessageComposerView conversation={conversation} />
    </div>
  );
}
