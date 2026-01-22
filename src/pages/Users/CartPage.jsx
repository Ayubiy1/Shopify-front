import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  message,
  Table,
  Button,
  Image,
  Drawer,
  Typography,
  Select,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import "./style.css";
import api from "../../auth";

const CartPage = () => {
  const [open, setOpen] = useState(false);
  const [payWay, setPayWay] = useState("");
  const [productId, setProductId] = useState(null);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  // 🛒 CART ITEMS OLIB KELISH
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["korzinka"],
    queryFn: async () => {
      const res = await api.get("/api/cart/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // token yuboriladi
        },
      });
      return res.data;
    },
  });

  console.log(data);

  // Korzinkadagi 1ta productni olish
  const { data: productData, isLoading: productIsloading } = useQuery({
    queryKey: ["product-data-by-id", open, productId],
    queryFn: async () => {
      const res = await api.get(`/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // token yuboriladi
        },
      });

      return res.data;
    },
  });

  // Productni sotib olish uchn
  const { mutate: buyMutation } = useMutation({
    mutationFn: async (data) => {
      console.log(data);

      return api.post(`/api/cart/buy`, data);
    },
    onSuccess: () => {
      deleteMutation(productId);
      alert("Muvaffaqqitalik sotib olindi!");
      setOpen(false);
      refetch(); // table yangilansin
    },
  });

  // 🗑 CART ITEMni O‘CHIRISH
  const { mutate: deleteMutation, isLoading: deleteisLoading } = useMutation({
    mutationFn: async (id) => api.delete(`/api/cart/remove/${id}`),
    onSuccess: () => {
      message.success("O‘chirildi!");
      refetch(); // table yangilansin
    },
  });

  const columns = [
    {
      title: "Mahsulot",
      dataIndex: "title",
      key: "title",
      render: (_, row) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Image
              src={row.images?.[0] || "Shopping UZ"}
              width={100}
              height={100}
              style={{ borderRadius: 6 }}
              alt={row?.title}
            />
            <div>
              <strong>{row.title}</strong>
              <div style={{ fontSize: 13, color: "#555" }}>
                {row.combination?.color && <p>Rang: {row.combination.color}</p>}
                {row.combination?.size && <p>Size: {row.combination.size}</p>}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Narx",
      dataIndex: "price",
      key: "price",
      render: (p, _) => {
        return `${p.toLocaleString("uz-UZ")} so'm`;
      },
    },
    {
      title: "Soni",
      dataIndex: "count",
      key: "count",
      render: (count) => `${count}`,
    },
    {
      title: "Jami",
      key: "count",
      render: (_, record) =>
        `${(record?.price * record?.count).toLocaleString("uz-UZ")} so'm`,
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteMutation(row._id);
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                setProductId(row?._id);
                if (!productIsloading) showDrawer();
              }}
            >
              {productIsloading ? "Loading..." : "Buy"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-[24px] font-bold mb-4">🛒 Savatcha</h1>

      <Table
        loading={isLoading || deleteisLoading}
        dataSource={data}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />

      {/* TOTAL PRICE */}
      {data && data.length > 0 && (
        <div className="flex justify-end mt-5">
          <h2 className="text-xl font-bold">
            Jami:{" "}
            {data
              .reduce((sum, item) => sum + item.price * item?.count, 0)
              .toLocaleString("uz-UZ")}{" "}
            so'm
          </h2>
        </div>
      )}

      <Drawer
        height={444}
        title="Basic Drawer"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                console.log(productData);

                if (!payWay) alert("Tolov turini tanlang!");
                console.log({
                  product: productData?.productId,
                  variantId: productData?.variantId,
                  quantity: productData?.count,
                  variants: productData?.combination,
                  totalPrice: productData?.count * productData?.price,
                  paymentMethod: payWay,
                });

                buyMutation({
                  product: productData?.productId,
                  variantId: productData?.variantId,
                  quantity: productData?.count,
                  variants: productData?.combination,
                  totalPrice: productData?.count * productData?.price,
                  paymentMethod: payWay,
                });
              }}
            >
              Buy
            </Button>
          </div>
        }
      >
        <div className="flex justify-center flex-col">
          <Typography>
            <span style={{ fontWeight: "bold" }}>Nomi: </span>
            {productData?.title}
          </Typography>
          <p className="m-0">
            <span style={{ fontWeight: "bold" }}>Narxi :</span>
            {productData?.price}
          </p>
          <p className="m-0">
            <span style={{ fontWeight: "bold" }}>Soni: </span>
            {productData?.count}
          </p>
          <p className="m-0">
            <span style={{ fontWeight: "bold" }}>Jami: </span>
            {productData?.count * productData?.price}$
          </p>
          <div>
            <Image
              width={100}
              height={150}
              className="object-cover"
              src={productData?.images[0]}
            />
            {productData?.images[1] && (
              <Image
                width={100}
                height={150}
                className="object-cover"
                src={productData?.images[1]}
              />
            )}
          </div>

          <Select
            defaultValue="Tolov turini tanlang"
            onChange={setPayWay}
            options={[
              { value: "karta", label: "Karta" },
              { value: "naqt", label: "Olaganda to'lash" },
            ]}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default CartPage;
