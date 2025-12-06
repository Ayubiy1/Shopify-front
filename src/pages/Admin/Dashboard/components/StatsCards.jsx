import { Card, Col, Row } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const StatsCards = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats-carts"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/admin/stats", {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return res.data;
    },
  });

  console.log(stats);

  return (
    <Row gutter={20}>
      <Col span={6}>
        <Card>
          <p>Foydalanuchilar</p>
          <h2>{stats?.users || 0} ta</h2>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <p>Mahsulotlar</p>
          <h2>{stats?.products || 0} ta</h2>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <p>Buyurtmalar</p>
          <h2>{stats?.orders || 0} ta</h2>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <p>Bu haftadagi Daromad</p>
          <h2>
            {stats?.weeklyIncome?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }) || "$0"}
          </h2>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;
