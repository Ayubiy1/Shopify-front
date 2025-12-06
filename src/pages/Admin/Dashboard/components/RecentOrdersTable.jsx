import { Table } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const RecentOrdersTable = () => {
  const { data } = useQuery({
    queryKey: ["recent-recent-orders-table"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    },
  });

  const columns = [
    { title: "Customer", dataIndex: "title" },
    { title: "Total", dataIndex: "count" },
    { title: "Total Sum", dataIndex: "price" },
  ];

  return <Table dataSource={data} columns={columns} pagination={false} />;
};

export default RecentOrdersTable;
