import { ReactElement } from "react";
import { Conversation, Message } from "../model/db";
import { shortAddress } from "../util/shortAddress";
import ReactTimeAgo from "react-time-ago";
import { MessageContent } from "./MessageCellView";
import { CameraIcon } from "@heroicons/react/24/solid";

export default function ConversationCellView({
  conversation,
  latestMessage,
}: {
  conversation: Conversation;
  latestMessage: Message | undefined;
}): ReactElement {
  console.log(latestMessage?.content);
  const isImage =
    latestMessage?.content?.mimeType === "image/jpeg" ||
    latestMessage?.content?.content?.mimeType === "image/jpeg";

  const isString =
    latestMessage?.content?.contentType?.typeId === "text" ||
    latestMessage?.content?.content?.contentType?.typeId === "text";

  return (
    <div className="mt-2 p-2 border border-zinc-600 rounded ß">
      <div className="flex items-left justify-between space-x-2">
        <div className="hover:underline">
          <span className="text-blue-700 text-blue-500">
            {conversation.title || shortAddress(conversation.peerAddress)}
          </span>{" "}
        </div>
        <div className="text-xs text-zinc-500 flex flex-col">
          <ReactTimeAgo date={conversation.updatedAt} />
        </div>
      </div>
      {latestMessage ? (
        <div className=" text-zinc-500 flex justify-between">
          {/* <MessageContent message={latestMessage} /> */}
          <p className="p-1 flex-1">
            {isImage ? (
              <span className="flex items-center">
                <CameraIcon className="h-4 mr-[5px]" /> Photo
              </span>
            ) : latestMessage?.content && latestMessage?.content?.content ? (
              <span>{latestMessage?.content?.content?.slice(0, 30)}...</span>
            ) : (
              <span>{latestMessage?.content?.slice(0, 30)}...</span>
            )}
          </p>
          <p className="bg-blue-500 text-white p-1 rounded-full w-16 h-8 flex justify-center items-center ml-5">
            {latestMessage?.sentByMe ? "You" : "Others"}
          </p>
        </div>
      ) : (
        <div className="block text-zinc-500">No messages yet.</div>
      )}
    </div>
  );
}
