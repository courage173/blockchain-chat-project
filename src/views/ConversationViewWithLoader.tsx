import { useLoaderData } from "react-router-dom";
import ConversationView from "./ConversationView";
import { ReactElement } from "react";
import { Conversation } from "../model/db";
import DashboardLayout from "./DashboardLayout";

export default function ConversationViewWithLoader(): ReactElement {
  return (
    <DashboardLayout>
      <ConversationView />
    </DashboardLayout>
  );
}
