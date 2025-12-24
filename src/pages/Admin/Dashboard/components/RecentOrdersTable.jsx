import { Table } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const RecentOrdersTable = () => {
  const { data } = useQuery({
    queryKey: ["recent-recent-orders-table"],
    queryFn: async () => {
      const res = await axios.get(
        "https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/stock-history",
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
      title: "Customer",
      dataIndex: "title",
    },
    {
      title: "Total",
      dataIndex: "changed",
      render: (_, record) => {
        return Math.abs(record.changed);
      },
    },
    {
      title: "Total Sum",
      dataIndex: "totalPrice",
    },
  ];

  return <Table dataSource={data} columns={columns} pagination={false} />;
};

export default RecentOrdersTable;
