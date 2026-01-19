import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterSeller = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState();
  const [errors, setErrors] = useState();

  const { mutate: mutateRegister } = useMutation({
    mutationFn: async (newUser) => {
      const res = await axios.post(
        "http://https://angry-korie-developerayubiy-4da36956.koyeb.app/api/auth/register",
        newUser,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      navigate("/login");
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (newSeller) => {
      const res = await axios.post(
        "http://https://angry-korie-developerayubiy-4da36956.koyeb.app/api/sellers/add",
        newSeller,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      mutateRegister({ ...registerData, additionId: res._id });
      navigate("/login");
      alert("Registered");
    },
    onError: (res) => {
      setErrors(res?.response?.data);

      const errors = res.response?.data?.errors;

      if (errors) {
        form.setFields(
          Object.entries(errors).map(([field, message]) => ({
            name: field,
            errors: [message],
          }))
        );
      }
    },
  });

  const onFinish = (values) => {
    mutate({ ...values, role: "seller" });
    setRegisterData({
      email: values?.email,
      fullName: values?.name,
      role: "seller",
      password: values.password,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "110%",
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 777 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Full Name"
          name="name"
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
          label="Shop nomi"
          name="shopName"
          rules={[{ required: true, message: "Please input your shop name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Shop tavsifi"
          name="shopDescription"
          rules={[
            { required: true, message: "Please input your shop description!" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Parol"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password min={6} />
        </Form.Item>

        <Form.Item
          label="Telefon nomer"
          name="phone"
          rules={[{ required: true, message: "Please input your phone!" }]}
        >
          <Input type="number" placeholder="+998 00 000 00 00" min={12} />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {isLoading ? "Loaging..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default RegisterSeller;
