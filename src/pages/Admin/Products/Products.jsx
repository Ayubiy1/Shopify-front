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

  // ALL PRODUCTS
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/products");
      return res.data;
    },
  });

  // PRODUCT FOR EDIT
  const { data: productData } = useQuery({
    queryKey: ["admin-product-edit", productId],
    queryFn: async () => {
      if (!productId) return null;
      const res = await axios.get(
        `http://localhost:3000/api/products/${productId}`
      );
      return res.data;
    },
    enabled: !!productId,
  });

  // ADD PRODUCT
  const { mutate: addProduct } = useMutation({
    mutationFn: async (newProduct) =>
      axios.post("http://localhost:3000/api/products", newProduct),

    onSuccess: () => {
      message.success("Mahsulot qo‘shildi!");
      queryClient.invalidateQueries(["admin-products"]);
      setOpen(false);
    },
  });

  // EDIT PRODUCT
  const { mutate: editProduct } = useMutation({
    mutationFn: async (updated) =>
      axios.put(`http://localhost:3000/api/products/${productId}`, updated),

    onSuccess: () => {
      message.success("Mahsulot yangilandi!");
      queryClient.invalidateQueries(["admin-products"]);
      setOpen(false);
    },
  });

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
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
    },
    {
      title: "Kategoriya",
      dataIndex: "category",
    },
    {
      title: "Narx",
      dataIndex: "price",
      render: (p) => `$${p}`,
    },
    {
      title: "Variants",
      render: (_, record) => record?.variants?.length,
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

            {/* <Collapse.Panel header="Variants" key="2">
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
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Size"
                        name={[field.name, "combination", "size"]}
                      >
                        <Input />
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
            </Collapse.Panel> */}
          </Collapse>
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminProducts;

{
  //   import { useEffect, useState } from "react";
  //   import {
  //     Table,
  //     Button,
  //     Space,
  //     Popconfirm,
  //     message,
  //     Drawer,
  //     Select,
  //     Form,
  //     Input,
  //     InputNumber,
  //     Collapse,
  //   } from "antd";
  //   import { useNavigate } from "react-router-dom";
  //   import axios from "axios";
  //   import { useMutation, useQuery } from "@tanstack/react-query";
  //   const AdminProducts = () => {
  //     const navigate = useNavigate();
  //     const [form] = Form.useForm();
  //     const [products, setProducts] = useState([]);
  //     const [productId, setProductId] = useState([]);
  //     const [open, setOpen] = useState(false);
  //     const { data, isLoading } = useQuery({
  //       queryKey: "admin-products",
  //       queryFn: async () => {
  //         const res = await axios.get("http://localhost:3000/api/products");
  //         return res.data;
  //       },
  //     });
  //     const { data: productData, isLoading: loadingg } = useQuery({
  //       queryKey: ["admin-product-edit", productId],
  //       queryFn: async () => {
  //         const res = await axios.get(
  //           `http://localhost:3000/api/products/${productId}`
  //         );
  //         return res.data;
  //       },
  //     });
  //     const { mutate: editMuate } = useMutation({
  //       mutationKey: ["admin-edit-product", productId],
  //       mutationFn: async (updatedDate) => {
  //         const upDate = axios.put(
  //           `http://localhost:3000/api/products/${productId}`,
  //           updatedDate
  //         );
  //         return upDate;
  //       },
  //     });
  //     const deleteProduct = async (id) => {
  //       try {
  //         await axios.delete(`http://localhost:3000/api/products/${id}`);
  //         message.success("Mahsulot o'chirildi!");
  //       } catch (error) {
  //         message.error("Xatolik!");
  //       }
  //     };
  //     useEffect(() => {
  //       if (productData) {
  //         form.setFieldsValue({
  //           name: productData.name,
  //           price: productData.price,
  //           description: productData.description,
  //           images: productData.images,
  //           options: productData.options,
  //           variants: productData.variants,
  //         });
  //       }
  //     }, [productData]);
  //     const showDrawer = () => {
  //       setOpen(true);
  //     };
  //     const onClose = () => {
  //       setOpen(false);
  //     };
  //     const onFinish = async (values) => {
  //       console.log(values);
  //       editMuate(values);
  //     };
  //     const columns = [
  //       {
  //         title: "Rasm",
  //         dataIndex: "images",
  //         render: (images) => (
  //           <img src={images[0]} alt="" width={60} style={{ borderRadius: 8 }} />
  //         ),
  //       },
  //       {
  //         title: "Nomi",
  //         dataIndex: "name",
  //       },
  //       {
  //         title: "Kategoriya",
  //         dataIndex: "category",
  //       },
  //       {
  //         title: "Narx",
  //         dataIndex: "price",
  //         render: (p) => `$${p}`,
  //       },
  //       {
  //         title: "Variants",
  //         render: (_, record) => record?.variants?.length,
  //       },
  //       {
  //         title: "Amallar",
  //         render: (_, record) => (
  //           <Space>
  //             <Button
  //               onClick={() => {
  //                 showDrawer();
  //                 setProductId(record?._id);
  //                 //   navigate(`/admin/products/edit/${record?._id}`);
  //               }}
  //             >
  //               Edit
  //             </Button>
  //             <Popconfirm
  //               title="Mahsulotni o'chirasizmi?"
  //               onConfirm={() => deleteProduct(record?._id)}
  //             >
  //               <Button danger>Delete</Button>
  //             </Popconfirm>
  //           </Space>
  //         ),
  //       },
  //     ];
  //     return (
  //       <div>
  //         <div
  //           style={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             marginBottom: 20,
  //           }}
  //         >
  //           <h2>Products</h2>
  //           <Button type="primary" onClick={() => showDrawer()}>
  //             Add Product
  //           </Button>
  //         </div>
  //         <Table
  //           dataSource={data}
  //           columns={columns}
  //           loading={isLoading}
  //           rowKey="_id"
  //           bordered
  //         />
  //         <Drawer
  //           width={600}
  //           title="Edit product"
  //           open={open}
  //           onClose={onClose}
  //           footer={
  //             <div className="flex justify-end gap-3">
  //               <Button onClick={onClose}>Bekor qilish</Button>
  //               <Button type="primary" onClick={() => form.submit()}>
  //                 Saqlash
  //               </Button>
  //             </div>
  //           }
  //         >
  //           <Form layout="vertical" form={form} onFinish={onFinish}>
  //             {/* Name */}
  //             <Form.Item label="Product name" name="name">
  //               <Input />
  //             </Form.Item>
  //             {/* Price */}
  //             <Form.Item label="Base price" name="price">
  //               <InputNumber className="w-full" min={1} />
  //             </Form.Item>
  //             {/* Description */}
  //             <Form.Item label="Description" name="description">
  //               <Input.TextArea rows={3} />
  //             </Form.Item>
  //             {/* Images */}
  //             <Form.Item label="Product Images (array)" name="images">
  //               <Select mode="tags" placeholder="Image URLs" />
  //             </Form.Item>
  //             {/* Options (Color / Size) */}
  //             <Collapse>
  //               <Collapse.Panel header="Options (Color / Size)" key="1">
  //                 <Form.List name="options">
  //                   {(fields) =>
  //                     fields.map((field) => (
  //                       <div key={field.key} className="mb-3 p-3 border rounded">
  //                         <Form.Item
  //                           {...field}
  //                           label="Option name"
  //                           name={[field.name, "name"]}
  //                         >
  //                           <Input disabled />
  //                         </Form.Item>
  //                         <Form.Item
  //                           {...field}
  //                           label="Values"
  //                           name={[field.name, "values"]}
  //                         >
  //                           <Select mode="tags" />
  //                         </Form.Item>
  //                       </div>
  //                     ))
  //                   }
  //                 </Form.List>
  //               </Collapse.Panel>
  //               {/* Variants */}
  //               <Collapse.Panel header="Variants" key="2">
  //                 <Form.List name="variants">
  //                   {(fields) =>
  //                     fields.map((field) => (
  //                       <div
  //                         key={field.key}
  //                         className="mb-3 p-3 border rounded bg-gray-50"
  //                       >
  //                         {/* Color */}
  //                         <Form.Item
  //                           label="Color"
  //                           name={[field.name, "combination", "color"]}
  //                         >
  //                           <Input />
  //                         </Form.Item>
  //                         {/* Size */}
  //                         <Form.Item
  //                           label="Size"
  //                           name={[field.name, "combination", "size"]}
  //                         >
  //                           <Input />
  //                         </Form.Item>
  //                         {/* Variant Price */}
  //                         <Form.Item label="Price" name={[field.name, "price"]}>
  //                           <InputNumber className="w-full" />
  //                         </Form.Item>
  //                         {/* Stock */}
  //                         <Form.Item label="Stock" name={[field.name, "stock"]}>
  //                           <InputNumber className="w-full" min={0} />
  //                         </Form.Item>
  //                         {/* Variant Images */}
  //                         <Form.Item label="Images" name={[field.name, "images"]}>
  //                           <Select mode="tags" />
  //                         </Form.Item>
  //                       </div>
  //                     ))
  //                   }
  //                 </Form.List>
  //               </Collapse.Panel>
  //             </Collapse>
  //           </Form>
  //         </Drawer>
  //       </div>
  //     );
  //   };
  //   export default AdminProducts;
}
{
  //   <Drawer
  //     title="Edit Product"
  //     onClose={onClose}
  //     open={open}
  //     width={500}
  //     extra={
  //       <Button onClick={() => form.submit()} type="primary">
  //         Save
  //       </Button>
  //     }
  //   >
  //     {loadingg ? (
  //       <Spin size="large" />
  //     ) : (
  //       <Form
  //         form={form}
  //         layout="vertical"
  //         initialValues={productData}
  //         onFinish={onFinish}
  //       >
  //         <Form.Item
  //           label="Product Name"
  //           name="name"
  //           rules={[{ required: true }]}
  //         >
  //           <Input />
  //         </Form.Item>
  //         <Form.Item
  //           label="Category"
  //           name="category"
  //           rules={[{ required: true }]}
  //         >
  //           <Input />
  //         </Form.Item>
  //         <Form.Item label="Price" name="price" rules={[{ required: true }]}>
  //           <InputNumber style={{ width: "100%" }} min={0} />
  //         </Form.Item>
  //         <Form.Item label="Description" name="description">
  //           <Input.TextArea rows={4} />
  //         </Form.Item>
  //         {/* Images Array */}
  //         <Form.List name="images">
  //           {(fields, { add, remove }) => (
  //             <>
  //               <label>Images</label>
  //               {fields.map(({ key, name }) => (
  //                 <div
  //                   key={key}
  //                   style={{ display: "flex", gap: 10, marginBottom: 10 }}
  //                 >
  //                   <Form.Item
  //                     name={name}
  //                     style={{ flex: 1 }}
  //                     rules={[{ required: true, message: "Image URL kiriting!" }]}
  //                   >
  //                     <Input placeholder="Image URL" />
  //                   </Form.Item>
  //                   <Button danger onClick={() => remove(name)}>
  //                     Delete
  //                   </Button>
  //                 </div>
  //               ))}
  //               <Button type="dashed" onClick={() => add()}>
  //                 + Add Image
  //               </Button>
  //             </>
  //           )}
  //         </Form.List>
  //       </Form>
  //     )}
  //   </Drawer>;
}
