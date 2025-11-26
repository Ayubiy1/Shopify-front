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
          defaultSelectedKeys={`/admin`}
          className=""
          onClick={(item) => navigate(item.key)}
          items={[
            {
              index: location.pathname == "/admin" && true,
              key: "/admin",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              index: location.pathname == "/admin/products" && true,

              key: "/admin/products",
              icon: <AppstoreOutlined />,
              label: "Products",
            },
            {
              index: location.pathname == "/admin/orders" && true,

              key: "/admin/orders",
              icon: <ShoppingCartOutlined />,
              label: "Orders",
            },
            {
              index: location.pathname == "/admin/users" && true,

              key: "/admin/users",
              icon: <UserOutlined />,
              label: "Users",
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
        >
          <Button
            onClick={() => {
              setCollapsed((prev) => !prev);
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
