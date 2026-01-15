import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Form, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Resend } from "resend";

const resend = new Resend("re_fSLgK9hM_CP52dMrd7M4Hbq812zKM3Lrb");
const ProfileP = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1️⃣ Foydalanuvchi ma’lumotlarini olish
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["user-profile-data"],
    queryFn: async () => {
      const res = await axios.get(
        "https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res.data;
    },
  });

  // 2️⃣ Profilni yangilash
  const { mutate, isLoading: updateLoading } = useMutation({
    mutationKey: ["user-profile-update"],
    mutationFn: async (updatedData) =>
      await axios.put(
        `https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/users/${updatedData.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ),
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
    if (!data?._id) return; // ID bo‘lmasa mutate chaqirmaymiz

    const payload = { id: data._id, ...values };

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
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ width: "555px" }}
        className="h-[80vh] w-full flex flex-col items-center justify-center"
      >
        <Form.Item label="To'liq ism" name="fullName">
          <Input style={{ width: "555px" }} />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input style={{ width: "555px" }} />
        </Form.Item>

        <Form.Item label="Ro'yhatdan o'tilgan kun" name="createdAt">
          <Input style={{ width: "555px" }} disabled />
        </Form.Item>

        <Form.Item label="New Password" name="password">
          <Input.Password placeholder="Ixtiyoriy" style={{ width: "555px" }} />
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
      </Form>
    </div>
  );
};

export default ProfileP;
