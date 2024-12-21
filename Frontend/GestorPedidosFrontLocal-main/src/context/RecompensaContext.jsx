import React, { createContext, useState } from "react";

export const RecompensaContext = createContext(null);

export const RecompensasProvider = ({ children }) => {
  const [recompensa, setrecompensa] = useState([]);

  return (
    <RecompensaContext.Provider value={[recompensa, setrecompensa]}>
      {children}
    </RecompensaContext.Provider>
  );
};