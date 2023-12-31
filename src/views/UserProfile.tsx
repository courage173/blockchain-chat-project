import React from "react";
import LogoutIcon from "../icons/logout-svg-icon";
import { logoutEnc } from "../util/enc-dec-user";
import { Toaster } from "../providers/toast-provider";
import { useDisconnect } from "wagmi";
import { useSetClient } from "../hooks/useClient";
import { useAuth } from "../hooks/useAuth";

const UserProfile = ({
  show,
  setShowProfileModal,
  setSettingsModal,
}: {
  show: boolean;
  setShowProfileModal: () => void;
  setSettingsModal: () => void;
}) => {
  const { disconnectAsync } = useDisconnect();
  const setClient = useSetClient();

  const { signOut } = useAuth();

  const loc_name = import.meta.env.VITE_APP_LOCNAME;

  async function logout() {
    try {
      await disconnectAsync();
      indexedDB.deleteDatabase("DB");
      window.location.reload();
      // localStorage.removeItem("_insecurePrivateKey");
      logoutEnc(loc_name);

      const instanceOfSetTimeOut = setTimeout(() => {
        setClient(null);
      }, 1000);

      clearTimeout(instanceOfSetTimeOut);
    } catch (error: any) {
      Toaster.error(error.message);
    }
  }
  if (show === false) return <></>;
  return (
    <div
      data-aos="zoom-in"
      className="bg-[#202123] mb-[5px] rounded-lg pb-1.5 pt-1 absolute w-full bottom-full"
    >
      <button
        onClick={() => {
          setShowProfileModal();
        }}
        className="w-full flex px-3 min-h-[44px] py-1 items-center gap-3 dark:text-white cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Profile
      </button>
      <button
        onClick={() => {
          setSettingsModal();
        }}
        className="w-full flex px-3 min-h-[44px] py-1 items-center gap-3 dark:text-white cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Settings
      </button>
      <div className="h-px dark:bg-white/10 bg-black/20"></div>
      <button
        onClick={signOut}
        className="w-full flex px-3 min-h-[44px] py-1 items-center gap-3 dark:text-white cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <LogoutIcon /> Log out
      </button>
    </div>
  );
};

export default UserProfile;