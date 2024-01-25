import React, { useState } from "react";
import Modal from "../components/Modal";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
import { useAPI } from "../hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoadingSVG from "../icons/Loading-svg-icon";
import { useClient } from "../hooks/useClient";
import CopyIcon from "../icons/copy-svg-icon";

const ProfileDetailsModal = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (val: boolean) => void;
}) => {
  const client = useClient() as any;
  const [copied, setCopied] = useState(false);
  const { user, setNewUser } = useAuth();
  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  }>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form, user?.firstName);
  };

  const callAPI = useAPI();
  const { mutate, isLoading } = useMutation({
    mutationFn: (data: { firstName: string; lastName: string }) =>
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

  function copy() {
    navigator.clipboard.writeText(client.address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  const shouldUpdate =
    form.firstName?.trim().length > 3 &&
    form.lastName?.trim().length > 3 &&
    (form.lastName !== user?.lastName || form.firstName !== user?.firstName);

  return (
    <Modal headerText="Profile" show={show} setShow={setShow}>
      <div>
        <div className="mb-4">
          <label className="mb-[10px] text-xs">First Name</label>
          <Input
            className="w-[300px]"
            name="firstName"
            value={form.firstName}
            error={
              form.firstName && form.firstName.trim().length < 3
                ? "First name must be at least 3 characters!"
                : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="mb-[10px] text-xs">Last Name</label>
          <Input
            className="w-[300px]"
            name="lastName"
            value={form.lastName}
            error={
              form.lastName && form.lastName.trim().length < 3
                ? "Last name must be at least 3 characters!"
                : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="mb-[10px] text-xs">Email</label>
          <Input
            className="w-[300px]"
            name="email"
            value={form.email}
            disabled
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="mb-[10px] text-xs flex justify-between">
            <span>Blockchain Wallet Address</span>{" "}
            <button className="text-x flex tracking-wide" onClick={copy}>
              <span className="px-1">
                {copied ? "Copied Wallet Address!" : "Copy Your Wallet Address"}
              </span>
              <span>
                <CopyIcon />
              </span>
            </button>
          </label>
          <Input
            className="w-[300px]"
            name="walletAddress"
            value={user?.walletId || ""}
            disabled
            onChange={handleChange}
          />
        </div>

        <Button
          className="flex items-center justify-center ml-auto"
          type="button"
          disabled={!shouldUpdate}
          onClick={() =>
            mutate({ firstName: form.firstName, lastName: form.lastName })
          }
        >
          {isLoading ? (
            <span className="text-white">
              <LoadingSVG />
            </span>
          ) : (
            <span>Save changes</span>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ProfileDetailsModal;
