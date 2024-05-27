import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { UserProviderContext } from "./context/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProviderContext>
      <RouterProvider router={router} />
    </UserProviderContext>
  </React.StrictMode>
);
