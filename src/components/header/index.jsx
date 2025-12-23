import React, { useState } from "react";
import { Input, Button, Form, Drawer } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import SearchComp from "./search";
import { useQuery } from "@tanstack/react-query";

import "./Header.css";
import { useNavigate } from "react-router-dom";

export default function HeaderComp() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["products-user"],
    queryFn: async () => {
      const res = await axios.get(
        "https://shopify-backend-vcnq.onrender.com/api/categories/",
        { withCredentials: true }
      );
      return res.data;
    },

    onSuccess: () => {},
  });

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className="header">
        {/* Logo */}
        <div className="header__logo">
          <span
            className="header__logo-text cursor-pointer"
            onClick={() => {
              navigate("/users");
            }}
          >
            Shopping UZ
          </span>
        </div>

        <div className="md:hidden">
          <Button type="default" onClick={showDrawer} icon={<MenuOutlined />}>
            Katalog
          </Button>
        </div>

        <SearchComp />

        <div className="header__actions">
          <div
            className="header__action-item"
            onClick={() => {
              onClose();
              navigate("/users/profil");
            }}
          >
            <UserOutlined /> Profil
          </div>
          <div className="header__action-item">
            <HeartOutlined /> Saralanganlar
          </div>
          <div
            className="header__action-item"
            onClick={() => {
              navigate("/users/cart");
            }}
          >
            <ShoppingCartOutlined /> Korinka
          </div>
        </div>
      </div>

      <div className="nav">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div className="header__logo">
            <span className="header__logo-text">Shopping UZ</span>
          </div>

          <Button type="primary" onClick={showDrawer} icon={<MenuOutlined />}>
            Katalog
          </Button>
        </div>

        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          variant={"borderless"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // width: "50%",
            border: "1px solid rgba(54,55,64,.2)",
            borderRadius: "6px",
            height: "32px",
          }}
        >
          <Form.Item
            name="username"
            style={{
              margin: "0",
              borderTopEndRadius: "0",
              borderBottomEndRadius: "0",
              width: "100%",
            }}
          >
            <Input.Search
              placeholder="Mahsulotni izlash..."
              style={{
                width: "100%",
                borderTopEndRadius: "0",
                borderBottomEndRadius: "0",
                margin: "0",
              }}
            />
          </Form.Item>
        </Form>
      </div>

      <Drawer
        title="Categorys"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
      >
        <div
          className="flex items-center justify-around"
          style={{ marginBottom: "25px" }}
        >
          <div
            className="header__action-item"
            onClick={() => {
              onClose();
              navigate("/users/profil");
            }}
          >
            <UserOutlined />
          </div>
          <div className="header__action-item">
            <HeartOutlined />
          </div>
          <div
            className="header__action-item"
            onClick={() => {
              onClose();
              navigate("/users/cart");
            }}
          >
            <ShoppingCartOutlined />
          </div>
        </div>
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              className="category"
              style={{
                padding: "5px",
                borderRadius: "6px",
                margin: "5px 0",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() => {
                navigate(`/users/${item?._id}`);
                onClose();
              }}
            >
              <span>{item?.name}</span>
            </div>
          );
        })}
      </Drawer>
    </>
  );
}
