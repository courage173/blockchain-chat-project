import React from "react";
import defaultProfile from "../assets/default-profile.png";
import { IUser } from "../model/db";
import { CameraIcon } from "@heroicons/react/20/solid";

type Props = {
  user: IUser;
  onClick: () => void;
};

const UserCellView = ({ user, onClick }: Props) => {
  const isImage =
    user?.conversation?.latestMessage?.content?.mimeType === "image/jpeg" ||
    user?.conversation?.latestMessage?.content?.content?.mimeType ===
      "image/jpeg";
  return (
    <div
      className="flex items-center hover:bg-[#202123] p-[10px] rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <img
        src={defaultProfile}
        alt="profile"
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col ml-[10px] ">
        <span>{user.firstName + " " + user.lastName}</span>
        <span className="text-xs text-slate-400">
          {isImage ? (
            <span className="flex items-center">
              <CameraIcon className="h-4 mr-[5px]" /> Photo
            </span>
          ) : user.conversation?.latestMessage?.content &&
            user.conversation?.latestMessage?.content?.content ? (
            <span>
              {user.conversation.latestMessage?.content?.content?.slice(0, 30)}
              ...
            </span>
          ) : (
            <span>
              {user.conversation?.latestMessage?.content?.slice(0, 30)}...
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default UserCellView;
