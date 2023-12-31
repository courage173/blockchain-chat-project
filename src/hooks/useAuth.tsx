/* eslint-disable @typescript-eslint/no-empty-function */
// Assuming you have React and the necessary libraries installed as typescript dependencies.
"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { useLocalStorage } from "react-use";
import { checkStatus, prepareEndpoint } from "../util/util";
import { useAPI } from "./useApi";

type IUser = {
  id?: string;
  _id?: string;
  email?: string;
  isPrivate?: boolean;
  firstName?: string;
  lastName?: string;
};

type ActiveChat = {
  guest?: string;
  activeUser?: string;
  guestAddress?: string;
};

interface State {
  auth: any;
  isLoggedIn: boolean;
  pending: boolean;
  signOut: (handleRedirect: () => void) => void;
  fetchUser: (handleRedirect: () => void) => void;
  setNewUser: (response: IUser & { _id: string }) => void;
  user: IUser | undefined;
  activeChat: ActiveChat | undefined;
  setActiveChatUsers: (data: ActiveChat) => void;
}

const initialState: State = {
  auth: {},
  isLoggedIn: false,
  pending: false,
  signOut: () => {},
  fetchUser: () => {},
  setNewUser: () => {},
  setActiveChatUsers: () => {},
  user: {},
  activeChat: {},
};

export const toUser = (data: IUser & { _id: string }) => {
  return {
    id: data._id,
    email: data.email,
    isPrivate: data.isPrivate,
    firstName: data.firstName,
    lastName: data.lastName,
  };
};

export const AuthContext = createContext<State>(initialState);

interface ProvideAuthProps {
  children: ReactNode;
  isAppRouter?: boolean;
}

// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth()
export function ProvideAuth({ children }: ProvideAuthProps) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = (): State => {
  return useContext(AuthContext);
};

interface Action {
  type: string;
  payload?: any;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCHING":
      return { ...state, pending: true };
    case "USER_FETCHED":
      return {
        ...state,
        pending: false,
        user: { ...state.user, ...action.payload },
      };
    case "LOGGED_OUT":
      return { ...state, pending: false, user: {} };
    case "ACTIVE_CHAT":
      return { ...state, activeChat: action.payload };
    default:
      throw new Error();
  }
}

function useProvideAuth(): State {
  const [user, setUser] = useLocalStorage<IUser | undefined>("user", {});
  const [activeChat, setActiveChat] = useLocalStorage<ActiveChat | undefined>(
    "activeChat",
    {}
  );
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    user,
    activeChat,
  });

  //const navigate = useNavigate();
  const callAPI = useAPI();

  const setNewUser = useCallback(
    (response: IUser & { _id: string }) => {
      setUser(toUser({ ...user, ...response }));
      dispatch({ type: "USER_FETCHED", payload: toUser(response) });
    },
    [setUser, user]
  );

  const setActiveChatUsers = useCallback(
    (data: ActiveChat) => {
      setActiveChat(data);
      dispatch({ type: "ACTIVE_CHAT", payload: data });
    },
    [setActiveChat]
  );

  const fetchUser = useCallback(
    async (handleRedirect: () => void) => {
      if (state.pending) return;
      try {
        dispatch({ type: "FETCHING" });
        const URL = `/auth/user/`;

        const response: any = await callAPI(URL);
        dispatch({ type: "USER_FETCHED", payload: toUser(response) });
        setUser(toUser(response));
      } catch (e) {
        // Logout the user nevertheless
        dispatch({ type: "LOGGED_OUT" });
        setUser({});
        handleRedirect();
      }
    },
    [state.pending, callAPI, setUser]
  );

  const signOut = useCallback(
    async (handleRedirect: () => void) => {
      if (state.pending) return;
      try {
        dispatch({ type: "FETCHING" });
        const URL = `/auth/logout/`;

        const response = await fetch(prepareEndpoint(URL), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          credentials: "include",
        });

        await checkStatus(response);

        dispatch({ type: "LOGGED_OUT" });
        setUser({});
        return handleRedirect();
      } catch (e) {
        // Logout the user nevertheless
        dispatch({ type: "LOGGED_OUT" });
        setUser({});
        return handleRedirect();
      }
    },
    [state.pending, setUser]
  );

  // Return the user object and auth methods
  return {
    ...state,
    isLoggedIn: true,
    fetchUser,
    signOut,
    setNewUser,
    setActiveChatUsers,
  };
}
