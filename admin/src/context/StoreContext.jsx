import React, { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const [url, setUrl] = useState("http://localhost:4000");
  const [token, setToken] = useState("");

  return (
    <StoreContext.Provider value={{ url, setToken }}>
      {children}
    </StoreContext.Provider>
  );
};
