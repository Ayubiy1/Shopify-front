import React, { useState } from "react";
import { Button, Form, Input } from "antd";

import "./search.css";
import { useQuery } from "@tanstack/react-query";
import api from "../../auth";

const SearchComp = () => {
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: () => async (query) => {
      const res = await api.get(`/api/products/search?q=${query}`,
        { withCredentials: true }
      );

      return res.data;
    },
    enabled: searchValue.length > 0,
  });

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
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
          width: "50%",
          border: "1px solid rgba(54,55,64,.2)",
          borderRadius: "6px",
          height: "40px",
        }}
      >
        <Form.Item
          name="username"
          style={{
            margin: "0",
            borderTopEndRadius: "0",
            borderBottomEndRadius: "0",
          }}
        >
          <Input
            placeholder="Mahsulotni izlash..."
            style={{
              borderTopEndRadius: "0",
              borderBottomEndRadius: "0",
              margin: "0",
              height: "37px",
            }}
          />
        </Form.Item>

        <Form.Item label={null} style={{ height: "100%", margin: "0" }}>
          <Button
            style={{
              background: "#edeff2",
              color: "black",
              borderTopLeftRadius: "0",
              borderBottomLeftRadius: "0",
              height: "37px",
            }}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default SearchComp;
