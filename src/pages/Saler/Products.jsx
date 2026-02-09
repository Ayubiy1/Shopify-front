import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Drawer,
  Select,
  Form,
  Input,
  InputNumber,
  Collapse,
  Tag,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../auth";

const SellerProducts = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [productId, setProductId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkUser = async () => {
    try {
      const res = await api.get("/api/auth/me", {
        withCredentials: true, // cookie yuboriladi
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["seller-products", user, loading],
    queryFn: async () => {
      checkUser();
      const res = await api.get(`/api/products/seller`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res?.data;
      // return res?.data?.filter((sp) => sp.owner === user?.additionId);
    },
    onSuccess: (res) => {},
    onError: (error) => {},
  });

  // Add Product By Seller
  const { mutate: addProduct, isLoading: addPrdctIsLoading } = useMutation({
    mutationFn: async (newProduct) => api.post("/api/products", newProduct),

    onSuccess: () => {
      alert("Mahsulot qo‘shildi!");
      message.success("Mahsulot qo‘shildi!");
      queryClient.invalidateQueries(["seller-products"]);
      setOpen(false);
    },
  });

  const { mutate: editProduct, isLoading: editPrdctIsLoading } = useMutation({
    mutationFn: async (newProduct) =>
      api.put(`/api/products/${newProduct?._id}`, newProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),

    onSuccess: () => {
      alert("Mahsulot yangilandi!");
      message.success("Mahsulot yangilandi!");
      queryClient.invalidateQueries(["seller-products"]);
      setOpen(false);
    },
  });

  const { mutate: editProducta } = useMutation({
    mutationFn: async (newProduct) => api.post(`/api/products/`, newProduct),

    onSuccess: () => {
      alert("Mahsulot qo‘shildi!");
      message.success("Mahsulot qo‘shildi!");
      queryClient.invalidateQueries(["seller-products"]);
      setOpen(false);
    },
  });

  const generateVariants = () => {
    const options = form.getFieldValue("options");

    if (!options || options.length === 0) {
      return message.error("Options mavjud emas!");
    }

    const colorOption = options.find((o) => o.name === "color");
    const sizeOption = options.find((o) => o.name === "size");

    if (!colorOption || !sizeOption) {
      return message.error("Color va Size option bo'lishi shart!");
    }

    const colors = colorOption.values || [];
    const sizes = sizeOption.values || [];

    if (!colors.length || !sizes.length) {
      return message.error("Color va Size values bo‘sh bo‘lmasligi kerak!");
    }

    const variants = [];

    colors.forEach((c) => {
      sizes.forEach((s) => {
        variants.push({
          combination: { color: c, size: s },
          price: 0,
          stock: 0,
          images: [],
        });
      });
    });

    form.setFieldsValue({ variants });
    message.success("Variants generatsiya qilindi!");
  };

  const onFinish = (values) => {
    checkUser();
    console.log(values);

    // if (isEdit) editProduct(values);
    // else
    addProduct({
      ...values,
      owner: user?.additionId,
    });
    console.log({
      ...values,
      owner: user?.additionId,
    });
  };

  const openAddDrawer = () => {
    setOpen(true);
    form.resetFields();

    form.setFieldsValue({
      options: [
        { name: "color", values: [] },
        { name: "size", values: [] },
      ],
      variants: [
        {
          combination: { color: "", size: "" },
          price: 0,
          stock: 0,
          images: [],
        },
      ],
    });
  };

  const handleChange = ({ value, id, record }) => {
    editProduct({ ...record, isActive: value === "active" ? true : false });

    console.log(`selected ${value}`);
    console.log(id);
  };

  const columns = [
    {
      title: "Rasm",
      dataIndex: "images",
      render: (images) =>
        images?.length ? (
          <img src={images[0]} width={60} style={{ borderRadius: 8 }} />
        ) : (
          "No image"
        ),
    },
    {
      title: "Nomi",
      dataIndex: "name",
      fixed: "left",
      with: 222,
    },
    {
      title: "Kategoriya",
      dataIndex: "category",
      filters: data
        ? Array.from(
            new Set(
              data?.map(
                (prdct) =>
                  prdct.category && prdct.category.trim() !== ""
                    ? prdct.category
                    : "No category", // ✔ bo‘shlarni ham qo‘shadi
              ),
            ),
          )?.map((name) => ({
            text: name,
            value: name,
          }))
        : [],
      filteredValue: [],
      // filteredInfo?.category || [],
      onFilter: (value, record) => {
        const realCategory =
          record?.category && record?.category.trim() !== ""
            ? record.category
            : "No category";

        return realCategory === value;
      },
      // onFilter: (value, record) => record?.category === value,
    },
    {
      title: "Narx",
      dataIndex: "price",
      render: (p) => `${p.toLocaleString("uz-UZ")} so'm`,
      sorter: (a, b) => a?.price - b?.price,
    },
    {
      title: "Variants",
      dataIndex: "variants",
      render: (_, record) => {
        const totalStock =
          record?.variants?.reduce((sum, v) => sum + (v?.stock || 0), 0) || 0;

        return (
          <div>
            <div>Variants: {record?.variants?.length || 0} ta</div>
            <div>All stock: {totalStock} ta qoldi</div>
          </div>
        );
      },
      sorter: (a, b) => a?.variants?.length - b?.variants?.length,
    },
    {
      title: "Variants",
      dataIndex: "variants",
      render: (_, record) => {
        setProductId(record?._id);

        return (
          <>
            W{/* <Tag color={record?.isActive ? "green" : "red"}></Tag> */}
            <Select
              defaultValue={record?.isActive ? "Active" : "No Active"}
              style={{ width: 120 }}
              onChange={(value) => {
                handleChange({ value, id: record?._id, record });
              }}
              options={[
                { value: "active", label: "Active" },
                { value: "no-ctive", label: "No Active" },
              ]}
            />
          </>
        );
      },
    },
    {
      title: "Amallar",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEditDrawer(record._id)}>Edit</Button>

          <Popconfirm
            title="Mahsulotni o'chirasizmi?"
            onConfirm={() => deleteProduct(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-[15px]">
        <h3>All Products</h3>

        <Button onClick={openAddDrawer}>Add Product</Button>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading || isLoading}
        rowKey="_id"
        bordered
        // onChange={handleChange}
        pagination={false}
        scroll={{ x: 1000, y: 131 * 5 }}
      />

      {/* 7b 39 */}

      {/* Add Product */}
      <Drawer
        width={800}
        title={isEdit ? "Edit Product" : "Add Product"}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {addPrdctIsLoading ? "Loading..." : "Done"}
            </Button>
          </div>
        }
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Product name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Categories name"
            name="category"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Categories Path"
            name="slug"
            rules={[{ required: true }]}
          >
            <Input placeholder="category-path" />
          </Form.Item>

          <Form.Item
            label="Base price"
            name="price"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* FIXED: field error removed */}
          <Form.Item label="Product Images (array)" name="images">
            <Select mode="tags" placeholder="Image URLs" />
          </Form.Item>

          <Collapse>
            <Collapse.Panel header="Options (Color / Size)" key="1">
              <Form.List name="options">
                {(fields) =>
                  fields.map((field) => (
                    <div key={field.key} className="mb-3 p-3 border rounded">
                      <Form.Item
                        label="Option name"
                        name={[field.name, "name"]}
                      >
                        <Input disabled />
                      </Form.Item>

                      <Form.Item label="Values" name={[field.name, "values"]}>
                        <Select mode="tags" />
                      </Form.Item>
                    </div>
                  ))
                }
              </Form.List>
            </Collapse.Panel>

            <Collapse.Panel header="Variants" key="2">
              <Button
                type="dashed"
                onClick={generateVariants}
                block
                style={{ marginBottom: 15 }}
              >
                Generate Variants
              </Button>

              <Form.List name="variants">
                {(fields) =>
                  fields.map((field) => (
                    <div
                      key={field.key}
                      className="mb-3 p-3 border rounded bg-gray-50"
                    >
                      <Form.Item
                        label="Color"
                        name={[field.name, "combination", "color"]}
                      >
                        <Input disabled />
                      </Form.Item>

                      <Form.Item
                        label="Size"
                        name={[field.name, "combination", "size"]}
                      >
                        <Input disabled />
                      </Form.Item>

                      <Form.Item label="Price" name={[field.name, "price"]}>
                        <InputNumber className="w-full" />
                      </Form.Item>

                      <Form.Item label="Stock" name={[field.name, "stock"]}>
                        <InputNumber className="w-full" min={0} />
                      </Form.Item>

                      <Form.Item label="Images" name={[field.name, "images"]}>
                        <Select mode="tags" />
                      </Form.Item>
                    </div>
                  ))
                }
              </Form.List>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </Drawer>
    </>
  );
};

export default SellerProducts;
