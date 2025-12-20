import { Card, Row, Col } from "antd";
import StatsCards from "./components/StatsCards.jsx";
import SalesChart from "./components/SalesChart.jsx";
import RecentOrdersTable from "./components/RecentOrdersTable.jsx";
import Analytics from "../Analytics/Analytics.jsx";

const AdminDashboard = () => {
  return (
    <div
      style={{
        padding: 20,
        height: "82vh",
        overflow: "scroll",
        scrollbarColor: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Admin Dashboard</h1>

      {/* Stats */}
      <StatsCards />

      <Row gutter={20} style={{ marginTop: 20 }}>
        <Col md={24} xl={12}>
          <Card title="Sotish jadvali">
            <SalesChart />
          </Card>
        </Col>

        <Col md={24} xl={12}>
          <Card title="Oxirgi buyurtmalar">
            <RecentOrdersTable />
          </Card>
        </Col>
      </Row>

      <div className="mt-[20px]">
        <Analytics />
      </div>
    </div>
  );
};

export default AdminDashboard;
