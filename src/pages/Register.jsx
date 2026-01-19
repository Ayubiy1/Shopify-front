import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (newUser) => {
      const res = await axios.post(
        "https://angry-korie-developerayubiy-4da36956.koyeb.app/api/auth/register",
        newUser,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      navigate("/login");
      alert("Registered");
    },
  });

  const onFinish = (values) => {
    if (values.password.length < 6)
      console.log("Password 6 tadan kam bolmasligi kerak");
    else mutate({ ...values, role: "buyer" });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        width: "100%",
      }}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 444 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Iltimos Emailingizni kiriting!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Register;
