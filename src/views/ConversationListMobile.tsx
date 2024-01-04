import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useMedia } from "react-use";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isEmpty } from "lodash";
import LoaderSvg from "../icons/Loading-svg-icon";
import { getToken } from "../util/util";

const ConversationListMobile = () => {
  const isMobile = useMedia("(max-width: 768px)");
  const navigate = useNavigate();
  const { user, pending: isLoadingProfile } = useAuth();

  const token = getToken();

  if (!token || (!isLoadingProfile && isEmpty(user))) {
    navigate("/login");
  }

  useEffect(() => {
    if (!isMobile) {
      navigate("/dashboard");
    }
  }, [isMobile, navigate]);

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderSvg />
      </div>
    );
  }

  return <Sidebar className="w-full" />;
};

export default ConversationListMobile;
