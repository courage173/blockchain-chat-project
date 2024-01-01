import React, { useRef, useState } from "react";
import ConversationListView from "./ConversationListView";
import { useAuth } from "../hooks/useAuth";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import defaultProfile from "../assets/default-profile.png";

import useClickOutside from "use-click-outside";

import EditIcon from "../icons/Edit";
import NewConversationView from "./NewConversationView";
import Modal from "../components/Modal";
import UserProfile from "./UserProfile";
import ProfileDetailsModal from "./ProfileDetailsModal";
import SettingsModal from "./SettingsModal";

const Sidebar = ({ className }: { className?: string }) => {
  const { user } = useAuth();

  const [show, setShow] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef(null);

  //useClickOutside(ref, () => setShowProfile(false));

  const handleClick = (value: boolean) => {
    setShowProfile(value);
  };

  return (
    <div
      className={`h-full w-[310px] fixed bg-[#0b090c] p-[20px] ${
        className ? className : ""
      }`}
    >
      <div className="h-full w-full relative">
        <span>
          <Modal show={show} setShow={setShow} headerText="Start Private Chat">
            <div className="w-full">
              <NewConversationView setShow={setShow} />
            </div>
          </Modal>
        </span>

        <button
          onClick={() => setShow(true)}
          className="text-white mb-[20px] hover:bg-[#202123] w-full  p-[10px] flex justify-between rounded-lg"
        >
          <span>Start new private chat</span>
          <EditIcon className="h-5 w-5" />
        </button>
        <div className=" w-full border-right">
          <ConversationListView />
        </div>
        <ProfileDetailsModal
          show={showProfileModal}
          setShow={setShowProfileModal}
        />
        <SettingsModal
          show={showSettingsModal}
          setShow={setShowSettingsModal}
        />
        <div
          className={`absolute bottom-5 hover:bg-[#202123] rounded-lg  w-full cursor-pointer ${
            showProfile ? "!bg-[#202123]" : ""
          }`}
          onClick={() => handleClick(true)}
          ref={ref}
        >
          <UserProfile
            show={showProfile}
            setSettingsModal={() => {
              handleClick(false);
              setShowSettingsModal(true);
            }}
            setShowProfileModal={() => {
              handleClick(false);
              setShowProfileModal(true);
            }}
          />
          <div
            className="flex items-center p-[10px] gap-2 rounded-lg p-2 text-sm pt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(!showProfile);
            }}
          >
            <img
              src={defaultProfile}
              alt="profile"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <span>{user?.firstName + " " + user?.lastName}</span>
            </div>
            {showProfile ? (
              <ChevronUpIcon className="h-4 ml-[5px]" />
            ) : (
              <ChevronDownIcon className="h-4 ml-[5px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
