import React from "react";
import "./style/dashboard.css";
import Currency from "../assets/icons/Currency.svg";
import Collections from "../assets/icons/Collections.svg";
import Configurations from "../assets/icons/Configurations.svg";
import Tax from "../assets/icons/Tax.svg";
import Product from "../assets/icons/Product.svg";
import Order from "../assets/icons/Order.svg";
import Customer from "../assets/icons/Customer.svg";
import { useCookies } from "react-cookie";

function Dashboard(props) {
  const { tabActive, setTabActive } = props;
  const [cookies] = useCookies(["userId"]);
  // const userId = cookies["userId"];

  const dashBoardData = [
    {
      key: "1",
      img: Configurations,
      title: "Configurations",
      desc: "Setup App's configurations",
    },
    {
      key: "2",
      img: Product,
      title: "Product Sync",
      desc: "Sync products from here",
    },
    {
      key: "3",
      img: Collections,
      title: "Collections Sync",
      desc: "Sync categories from here",
    },
    {
      key: "4",
      img: Customer,
      title: "Customer Sync",
      desc: "Sync customer data from here",
    },
    {
      key: "5",
      img: Order,
      title: "Order Sync",
      desc: "Sync orders from here",
    },
    {
      key: "6",
      img: Configurations,
      title: "Payment Sync",
      desc: "Sync payments from here",
    },
    {
      key: "7",
      img: Tax,
      title: "Tax Sync",
      desc: "Sync taxes from here",
    },
    {
      key: "8",
      img: Currency,
      title: "Currency Sync",
      desc: "Sync currencies from here",
    },
  ];

  const onHandleClick = (key) => {
    setTabActive(key);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {dashBoardData.map((tab, index) => (
          <div
            className="border border-[#e4e5e6] p-6 rounded-xl cursor-pointer"
            key={index}
            onClick={() => onHandleClick(tab.key)}
          >
            <div className="text-center">
              <img
                className="max-w-100 mx-auto"
                src={tab.img}
                alt={tab.title}
              />
              <h2 className="line-1 font-semibold text-xl">{tab.title}</h2>
              <p className="text-sm font-normal">{tab.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
