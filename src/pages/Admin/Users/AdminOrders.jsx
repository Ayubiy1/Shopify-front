import React, { useState } from "react";
import { Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminOrders = () => {
  const [filteredInfo, setFilteredInfo] = useState({});

  const { data } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () =>
      await axios.get(`https://shopify-backend-vcnq.onrender.com/api/cart`),
  });

  const columns = [
    {
      title: "Rasm",
      dataIndex: "images",
      fixed: "left",
      with: 222,
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
      title: "Soni",
      dataIndex: "count",
      with: 222,
      render: (c) => `${c} ta`,
      sorter: (a, b) => a?.count - b?.count,
    },
    {
      title: "Narx",
      dataIndex: "price",
      render: (p) => `$${p}`,
      sorter: (a, b) => a?.price - b?.price,
    },
    {
      title: "Umumiy",
      dataIndex: "",
      render: (_, p) => {
        return `${p.count * p.price} $`;
      },
      sorter: (a, b) => a.count * a.price - b.count * b.price,
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
        scroll={{ x: 1000, y: 148 * 5 }}
      />
    </>
  );
};

export default AdminOrders;
