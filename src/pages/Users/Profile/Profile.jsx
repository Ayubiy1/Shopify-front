import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Form, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Resend } from "resend";
import api from "../../../auth";

const resend = new Resend("re_fSLgK9hM_CP52dMrd7M4Hbq812zKM3Lrb");
const ProfileP = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "This is a warning message",
    });
  };

  // 1️⃣ Foydalanuvchi ma’lumotlarini olish
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["user-profile-data"],
    queryFn: async () => {
      const res = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    },
  });
  console.log(data);

  // 2️⃣ Profilni yangilash
  const { mutate, isLoading: updateLoading } = useMutation({
    mutationKey: ["user-profile-update-data"],
    mutationFn: async (updatedData) =>
      await api.put(`/api/users/${updatedData.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    onSuccess: () => {
      message.success("Profil yangilandi!");
      queryClient.invalidateQueries(["user-profile-data"]); // query ni yangilash
    },
    onError: (err) => {
      message.error("Xatolik yuz berdi!");
      console.error(err);
    },
  });

  // 3️⃣ Query dan ma’lumot kelganda formga set qilish
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        fullName: data.fullName,
        email: data.email,
        createdAt: data.createdAt,
        role: data.role,
      });
    }
  }, [data, form]);

  const onFinish = (values) => {
    // console.log("ad");
    console.log(values);
    console.log(data);

    if (!data?.id) warning(); // ID bo‘lmasa mutate chaqirmaymiz

    const payload = { id: data.id, ...values };

    if (!values.password) delete payload.password; // password bo‘lsa jo‘natamiz

    console.log(payload);

    mutate(payload);
  };

  const sentMessageEmail = ({ email }) => {
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });
  };

  return (
    <div className="flex justify-center mt-10">
      {contextHolder}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="h-[80vh] sm:w-[333px] md:w-[555px] flex flex-col items-center justify-center"
      >
        <Form.Item label="To'liq ism" name="fullName" className="w-full">
          <Input className="w-full" />
        </Form.Item>

        <Form.Item label="Email" name="email" className="w-full">
          <Input className="w-full" />
        </Form.Item>

        <Form.Item
          label="Ro'yhatdan o'tilgan kun"
          name="createdAt"
          className="w-full"
        >
          <Input disabled className="w-full" />
        </Form.Item>

        <Form.Item label="New Password" name="password" className="w-full">
          <Input.Password className="w-full" />
        </Form.Item>

        <div className="w-full flex gap-2 mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={updateLoading || queryLoading}
            className="w-2/3"
            // onClick={() => {
            //   console.log("a");
            //   onFinish();
            // }}
          >
            Saqlash
          </Button>

          <Button
            className="w-1/3"
            onClick={() => {
              navigate("/login");
              localStorage.clear();
            }}
          >
            Log Out
          </Button>
        </div>
      </Form>
      <div className="flex justify-center items-center mt-10"></div>
    </div>
  );
};

export default ProfileP;

{
  /* <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="h-[80vh] w-[555px] flex flex-col items-center justify-center"
      >
        <Form.Item label="To'liq ism" name="fullName">
          <Input className="w-[333px] md:w-[555px]" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input className="w-[333px] md:w-[555px]" />
        </Form.Item>

        <Form.Item label="Ro'yhatdan o'tilgan kun" name="createdAt">
          <Input className="w-[333px] md:w-[555px]" disabled />
        </Form.Item>

        <Form.Item label="New Password" name="password">
          <Input.Password
            placeholder="Ixtiyoriy"
            className="w-[333px] md:w-[555px]"
          />
        </Form.Item>

        <div className="w-[100%] flex gap-2 items-center justify-center">
          <Button
            className="w-[66%]"
            type="primary"
            htmlType="submit"
            loading={updateLoading || queryLoading} // query yoki mutate loading
            block
          >
            Saqlash
          </Button>
          <Button
            className="w-[34%]"
            onClick={() => {
              navigate("/login");
              localStorage.clear();
            }}
          >
            Log Out
          </Button>
        </div>
      </Form> */
}
