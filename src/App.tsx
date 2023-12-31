import React, { useEffect } from "react";
import LoginView from "./views/LoginView";
import { useClient } from "./hooks/useClient";
import HomeView from "./views/HomeView";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useAuth } from "./hooks/useAuth";
import { isEmpty } from "lodash";
import ConnectWallet from "./views/ConnectWallet";
import { useNavigate } from "react-router-dom";

TimeAgo.addDefaultLocale(en);

function App() {
  const client = useClient();

  const { fetchUser, user } = useAuth();
  const navigator = useNavigate();

  const handleRedirect = () => {
    navigator("/login");
  };

  useEffect(() => {
    if (isEmpty(user)) {
      fetchUser(handleRedirect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return client ? <HomeView /> : <ConnectWallet />;
}

export default App;
