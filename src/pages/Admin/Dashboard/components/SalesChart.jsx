import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import "./stye.css";

const SalesChart = () => {
  const { data } = useQuery({
    queryKey: ["sales-chart"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/admin/chart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    },
  });

  const months = [
    "Yan",
    "Fev",
    "Mar",
    "Apr",
    "May",
    "Iyun",
    "Iyul",
    "Avg",
    "Sen",
    "Okt",
    "Noy",
    "Dek",
  ];

  const chartData = data?.map((item) => {
    const timestamp = parseInt(item._id.substring(0, 8), 16) * 1000;
    const dateObj = new Date(timestamp);

    return {
      day: `${dateObj.getDate()} ${months[dateObj.getMonth()]}`, // 24 Noy
      sales: item.price * item.count,
    };

    // return {
    //   day: `${dateObj.getDate()} ${months[dateObj.getMonth()]}`, // 24 Noy
    //   sales: item.price * item.count,
    // };
  });

  // const chartData = data?.map((item) => {
  //   const timestamp = parseInt(item._id.substring(0, 8), 16) * 1000;

  //   const day = new Date(timestamp).toLocaleDateString("uz-UZ", {
  //     day: "numeric",
  //     month: "short",
  //   });

  //   return {
  //     day,
  //     sales: item.price * item.count, // yoki item.totalPrice bo'lsa shu
  //   };
  // });

  return (
    <>
      <LineChart width={600} height={300} data={chartData}>
        <Line type="monotone" dataKey="sales" stroke="#1677ff" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </>
  );
};

export default SalesChart;
