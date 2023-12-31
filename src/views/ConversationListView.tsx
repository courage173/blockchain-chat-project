import { ReactElement, useEffect, useMemo, useState } from "react";
import { useConversations } from "../hooks/useConversations";
import { useClient } from "../hooks/useClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLatestMessages } from "../hooks/useLatestMessages";
import ConversationCellView from "./ConversationCellView";
import { useAPI } from "../hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import UserCellView from "./UserCellView";
import { startConversation } from "../model/conversations";
import { Client } from "@xmtp/xmtp-js";
import { IUser } from "../model/db";
import { isEmpty } from "lodash";
import { useAuth } from "../hooks/useAuth";

const REFETCH_INTERVAL_MS = 5 * 1000;

export default function ConversationListView(): ReactElement {
  const client = useClient();
  const callAPI = useAPI();
  const navigate = useNavigate();
  const params = useParams();
  const conversations = useConversations(client);
  const latestMessages = useLatestMessages(conversations);
  const { setActiveChatUsers, user } = useAuth();

  const { data: publicUsers, isLoading } = useQuery<IUser[]>(
    ["users"],
    () => callAPI(`/auth/users/`),
    {
      refetchInterval: REFETCH_INTERVAL_MS,
      refetchIntervalInBackground: true,
      cacheTime: 0,
    }
  );

  const privateConversations = useMemo(() => {
    return conversations
      ?.filter((conversation) => {
        const user = ((publicUsers as IUser[]) || []).find((user: any) => {
          return user.walletId === conversation.peerAddress;
        });
        return isEmpty(user);
      })
      .map((conversation) => {
        const messages = latestMessages.find(
          (m) => m?.conversationTopic === conversation.topic
        );
        return {
          ...conversation,
          latestMessage: messages,
        };
      });
  }, [conversations, publicUsers, latestMessages]);

  const publicConversations = useMemo(() => {
    return ((publicUsers as IUser[]) || []).map((user) => {
      if (user.walletId) {
        const existingConversation = conversations?.find(
          (c) => c.peerAddress === user.walletId
        );
        const conversation = existingConversation;

        if (conversation) {
          const messages = latestMessages.find(
            (m) => m?.conversationTopic === conversation.topic
          );

          conversation.latestMessage = messages;
        }

        user.conversation = conversation;
      }

      return user;
    });
  }, [conversations, publicUsers, latestMessages]);

  useEffect(() => {
    const currentGuest: any = [
      ...publicConversations,
      privateConversations,
    ]?.find(
      (user: any) =>
        user.conversation?.topic === params.conversationTopic ||
        user.topic === params.conversationTopic
    );

    if (!isEmpty(currentGuest)) {
      setActiveChatUsers({
        guest: currentGuest?.firstName + " " + currentGuest.lastName,
        activeUser: user?.firstName,
        guestAddress: currentGuest?.walletId || currentGuest?.peerAddress,
      });
    }
  }, [
    publicConversations,
    params.conversationTopic,
    user?.firstName,
    setActiveChatUsers,
    privateConversations,
  ]);

  async function handleConversation(user: IUser) {
    if (user.conversation?.topic) {
      navigate(`/c/${user.conversation.topic}`);
      return;
    }

    try {
      const conversation = await startConversation(
        client as Client,
        user.walletId
      );
      navigate(`/c/${conversation.topic}`);
    } catch (e) {
      toast(String(e));
    }
  }

  return (
    <div className="flex flex-col">
      {privateConversations?.length > 0 && <h5>Private Chats</h5>}
      {/* {privateConversations?.length == 0 && (
        <p className="text-white text-xs">No private chat.</p>
      )} */}
      {privateConversations ? (
        privateConversations.map((conversation, i) => (
          <Link to={`/c/${conversation.topic}`} key={conversation.topic}>
            <ConversationCellView
              conversation={conversation}
              latestMessage={conversation.latestMessage}
            />
          </Link>
        ))
      ) : (
        <p>Could not load conversations</p>
      )}
      <h5 className="my-[20px]">All Chats</h5>
      {publicConversations?.map((user) => {
        return (
          <UserCellView
            key={user._id}
            user={user}
            onClick={() => handleConversation(user)}
          />
        );
      })}
    </div>
  );
}
