import { useCallback } from "react";
import { toast } from "react-toastify";
import { checkStatus, prepareEndpoint } from "../util/util";
import { useAuth } from "./useAuth";

const onTokenInvalid = (signOut: () => void) => {
  signOut();
  toast.error("Invalid token. Please log in again.");
  return;
};

export class FetchError extends Error {
  constructor(message: string, public res?: Response) {
    super(message);
  }
}

interface CallAPIOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}

export const useAPI = () => {
  const { signOut } = useAuth();

  const callAPI = async (
    endpoint: string,
    { headers, ...restOptions }: CallAPIOptions = {}
  ): Promise<any> => {
    let rawResponse: Response | undefined = undefined;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(prepareEndpoint(endpoint), {
        ...restOptions,
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      });
      rawResponse = response;

      const data = await checkStatus(response);
      return data;
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        const error = e as { message: string };
        // If the token is invalid, sign the user out
        if (error.message === "Unauthorized") {
          return onTokenInvalid(signOut);
        }
      }
      throw new FetchError((e as Error).message, rawResponse);
    }
  };

  return useCallback(callAPI, [signOut]);
};
