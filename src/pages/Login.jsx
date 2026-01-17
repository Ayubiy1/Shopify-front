import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../auth";

const Login = () => {
  const navigate = useNavigate();

  // "https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/auth/login",

  const { mutate } = useMutation({
    mutationFn: async (user) => {
      const res = await api.post("/api/auth/login", user);

      return res.data;
    },
    onSuccess: (res) => {
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
    const res = await fetch(
      "https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/auth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      }
    );

    const data = await res.json();

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    if (data.user.role === "buyer") {
      navigate("/users");
    }
    if (data.user.role === "admin") {
      navigate("/admin");
    }
    if (data.user.role === "seller") {
      navigate("/seller");
    }
    alert("Success");
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
          className="flex flex-col items-center justify-center"
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
            <Input className="w-[444px]" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Iltimos Passwordingizni kiriting!" },
            ]}
          >
            <Input.Password className="w-[444px]" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="mb-[15px]">
            Submit
          </Button>
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
