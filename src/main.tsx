import "./polyfills";
import "./index.css";
import "@animxyz/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ClientProvider from "./contexts/ClientContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { findConversation } from "./model/conversations";
import ConversationViewWithLoader from "./views/ConversationViewWithLoader.tsx";
import NewConversationView from "./views/NewConversationView.tsx";
import WalletContext from "./contexts/WalletContext.tsx";
import { ToasterProvider } from "./providers/toast-provider.tsx";
import LoginView from "./views/LoginView.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WrappedComponent from "./components/WrappedComponent.tsx";
import DashboardLayout from "./views/DashboardLayout.tsx";
import RegisterView from "./views/RegisterView.tsx";

async function conversationLoader({ params }: any) {
  const conversation = await findConversation(params.conversationTopic);
  return { conversation };
}

const router = createBrowserRouter([
  {
    path: "dashboard",
    element: (
      <WrappedComponent>
        <App />
      </WrappedComponent>
    ),
  },
  {
    path: "signup",
    element: <RegisterView />,
  },
  {
    path: "login",
    element: (
      <WrappedComponent>
        <LoginView />
      </WrappedComponent>
    ),
  },
  {
    path: "c/:conversationTopic",
    element: (
      <WrappedComponent>
        <DashboardLayout>
          <ConversationViewWithLoader />
        </DashboardLayout>
      </WrappedComponent>
    ),
    loader: conversationLoader,
  },
  {
    path: "new",
    element: (
      <WrappedComponent>
        <NewConversationView />
      </WrappedComponent>
    ),
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToasterProvider>
        <ClientProvider>
          <WalletContext>
            <RouterProvider router={router} />
          </WalletContext>
        </ClientProvider>
      </ToasterProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
