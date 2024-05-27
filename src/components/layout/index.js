import React from "react";
import Header from "../header/header";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
};

export default MainLayout;
