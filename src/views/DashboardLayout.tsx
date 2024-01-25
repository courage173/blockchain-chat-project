import React, { Children, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "../components/Header";
import { useClient } from "../hooks/useClient";
import { useAuth } from "../hooks/useAuth";
import CopyIcon from "../icons/copy-svg-icon";
import { shortAddress } from "../util/shortAddress";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useMedia } from "react-use";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, activeChat } = useAuth();
  const client = useClient() as any;
  const [copied, setCopied] = useState(false);
  const isMobile = useMedia("(max-width: 768px)");

  return (
    <>
      <Sidebar className="hidden md:block" />
      <div className="h-screen m-auto ml-0 md:ml-[310px] bg-[#252329] relative">
        <Header>
          <div className="flex justify-between w-200 h-100 p-4">
            <div className="text-white flex items-center">
              <Link to="/conversations" className="mr-[20px] md:hidden flex">
                <ArrowLeftIcon className="h-[15px]" />
                Back
              </Link>
              <p className="pr-1 text-cyan-500 text-sm">
                Guest ID:{" "}
                {isMobile
                  ? shortAddress(activeChat?.guestAddress || "")
                  : activeChat?.guestAddress || ""}
                {/* {shortAddress(client.address)} */}
              </p>
            </div>
          </div>
        </Header>
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
