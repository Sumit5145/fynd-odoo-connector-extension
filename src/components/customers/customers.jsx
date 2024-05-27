import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Input, Modal, Row, Space, Table, Tooltip } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  EyeFilled,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../../views/style/global.css";
import MainService from "../../services/main-service";
import {
  DEFAULT_TABLE_LIMIT,
} from "../constant/constant";
import TableComponent from "../theme/table/tableComponent";
import DetailModal from "../modal/detailModal";
import { useNavigate } from "react-router-dom";

const Customers = (props) => {
  const { tabActive, setTabActive } = props;
  const [customerData, setCustomerData] = useState([]);
  const [customerDetailData, setCustomerDetailData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_TABLE_LIMIT,
    total: 0,
  });
  const [sorter, setSorter] = useState({ field: "_id", order: "asc" });
  const { confirm } = Modal;
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchCustomerData = async (pageNumber, pageSize, field, order) => {
    try {
      const response = await MainService.getAllCustomers(pageNumber, pageSize, field, order);

      if (response.status === 200) {
        setCustomerData(response.data.data);
        setPagination({
          ...pagination,
          current: pageNumber,
          pageSize: pageSize,
          total: response.data.total,
        });
      }
    } catch (error) {
      console.error("Failed to fetch customer data:", error.message);
    }
  };

  const handleTableChange = (pagination) => {
    let sortField = "";
    let sortOrder = "";
    if (pagination?.sorter["orderBy"]) {
      sortField = pagination?.sorter["orderBy"].split("|")[0];
      sortOrder = pagination?.sorter["orderBy"].split("|")[1];
    }
    else {
      sortField = sorter.field;
      sortOrder = sorter.order;
    }
    fetchCustomerData(pagination.current, pagination.pageSize, sortField, sortOrder);
  };

  useEffect(() => {
    if (tabActive === "4") {
      fetchCustomerData(pagination.current, pagination.pageSize, sorter.field, sorter.order);
    }
  }, [tabActive]);

  const customerListColumns = [
    {
      title: "ID",
      dataIndex: "_id",
      sorter: false,
      render: (text) => <span>{text ? text : "-"}</span>,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: true,
      render: (text) => <span>{text ? text : "-"}</span>,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: false,
      render: (text) => <span>{text ? text : "-"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: false,
      render: (text) => <span>{text.length > 0 ? text : "-"}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: false,
      render: (text) => <span>{text.length > 0 ? text : "-"}</span>,
    },
    {
      title: "Fynd ID",
      dataIndex: "fynd_id",
      sorter: false,
      render: (text) => <span>{text ? text : "-"}</span>,
    },
    {
      title: "Odoo ID",
      dataIndex: "odoo_id",
      sorter: false,
      render: (text, record) => <span>{text ? text : <Button onClick={() => syncCustomerDetails(record)} className="mr-2">Sync</Button>}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      sorter: false,
      render: (actions, record) => getActions(record),
    },
  ];

  const showConfirm = () => {
    confirm({
      title: 'Delete confirmation',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure want to delete this customer data?',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const fetchCustomerDetails = async (record) => {
    try {
      const response = await MainService.getCustomersDetails(record._id);

      if (response.status === 200) {
        setModalOpen(true)
        setCustomerDetailData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch customer data:", error.message);
    }
  };

  const syncCustomerDetails = async (record) => {
    try {     
      const response = await MainService.syncCustomersDetail(record.application_id, record._id);

      if (response.status === 200) {
        fetchCustomerData(pagination.current, pagination.pageSize, sorter.field, sorter.order);
      }
    } catch (error) {
      console.error("Failed to sync customer data:", error.message);
    }
  }

  const getActions = (record) => (
    <div className="flex items-center justify-start">
      <EyeFilled onClick={() => fetchCustomerDetails(record)} className="text-gray-400 cursor-pointer mr-2" />
      <DeleteOutlined onClick={showConfirm} className="text-gray-400 cursor-pointer" />
    </div>
  );

  return (
    <div className="my-5">
      <div className="bg-white">
        <div className="absolute top-[70px] right-[48px]">
          <div className="flex justify-end items-center">
            <Button className="mr-2">Manual Mapping</Button>
            <Button className="bg-[#A90083] text-white border border-[#A90083] !hover:bg-[#ff84e4] !hover:text-white">
              Sync Now!
            </Button>
          </div>
        </div>

        <TableComponent
          rowKey="customer"
          columns={customerListColumns}
          dataSource={customerData || []}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
          }}
          onTableChange={handleTableChange}
        />
        <DetailModal {...{ modalOpen, setModalOpen, data: customerDetailData, title: "View Customer" }} />
      </div>
    </div>
  );
};

export default Customers;
