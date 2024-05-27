import { Tabs } from "antd";
import React, { useState } from "react";
import HomeIcon from "../theme/icon/homeIcon";
import SettingIcon from "../theme/icon/settingIcon";
import ProductIcon from "../theme/icon/productIcon";
import CollectionIcon from "../theme/icon/collectionIcon";
import CustomerIcon from "../theme/icon/customerIcon";
import OrderIcon from "../theme/icon/orderIcon";
import PaymentIcon from "../theme/icon/paymentIcon";
import TaxIcon from "../theme/icon/taxIcon";
import CurrencyIcon from "../theme/icon/CurrencyIcon";
import ShippingIcon from "../theme/icon/shippingIcon";
import "../../views/style/home.css";
import Dashboard from "../../views/Dashboard";
import Customers from "../customers/customers";
import { ArrowLeftOutlined } from "@ant-design/icons";
import pluralize from "pluralize";
import Configuration from "../configuration/configuration";
import TabPane from "antd/es/tabs/TabPane";

const Header = () => {
  const [tabActive, setTabActive] = useState("0");
  
  const tabList = [
    {
      key: "0",
      label: "Home",
      icon: <HomeIcon className="mb-1" />,
      component: <Dashboard {...{ tabActive, setTabActive }} />,
    },
    {
      key: "1",
      label: "Configuration",
      icon: <SettingIcon />,
      component: <Configuration />,
    },
    {
      key: "2",
      label: "Products",
      icon: <ProductIcon />,
      component: <Dashboard />,
    },
    {
      key: "3",
      label: "Collections",
      icon: <CollectionIcon />,
      component: <Dashboard />,
    },
    {
      key: "4",
      label: "Customers",
      icon: <CustomerIcon />,
      component: <Customers {...{ tabActive, setTabActive }} />,
    },
    {
      key: "5",
      label: "Orders",
      icon: <OrderIcon />,
      component: <Dashboard />,
    },
    {
      key: "6",
      label: "Payment Methods",
      icon: <PaymentIcon />,
      component: <Dashboard />,
    },
    { key: "7", label: "Taxes", icon: <TaxIcon />, component: <Dashboard /> },
    {
      key: "8",
      label: "Currencies",
      icon: <CurrencyIcon />,
      component: <Dashboard />,
    },
    {
      key: "9",
      label: "Shipping Methods",
      icon: <ShippingIcon />,
      component: <Dashboard />,
    },
  ];

  const onChangeTab = (activeKey) => {
    setTabActive(activeKey);
  };

  return (
    <div className="">
      <div className="border border-b-white/15 flex items-center p-3 cursor-pointer bg-white">
        <ArrowLeftOutlined className="text-black w-4 h-4 mr-1 mt-1" />
        <img src={"/images/Logo.svg"} alt="" width={60} height={60} />
      </div>

      <Tabs activeKey={tabActive} onChange={onChangeTab}>
        {tabList.map((tab) => (
          <TabPane
            key={tab.key}
            tab={
              <div className="flex items-center">
                {tab.icon}
                <span className="ml-2 text-sm font-normal">{tab.label}</span>
              </div>
            }
            on
          >
            <div className="m-5">
              <div className="application-container p-12 mt-6 relative">
                <h1 className="font-semibold text-[38px]">{tab.label}</h1>
                <p className="text-base font-normal py-2">
                  {tab.label === "Home" ? "With Odoo connector app you can sync data from Fynd to Odoo." : `With Odoo connector app you can sync ${pluralize.singular(tab.label).toLowerCase()} data from Fynd to Odoo.`}

                </p>
                {tab.component}
              </div>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Header;
