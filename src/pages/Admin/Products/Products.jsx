import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Drawer,
  Select,
  Form,
  Input,
  InputNumber,
  Collapse,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [productId, setProductId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});

  // ALL PRODUCTS
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axios.get(
        "https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/products",
        { withCredentials: true }
      );
      return res.data;
    },
  });

  // PRODUCT FOR EDIT
  const { data: productData } = useQuery({
    queryKey: ["admin-product-edit", productId],
    queryFn: async () => {
      if (!productId) return null;
      const res = await axios.get(
        `https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/products/${productId}`,
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !!productId,
  });

  // ADD PRODUCT
  const { mutate: addProduct, isLoading: addPrdctIsLoading } = useMutation({
    mutationFn: async (newProduct) =>
      axios.post(
        "https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/products",
        newProduct,
        { withCredentials: true }
      ),

    onSuccess: () => {
      message.success("Mahsulot qo‘shildi!");
      queryClient.invalidateQueries(["admin-products"]);
      setOpen(false);
    },
  });

  // EDIT PRODUCT
  const { mutate: editProduct } = useMutation({
    mutationFn: async (updated) =>
      axios.put(
        `https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/products/${productId}`,
        updated,
        { withCredentials: true }
      ),

    onSuccess: () => {
      message.success("Mahsulot yangilandi!");
      queryClient.invalidateQueries(["admin-products"]);
      setOpen(false);
    },
  });

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/products/${id}`,
        { withCredentials: true }
      );
      message.success("Mahsulot o‘chirildi!");
      queryClient.invalidateQueries(["admin-products"]);
    } catch (error) {
      message.error("Xatolik!");
    }
  };

  // FILL FORM WHEN EDIT
  useEffect(() => {
    if (productData && isEdit) {
      form.setFieldsValue({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        images: productData.images,
        options: productData.options,
        variants: productData.variants,
      });
    }
  }, [productData, isEdit]);

  // OPEN ADD DRAWER
  const openAddDrawer = () => {
    setIsEdit(false);
    setProductId(null);
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

  const openEditDrawer = (id) => {
    setIsEdit(true);
    setProductId(id);
    setOpen(true);
  };

  const onFinish = (values) => {
    console.log(values);

    if (isEdit) editProduct(values);
    else
      addProduct({
        ...values,
        category: "clothes",
        categoryId: "66cae2222222222222222222",
      });
  };

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

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
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
              data.map(
                (prdct) =>
                  prdct.category && prdct.category.trim() !== ""
                    ? prdct.category
                    : "No category" // ✔ bo‘shlarni ham qo‘shadi
              )
            )
          ).map((name) => ({
            text: name,
            value: name,
          }))
        : [],
      filteredValue: filteredInfo?.category || [],
      onFilter: (value, record) => {
        const realCategory =
          record.category && record.category.trim() !== ""
            ? record.category
            : "No category";

        return realCategory === value;
      },
      // onFilter: (value, record) => record?.category === value,
    },
    {
      title: "Narx",
      dataIndex: "price",
      render: (p) => `$${p}`,
      sorter: (a, b) => a?.price - b?.price,
    },
    {
      title: "Variants",
      dataIndex: "variants",
      render: (_, record) => record?.variants?.length,
      sorter: (a, b) => a?.variants?.length - b?.variants?.length,
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Products</h2>
        <Button type="primary" onClick={openAddDrawer}>
          Add Product
        </Button>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
        bordered
        onChange={handleChange}
        pagination={false}
        scroll={{ x: 1000, y: 131 * 5 }}
      />

      {/* DRAWER */}
      <Drawer
        width={600}
        title={isEdit ? "Edit Product" : "Add Product"}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {isEdit ? "Yangilash" : "Qo‘shish"}
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
    </div>
  );
};

export default AdminProducts;
