import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Form, message } from "antd";
import axios from "axios";
import { useEffect } from "react";

const ProfileP = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 1️⃣ Foydalanuvchi ma’lumotlarini olish
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["user-profile-data"],
    queryFn: async () => {
      const res = await axios.get("https://shopify-backend-vcnq.onrender.com/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    },
  });

  // 2️⃣ Profilni yangilash
  const { mutate, isLoading: updateLoading } = useMutation({
    mutationKey: ["user-profile-update"],
    mutationFn: async (updatedData) =>
      await axios.put(
        `https://shopify-backend-vcnq.onrender.com/api/users/${updatedData.id}`,
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

    mutate(payload);
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

        <Button
          type="primary"
          htmlType="submit"
          loading={updateLoading || queryLoading} // query yoki mutate loading
          block
        >
          Saqlash
        </Button>
      </Form>
    </div>
  );
};

export default ProfileP;

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Button, Input, Form, Card } from "antd";
// import axios from "axios";
// import { useEffect } from "react";

// const ProfileP = () => {
//   const [form] = Form.useForm();
//   const queryClient = useQueryClient();

//   const { data } = useQuery({
//     queryKey: ["user-profil-data"],
//     queryFn: async () => {
//       const res = await axios.get("https://shopify-backend-vcnq.onrender.com/api/users/me", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       return res.data;
//     },
//   });

//   const { mutate, isLoading: updateLoading } = useMutation({
//     mutationKey: ["user-profil-update"],
//     mutationFn: async (updatedData) =>
//       await axios.put(
//         `https://shopify-backend-vcnq.onrender.com/api/users/${updatedData.id}`,
//         updatedData
//       ),
//     onSuccess: () => {
//       message.success("Mahsulot qo‘shildi!");
//       queryClient.invalidateQueries(["user-profil-data"]);
//       setOpen(false);
//     },
//   });

//   useEffect(() => {
//     form.setFieldsValue({
//       email: data?.email,
//       createdAt: data?.createdAt,
//       email: data?.email,
//       fullName: data?.fullName,
//       role: data?.role,
//     });
//   }, [data]);

//   const onFinish = (values) => {
//     const payload = { id: data?._id, ...values };

//     if (!values?.password) {
//       delete payload.password;
//     }

//     mutate(payload);
//   };

//   return (
//     <div className="flex justify-center mt-10">
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         style={{ width: "555px" }}
//         initialValues={data}
//         className="h-[80vh] w-full flex flex-col items-center justify-center"
//       >
//         <Form.Item label="To'iq ism" name="fullName">
//           <Input style={{ width: "555px" }} />
//         </Form.Item>

//         <Form.Item label="Email" name="email">
//           <Input style={{ width: "555px" }} />
//         </Form.Item>

//         <Form.Item label="Ro'yhatdan o'tilgan kun" name="createdAt">
//           <Input style={{ width: "555px" }} />
//         </Form.Item>

//         <Form.Item label="New Password" name="password">
//           <Input.Password placeholder="Ixtiyoriy" style={{ width: "555px" }} />
//         </Form.Item>

//         <Button type="primary" htmlType="submit" loading={updateLoading} block>
//           Saqlash
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default ProfileP;
