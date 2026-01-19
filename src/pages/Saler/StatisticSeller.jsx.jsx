import React from "react";
import { Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const StatisticProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stockhistories-products-for-seller"],
    queryFn: async () => {
      const res = await axios.get(
        "https://angry-korie-developerayubiy-4da36956.koyeb.app/api/stock-history/seller",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
  });

  const columns = [
    {
      title: "Product",
      dataIndex: "productId",
      render: (id, product) => {
        return product?.title;
      },
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
      title: "Tolov",
      dataIndex: "reason",
      render: (reason) => <Tag color="green">{reason}</Tag>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (reason) => <Tag color="green">{reason}</Tag>,
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      render: (totalPrice) => `${totalPrice.toLocaleString("uz-UZ")} so'm`,
    },
  ];

  return (
    <>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Stock History</h1>

      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        rowKey={(row) => row._id}
      />
    </>
  );
};

export default StatisticProducts;

{
  // import { useQuery } from "@tanstack/react-query";
  // import { useEffect } from "react";
  // const StatisticProducts = () => {
  //   const { data, isLoading, error } = useQuery({
  //     queryKey: ["stockhistories-products-for-seller"],
  //     queryFn: async () => {
  //       const res = await axios.get(
  //         "https://angry-korie-developerayubiy-4da36956.koyeb.app/api/stock-history/seller",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           },
  //         }
  //       );
  //       return res.data;
  //     },
  //   });
  //   console.log(data);
  //   // useEffect(() => {
  //   //   console.log(data);
  //   // }, []);
  //   return <>a</>;
  // };
  // export default StatisticProducts;
}
