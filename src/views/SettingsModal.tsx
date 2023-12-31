import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import { useAPI } from "../hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoadingSVG from "../icons/Loading-svg-icon";
import Switch from "../components/Switch";

const SettingsModal = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (val: boolean) => void;
}) => {
  const { user, setNewUser } = useAuth();
  const [isPrivate, setPrivate] = useState(user?.isPrivate || false);

  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(
    window.localStorage.getItem("readReceiptsEnabled") === "true"
  );

  useEffect(() => {
    window.localStorage.setItem(
      "readReceiptsEnabled",
      String(readReceiptsEnabled)
    );
  }, [readReceiptsEnabled]);

  const callAPI = useAPI();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: { isPrivate: boolean }) =>
      callAPI(`/auth/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      setNewUser(data);
      toast.success(`Successfully updated profile`);
    },
    onError: (error: { message: string }) => {
      toast.error(`Error when updating profile: ${error?.message}`);
    },
  });

  return (
    <Modal headerText="Settings" show={show} setShow={setShow}>
      <div>
        <div className="mb-4 flex justify-between w-full items-center border-b border-[rgba(217,217,227,.1)] pb-3 last-of-type:border-b-0">
          <label>Make Account {user?.isPrivate ? "Public" : "Private"}</label>
          <div className="flex items-center">
            {isLoading && <LoadingSVG />}
            <Switch
              isChecked={isPrivate}
              disabled={isLoading}
              setIsChecked={(value) => {
                mutate({ isPrivate: value });
                setPrivate(value);
              }}
            />
          </div>
        </div>
        <div className="mb-4 flex justify-between w-full items-center">
          <label>
            {readReceiptsEnabled
              ? "Disable read receipts"
              : "Enable read receipts"}
          </label>
          <Switch
            isChecked={readReceiptsEnabled}
            setIsChecked={() => {
              setReadReceiptsEnabled(!readReceiptsEnabled);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
