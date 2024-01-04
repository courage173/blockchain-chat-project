import { ReactElement, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { encryptData } from "../util/enc-dec-user";
import { Toaster } from "../providers/toast-provider";
import { Wallet } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import { useClient, useSetClient } from "../hooks/useClient";
import LoadingSVG from "../icons/Loading-svg-icon";
import { useAPI } from "../hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useMedia } from "react-use";
import { useNavigate } from "react-router-dom";
import LoaderSvg from "../icons/Loading-svg-icon";

const ConnectWallet = () => {
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const setClient = useSetClient();
  const { user } = useAuth();
  const isMobile = useMedia("(max-width: 768px)");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (client && !loading) {
      if (isMobile) {
        navigate("/conversations");
      } else {
        navigate("/dashboard");
      }
    }
  }, [client, isMobile, navigate, loading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const callAPI = useAPI();
  const { mutate, isLoading: isSavingWalletId } = useMutation({
    mutationFn: (walletId: string) =>
      callAPI(`/auth/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletId }),
      }),
    onSuccess: () => {
      if (isMobile) {
        navigate("/conversations");
      } else {
        navigate("/dashboard");
      }

      toast.success(`Successfully added wallet`);
    },
    onError: (error: { message: string }) => {
      toast.error(`Error when signing in: ${error?.message}`);
    },
  });

  async function generateWallet() {
    try {
      setIsLoading((prev) => !prev);

      const wallet = Wallet.createRandom();

      const client = await Client.create(wallet, {
        env: "dev",
      });
      if (wallet && client) {
        const data = wallet.privateKey;
        const name = user?.id + import.meta.env.VITE_APP_LOCNAME;

        await encryptData(name, data);

        mutate(wallet.address);

        setClient(client);
        setIsLoading((prev) => !prev);
      }
    } catch (e: any) {
      setIsLoading((prev) => !prev);
      Toaster.error(e.message);
      console.error("error", e.message);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderSvg />
      </div>
    );
  }
  return (
    <div className="mt-5 flex flex-col space-x-4 column justify-center items-center h-[92vh]">
      <div className="mt-5 flex flex-col space-x-4 column p-4">
        {/* <ConnectButton /> */}
        <p className="text-center">
          Connect your wallet below or generate a random <br />
          wallet to start your secure messaging!
        </p>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                    color: "green",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <div className="md:min-w-[500px]">
                        <button
                          disabled={isLoading}
                          onClick={generateWallet}
                          type="button"
                          className="bg-blue-500 shadow-md p-2 my-5 text-white rounded-lg w-full flex justify-center tracking-wider "
                        >
                          <span className="text-white">
                            {isLoading || isSavingWalletId ? (
                              <span className="text-white">
                                <LoadingSVG />
                              </span>
                            ) : (
                              "Generate Wallet"
                            )}
                          </span>
                        </button>
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="border-solid border-2 border-lightgray-500 shadow-md p-2 my-1 text-blue-500 rounded-lg w-full tracking-wider"
                        >
                          Connect Wallet
                        </button>
                      </div>
                    );
                  }
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default ConnectWallet;
