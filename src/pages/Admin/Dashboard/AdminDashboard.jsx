import { Card, Row, Col } from "antd";
import StatsCards from "./components/StatsCards.jsx";
import SalesChart from "./components/SalesChart.jsx";
import RecentOrdersTable from "./components/RecentOrdersTable.jsx";

const AdminDashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>

      {/* Stats */}
      <StatsCards />

      <Row gutter={20} style={{ marginTop: 20 }}>
        <Col span={16}>
          <Card title="Sotish jadvali">
            <SalesChart />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Oxirgi buyurtmalar">
            <RecentOrdersTable />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
