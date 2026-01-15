import { Button, Layout, Menu } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorageState } from "ahooks";
import { AiOutlineLogout } from "react-icons/ai";

const { Sider, Header, Content } = Layout;

const SalerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useLocalStorageState("collapsed", {
    defaultValue: false,
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsed={collapsed}>
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "15px 0",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Seller
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(item) => navigate(item.key)}
          items={[
            {
              key: "/seller",
              icon: <AppstoreOutlined />,
              label: "All",
            },
            {
              key: "/seller/products",
              icon: <DashboardOutlined />,
              label: "Products",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          className="flex items-center justify-between"
        >
          <Button
            onClick={() => {
              setCollapsed((prev) => !prev);
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>

          <Button
            type="primary"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Log out
            <AiOutlineLogout />
          </Button>
        </Header>

        <Content style={{ margin: "20px", background: "#fff", padding: 20 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SalerPage;
