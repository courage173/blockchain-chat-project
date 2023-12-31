import { useLoaderData } from "react-router-dom";
import ConversationView from "./ConversationView";
import { ReactElement } from "react";
import { Conversation } from "../model/db";
import DashboardLayout from "./DashboardLayout";

export default function ConversationViewWithLoader(): ReactElement {
  const { conversation } = useLoaderData() as { conversation: Conversation };

  return (
    <DashboardLayout>
      <ConversationView conversation={conversation} />
    </DashboardLayout>
  );
}
