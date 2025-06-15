import React, { createContext, useEffect } from "react";
import { useState, useContext } from "react";

export const context = createContext(null);


export default function ContextProvider({ children, setRefresh, refresh }) {
  const [reload, setReload] = useState(false);


  const contextValue= {
    reload,
    setReload,
    refresh,
    setRefresh,
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
}

export const useContextProvider = () => {
  return useContext(context);
};
