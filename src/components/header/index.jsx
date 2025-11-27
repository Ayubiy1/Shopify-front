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
      const res = await axios.get("https://shopify-backend-vcnq.onrender.com/api/categories/");
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
          {/* <div className="header__logo-icon">S</div> */}
          <span className="header__logo-text">Shopping UZ</span>
        </div>

        {/* Katalog button */}
        <Button type="default" onClick={showDrawer} icon={<MenuOutlined />}>
          Katalog
        </Button>

        {/* Search bar */}
        <SearchComp />

        {/* Right icons */}
        <div className="header__actions">
          <div className="header__action-item">
            <UserOutlined />
          </div>
          <div className="header__action-item">
            <HeartOutlined />
          </div>
          <div
            className="header__action-item"
            onClick={() => {
              navigate("/users/cart");
            }}
          >
            <ShoppingCartOutlined />
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
            {/* <div className="header__logo-icon">S</div> */}
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
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              className="category"
              style={{
                padding: "5px",
                border: "1px solid",
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

{
  // import React, { useState } from "react"
  // import Logo from "./image.png"
  // import { Button, Drawer } from "antd"
  // import SearchComp from "./search";
  // const HeaderComp = () => {
  //     const [open, setOpen] = useState(false);
  //     const showDrawer = () => {
  //         setOpen(true);
  //     };
  //     const onClose = () => {
  //         setOpen(false);
  //     };
  //     return <>
  //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
  //             <img style={{ width: "200px" }} src={Logo} alt="" />
  //             <div style={{ display: "flex", }}>
  //                 <Button style={{ background: "rgb(0 106 255 / 52%)", color: "white" }} onClick={showDrawer}>Katalog</Button>
  //                 <SearchComp />
  //             </div>
  //         </div>
  //         <Drawer
  //             title="Basic Drawer"
  //             closable={{ 'aria-label': 'Close Button' }}
  //             onClose={onClose}
  //             open={open}
  //         >
  //             <p>Some contents...</p>
  //             <p>Some contents...</p>
  //             <p>Some contents...</p>
  //         </Drawer>
  //     </>
  // }
  // export default HeaderComp
}
