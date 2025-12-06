import React, { useState } from "react";
import { Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminOrders = () => {
  const [filteredInfo, setFilteredInfo] = useState({});

  const { data } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => await axios.get(`http://localhost:3000/api/cart`),
  });

  const columns = [
    {
      title: "Rasm",
      dataIndex: "images",
      render: (images) =>
        images?.length ? (
          <img src={images[0]} width={60} style={{ borderRadius: 8 }} />
        ) : (
          "No image"
        ),
    },
    {
      title: "Nomi",
      dataIndex: "title",
      fixed: "left",
      with: 222,
    },
    {
      title: "Narx",
      dataIndex: "price",
      render: (p) => `$${p}`,
      sorter: (a, b) => a?.price - b?.price,
    },
    {
      title: "Combination",
      dataIndex: "combination",
      render: (_, record) =>
        Object.entries(record.combination)
          .map(([key, value]) => `${value}`)
          .join(" || "),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        pagination={false}
        dataSource={data?.data}
        scroll={{ x: 1000, y: 90 * 5 }}
      />
    </>
  );
};

export default AdminOrders;
