import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (user) => {
      const res = await axios.post(
        "https://shopify-backend-vcnq.onrender.com/api/auth/login",
        user,
        { withCredentials: true }
      );

      console.log("Login response:", res);
      return res.data;
    },
    onSuccess: (res) => {
      // localStorage.setItem("token", token);
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      if (res.user.role === "buyer") {
        navigate("/users");
      }
      if (res.user.role === "admin") {
        navigate("/admin");
      }
      if (res.user.role === "seller") {
        navigate("/seller");
      }
      alert("Success");
    },
    onError: (error) => {
      alert(error.response?.data?.message || error.message);
    },
  });

  const handleLogin = async (credentialResponse) => {
    console.log("Token frontenddan:", credentialResponse.credential);

    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded:", decoded); // name, email, picture

    // Backendga yuborish
    const res = await fetch("http://localhost:5000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });

    // const res = await fetch("http://localhost:5000/auth/google", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token: credentialResponse.credential }),
    // });
    const data = await res.json();
    console.log("Backend response:", data);
  };

  const onFinish = (values) => {
    if (values.password.length < 6)
      alert("Password 6 tadan kam bolmasligi kerak");
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
        height: "100vh",
        width: "100%",
      }}
    >
      <div className="flex flex-col justify-center items-center w-[80%]">
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
            rules={[
              { required: true, message: "Iltimos Passwordingizni kiriting!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => {
            console.log("Logi failed");
          }}
        />
      </div>
    </div>
  );
};
export default Login;
