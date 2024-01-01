import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useMedia } from "react-use";
import { useNavigate } from "react-router-dom";

const ConversationListMobile = () => {
  const isMobile = useMedia("(max-width: 768px)");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMobile) {
      navigate("/dashboard");
    }
  }, [isMobile, navigate]);

  return <Sidebar className="w-full" />;
};

export default ConversationListMobile;
