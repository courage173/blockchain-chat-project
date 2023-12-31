import React, { Children, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "../components/Header";
import { useClient } from "../hooks/useClient";
import { useAuth } from "../hooks/useAuth";
import CopyIcon from "../icons/copy-svg-icon";
import { shortAddress } from "../util/shortAddress";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, activeChat } = useAuth();
  const client = useClient() as any;
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(client.address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <>
      <Sidebar />
      <div className="h-screen  m-auto ml-[310px] bg-[#252329] relative">
        <Header>
          <div className="flex justify-between w-200 h-100 p-4">
            <div className="text-white flex">
              <p className="pr-1 text-cyan-500">
                {activeChat?.guest ||
                  shortAddress(activeChat?.guestAddress || "")}
                {/* {shortAddress(client.address)} */}
              </p>
              <button className="text-x flex tracking-wide" onClick={copy}>
                <span className="px-1">
                  {copied ? "Copied Wallet Address!" : "Copy Wallet Address"}
                </span>
                <span>
                  <CopyIcon />
                </span>
              </button>
            </div>
          </div>
        </Header>
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;