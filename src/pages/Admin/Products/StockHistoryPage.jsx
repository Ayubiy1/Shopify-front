import React from "react";
import { Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const StockHistoryPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["stock-history"],
    queryFn: async () => {
      const res = await axios.get("https://shopify-backend-vcnq.onrender.com/api/stock-history");
      return res.data;
    },
  });

  const columns = [
    {
      title: "Product",
      dataIndex: "productId",
      render: (product) => product?.name,
    },
    {
      title: "Variant",
      dataIndex: "variants",
      render: (_, record) =>
        Object.entries(record?.variants || {}).map(([key, value]) => (
          <Tag key={key}>{value}</Tag>
        )),
    },
    {
      title: "Change",
      dataIndex: "change",
      render: (change) =>
        change < 0 ? (
          <Tag color="red">{change}</Tag>
        ) : (
          <Tag color="green">+{change}</Tag>
        ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (reason) => <Tag color="purple">{reason}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Stock History</h1>

      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        rowKey={(row) => row._id}
      />
    </div>
  );
};
export default StockHistoryPage;
