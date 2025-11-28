import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  //   const { mutate } = useMutation({
  //     mutationFn: async (user) => {
  //       const res = await axios.post(
  //         "https://shopify-backend-vcnq.onrender.com/api/auth/login",
  //         user,
  //         { withCredentials: true }
  //       );
  //       return res.data;
  //     },
  //     onSuccess: (res) => {
  //       console.log("Login Response:", res);

  //       localStorage.setItem("token", res.accessToken);
  //       localStorage.setItem("refreshToken", res.refreshToken);

  //       if (res.user.role === "admin") navigate("/admin");
  //       if (res.user.role === "buyer") navigate("/users");
  //       if (res.user.role === "seller") navigate("/seller");
  //     },
  //     onError: (err) => {
  //       alert(err.response?.data?.message || "Xatolik");
  //     },
  //   });

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
      console.log("Login response:", res); // 👈 token qayerda kelayotganini tekshirib oling

      // backend qaysi nom bilan token qaytaryapti?
      // misol: res.token yoki res.accessToken yoki res.data.token
      const token = res.token || res.accessToken;

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
  {
    //   const { mutate } = useMutation({
    //     mutationFn: async (user) => {
    //       const res = await axios.post(
    //         "http://localhost:10000/api/auth/login",
    //         user
    //       );
    //       // https://shopify-backend-vcnq.onrender.com/api/auth/login",
    //       return res.data;
    //     },
    //     onSuccess: (res) => {
    //       localStorage.setItem("token", res.token);
    //       if (res.user.role === "buyer") {
    //         navigate("/users");
    //       }
    //       if (res.user.role === "admin") {
    //         navigate("/admin");
    //       }
    //       if (res.user.role === "seller") {
    //         navigate("/seller");
    //       }
    //       alert("Succes");
    //     },
    //     onError: (error) => {
    //       alert(error.message);
    //     },
    //   });
  }
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
    </div>
  );
};
export default Login;
