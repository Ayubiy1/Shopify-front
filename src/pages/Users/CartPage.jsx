import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { message, Table, Button, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const CartPage = () => {
  const token = localStorage.getItem("token");

  // 🛒 CART ITEMS OLIB KELISH
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["korzinka"],
    queryFn: async () => {
      const res = await axios.get("https://shopify-backend-vcnq.onrender.com/api/cart/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // token yuboriladi
        },
      });
      return res.data;
    },
  });

  // 🗑 CART ITEMni O‘CHIRISH
  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(`https://shopify-backend-vcnq.onrender.com/api/cart/${id}`),
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
      render: (_, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Image
            src={row.images?.[0]}
            width={60}
            height={60}
            style={{ borderRadius: 6 }}
          />
          <div>
            <strong>{row.title}</strong>
            <div style={{ fontSize: 13, color: "#555" }}>
              {row.combination?.color && <p>Rang: {row.combination.color}</p>}
              {row.combination?.size && <p>Size: {row.combination.size}</p>}
            </div>
          </div>
        </div>
      ),
    },

    {
      title: "Narx",
      dataIndex: "price",
      key: "price",
      render: (p) => `$${p}`,
    },

    {
      title: "Soni",
      dataIndex: "count",
      key: "count",
      render: (count) => `${count}`,
    },

    {
      title: "",
      key: "actions",
      render: (_, row) => (
        <Button
          danger
          type="primary"
          icon={<DeleteOutlined />}
          onClick={() => deleteMutation.mutate(row._id)}
        />
      ),
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-[24px] font-bold mb-4">🛒 Savatcha</h1>

      <Table
        loading={isLoading}
        dataSource={data}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />

      {/* TOTAL PRICE */}
      {data && data.length > 0 && (
        <div className="flex justify-end mt-5">
          <h2 className="text-xl font-bold">
            Jami: ${data.reduce((sum, item) => sum + item.price * 1, 0)}
          </h2>
        </div>
      )}
    </div>
  );
};

export default CartPage;
