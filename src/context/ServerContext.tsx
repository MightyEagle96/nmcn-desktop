import React, { createContext, useContext, useState, useEffect } from "react";
import { setApiBaseIp, clearApiBaseIp } from "../api/axiosClient";

interface ServerContextType {
  serverIp: string | null;
  setServerIp: (ip: string | null) => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [serverIp, setServerIpState] = useState<string | null>(null);

  useEffect(() => {
    const savedIp = localStorage.getItem("serverIp");
    if (savedIp) {
      setServerIpState(savedIp);
      setApiBaseIp(savedIp);
    }
  }, []);

  const setServerIp = (ip: string | null) => {
    setServerIpState(ip);

    if (ip) {
      localStorage.setItem("serverIp", ip);
      setApiBaseIp(ip);
    } else {
      localStorage.removeItem("serverIp");
      clearApiBaseIp();
    }
  };

  return (
    <ServerContext.Provider value={{ serverIp, setServerIp }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const ctx = useContext(ServerContext);
  if (!ctx) throw new Error("useServer must be used inside ServerProvider");
  return ctx;
};
