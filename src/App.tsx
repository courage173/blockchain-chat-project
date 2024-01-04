import React, { useEffect, useState } from "react";
import LoginView from "./views/LoginView";
import { useClient } from "./hooks/useClient";
import HomeView from "./views/HomeView";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useAuth } from "./hooks/useAuth";
import LoaderSvg from "./icons/Loading-svg-icon";
import { useNavigate } from "react-router-dom";
import { getToken } from "./util/util";

TimeAgo.addDefaultLocale(en);

function App() {
  const client = useClient();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const { pending: isLoadingProfile } = useAuth();

  // useEffect(() => {
  //   if (isEmpty(user)) {
  //     fetchUser();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (loading || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderSvg />
      </div>
    );
  }

  if (!loading && !client) {
    navigate("/connectWallet");
  }

  return <HomeView />;
}

export default App;
