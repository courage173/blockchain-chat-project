import React, { ReactElement } from "react";
import { ProvideAuth } from "../hooks/useAuth";

const ConfigContext = React.createContext({ BASE_URL: "" });

const WrappedComponent = ({
  children,
}: {
  children: ReactElement | string;
}) => {
  return (
    <ConfigContext.Provider
      value={{ BASE_URL: import.meta.env.VITE_PUBLIC_BACKEND_URL as string }}
    >
      <ProvideAuth>{children}</ProvideAuth>
    </ConfigContext.Provider>
  );
};

export default WrappedComponent;
