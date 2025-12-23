import { Button, Layout, Menu, theme } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLocalStorageState } from "ahooks";
import { CiViewTable } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";
import { FcAdvertising } from "react-icons/fc";
import { AiOutlineLogout } from "react-icons/ai";

const { Sider, Header, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useLocalStorageState("collapsed", {
    defaultValue: false,
  });
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useLocalStorageState(
    "collapsed",
    {
      defaultValue: "1",
    }
  );

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
          Admin
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(item) => navigate(item.key)}
          items={[
            {
              key: "/admin",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              // key: "/admin/products",
              icon: <AppstoreOutlined />,
              label: "Products",
              children: [
                {
                  key: "/admin/products/table",
                  icon: <CiViewTable />,
                  label: "Products Table",
                },
                {
                  key: "/admin/products/stock-history",
                  icon: <FaHistory />,
                  label: "Products Stock History",
                },
              ],
            },
            {
              key: "/admin/orders",
              icon: <ShoppingCartOutlined />,
              label: "Orders",
            },
            {
              key: "/admin/users",
              icon: <UserOutlined />,
              label: "Users",
            },
            {
              key: "/admin/corusel",
              icon: <FcAdvertising />,
              label: "Corusels",
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

export default AdminLayout;
