import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Drawer,
  Form,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminCorusel = () => {
  const [form] = useForm();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [choosedCorsel, setChoosedCorsel] = useState(null);
  const [choosedCorselImage, setChoosedCorselImage] = useState(null);

  /* ===================== GET ALL ===================== */
  const { data, isLoading } = useQuery({
    queryKey: ["admin-corusels"],
    queryFn: async () => {
      const res = await axios.get("https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/corusel");
      return res.data;
    },
  });
  /* ===================== GET ONE ===================== */
  const { data: coruselData } = useQuery({
    queryKey: ["admin-corusel-data", choosedCorsel],
    enabled: !!choosedCorsel,
    queryFn: async () => {
      const res = await axios.get(
        `https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/corusel/${choosedCorsel}`
      );
      return res.data;
    },
  });

  /* ===================== PUT ONE ===================== */
  const { mutate } = useMutation({
    mutationKey: "update-corusel",
    mutationFn: async (upProduct) =>
      axios.put(
        `https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/corusel/${choosedCorsel}`,
        upProduct
      ),
    onSuccess: () => {
      message.success("Mahsulot qo‘shildi!");
      queryClient.invalidateQueries(["admin-corusels"]);
      setOpen(false);
    },
  });

  /* ===================== ADD ===================== */
  const { mutate: addMuatate } = useMutation({
    mutationKey: "add-corusel-admin",
    mutationFn: async (data) =>
      axios.post(`https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/corusel/`, data),
    onSuccess: () => {
      message.success("Mahsulot qo‘shildi!");
      queryClient.invalidateQueries(["admin-corusels"]);
      setOpen(false);
    },
  });

  /* ===================== PUT ONE ===================== */
  const { mutate: deleteMuatate } = useMutation({
    mutationKey: "delete-corusel-admin",
    mutationFn: async (id) =>
      axios.delete(`https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/corusel/${id}`),
    onSuccess: () => {
      message.success("Mahsulot qo‘shildi!");
      queryClient.invalidateQueries(["admin-corusels"]);
      setOpen(false);
    },
  });

  /* ===================== EFFECT ===================== */
  useEffect(() => {
    if (open && edit && coruselData) {
      form.setFieldsValue(coruselData);
      setChoosedCorselImage(coruselData.image); // 🔥 EDIT PREVIEW
    }

    if (open && !edit) {
      form.resetFields();
      setChoosedCorselImage(null); // 🔥 ADD TOZALANADI
    }
  }, [open, edit, coruselData]);

  /* ===================== SUBMIT ===================== */
  const onFinish = (values) => {
    const payload = {
      ...values,
      image: choosedCorselImage,
    };

    if (edit) {
      mutate(payload);
    } else {
      console.log(payload);

      addMuatate(payload);
    }
  };

  /* ===================== UPLOAD ===================== */
  {
    // const uploadProps = {
    //   showUploadList: false,
    //   beforeUpload: (file) => {
    //     const isImage = file.type.startsWith("image/");
    //     if (!isImage) {
    //       message.error("Faqat rasm yuklash mumkin!");
    //       return false;
    //     }
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       setChoosedCorselImage(reader.result); // 🔥 PREVIEW
    //       form.setFieldValue("image", reader.result); // 🔥 FORM
    //     };
    //     reader.readAsDataURL(file);
    //     return false; // auto uploadni o‘chiradi
    //   },
    // };
  }

  /* ===================== TABLE ===================== */
  const columns = [
    {
      title: "Rasmi",
      dataIndex: "image",
      width: 222,
      render: (_, record) => {
        return <Image width={333} src={record?.image} alt="" />;
      },
    },
    { title: "Categorty", dataIndex: "category", width: 222 },
    {
      title: "Amallar",
      width: 222,
      render: (_, record) => {
        return (
          <>
            <Space>
              <Button
                onClick={() => {
                  setEdit(true);
                  setChoosedCorsel(record._id);
                  setOpen(true);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Foydalanuvchini o'chirasizmi?"
                onConfirm={() => {
                  deleteMuatate(record._id);
                }}
              >
                <Button danger onClick={() => {}}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </>
        );
      },
    },
  ];
  /* ===================== JSX ===================== */
  return (
    <>
      {/* {data && <Analytics />} */}

      <div className="flex justify-between mb-[15px]">
        <h2>Corusel</h2>
        <Button
          type="primary"
          onClick={() => {
            setEdit(false);
            setChoosedCorsel(null);
            setOpen(true);
          }}
        >
          Add Corusel
        </Button>
      </div>

      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        rowKey="_id"
        // style={{ width: "80%" }}
        className="mx-auto"
        scroll={{ x: 1000, y: 90 * 5 }}
      />

      <Drawer
        width={600}
        title={edit ? "Edit Corusel" : "Add Corusel"}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {edit ? "Yangilash" : "Qo‘shish"}
            </Button>
          </div>
        }
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* IMAGE */}
          <Form.Item label="Rasm" name="image" rules={[{ required: true }]}>
            <Input
              onChange={(e) => {
                setChoosedCorselImage(e.target.value);
              }}
            />
            {/* <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload> */}
          </Form.Item>

          {choosedCorselImage && (
            <Image src={choosedCorselImage} style={{ marginBottom: 16 }} />
          )}

          {/* CATEGORY */}
          <Form.Item
            label="Kategoriya"
            name="category"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default AdminCorusel;

{
  /* <Drawer
        title={!!edit ? "Add Coruseel" : ""}
        onClose={onClose}
        open={open}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button htmlType="submit" type="primary" onClick={() => {}}>
              Yangilash
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={coruselData}
        >
          <Form.Item
            label="Rasm"
            name="image"
            rules={[{ required: true, message: "Please input Corusel image!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Categoriyasi"
            name="category"
            rules={[
              { required: true, message: "Please input Corusel category!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer> */
}
