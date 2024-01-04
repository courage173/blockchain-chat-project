import "./polyfills";
import "./index.css";
import "@animxyz/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ClientProvider from "./contexts/ClientContext.tsx";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  BrowserRouter,
  Routes,
} from "react-router-dom";
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
import ConversationListMobile from "./views/ConversationListMobile.tsx";
import ConnectWallet from "./views/ConnectWallet.tsx";

async function conversationLoader({ params }: any) {
  const conversation = await findConversation(params.conversationTopic);
  return { conversation };
}

const router = createBrowserRouter([
  {
    path: "dashboard",
    element: <App />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/conversations",
    element: <ConversationListMobile />,
  },
  {
    path: "signup",
    element: <RegisterView />,
  },
  {
    path: "login",
    element: <LoginView />,
  },
  {
    path: "c/:conversationTopic",
    element: <ConversationViewWithLoader />,
    loader: conversationLoader,
  },
  {
    path: "new",
    element: <NewConversationView />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToasterProvider>
          <WrappedComponent>
            <ClientProvider>
              <WalletContext>
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/dashboard" element={<App />} />
                  <Route
                    path="conversations"
                    element={<ConversationListMobile />}
                  />
                  <Route path="signup" element={<RegisterView />} />

                  <Route path="login" element={<LoginView />} />
                  <Route
                    path="c/:conversationTopic"
                    element={<ConversationViewWithLoader />}
                  />
                  <Route path="connectWallet" element={<ConnectWallet />} />
                  <Route path="new" element={<NewConversationView />} />
                </Routes>

                {/* <RouterProvider router={router} /> */}
              </WalletContext>
            </ClientProvider>
          </WrappedComponent>
        </ToasterProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
