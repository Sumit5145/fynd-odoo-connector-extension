import React, { useState } from "react";

const UserStateContext = React.createContext();

const UserProviderContext = ({ children }) => {
  const [userId, setUserId] = useState();
  const [company_id, setCompanyId] = useState();
  const [application_id, setApplicationId] = useState();

  const value = {
    userId,
    setUserId,
    company_id,
    setCompanyId,
    application_id,
    setApplicationId,
  };

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};

export { UserProviderContext, UserStateContext };
