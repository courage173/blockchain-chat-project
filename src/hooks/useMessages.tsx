import { useEffect } from "react";
import { useClient } from "./useClient";
import { loadMessages } from "../model/messages";
import db, { Conversation, Message } from "../model/db";
import { useLiveQuery } from "dexie-react-hooks";

export function useMessages(conversation: Conversation): Message[] | undefined {
  const client = useClient();

  useEffect(() => {
    if (!client || !conversation?.topic) return;
    loadMessages(conversation, client);
  }, [client, conversation]);

  return useLiveQuery(async () => {
    if (!conversation?.topic) return;
    return await db.messages
      .where({
        conversationTopic: conversation.topic,
        inReplyToID: "",
      })
      .sortBy("sentAt");
  }, [conversation?.topic]);
}
