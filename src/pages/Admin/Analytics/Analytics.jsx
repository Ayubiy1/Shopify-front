import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Analytics = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["corusel-analytics-admin"],
    queryFn: async () => {
      const res = await axios.get("https://angry-korie-developerayubiy-4da36956.koyeb.app/api/corusel");
      return res.data;
    },
  });

  if (isLoading) {
    return <Card title="Carousel Analyticdasdasdass" loading />;
  }

  const chartData = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          name: item.category,
          Views: 0,
          Clicks: 0,
        };
      }

      acc[item.category].Views += item.views || 0;
      acc[item.category].Clicks += item.clicks || 0;

      return acc;
    }, {})
  );

  console.log(chartData);

  return (
    <Card title="Carousel Analytics" className="w-[55%] mx-auto">
      <BarChart
        width={600}
        height={300}
        data={chartData}
        className="cursor-pointer"
        margin={{ top: 1, right: 1, left: 1, bottom: 1 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Views" fill="#1677ff" />
        <Bar dataKey="Clicks" fill="#52c41a" />
      </BarChart>
    </Card>
  );
};

export default Analytics;
