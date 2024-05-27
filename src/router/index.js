import { createBrowserRouter } from "react-router-dom";
import { routeGuard } from "./guard";

import App from "../App";
import Header from "../components/header/header";
import Auth from "../views/Auth";
import Customers from "../components/customers/customers";

const router = createBrowserRouter([
  {
    path: "/company/:company_id/",
    element: <App />,
    loader: routeGuard,
  },
  {
    path: "/customer/list/",
    element: <Customers />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },

  {
    path: "/dashboard",
    element: <Header />,
  },
]);

export default router;
