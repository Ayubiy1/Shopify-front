import { useQuery } from "@tanstack/react-query";
import { Button, Col, Drawer, Row } from "antd";

import "./ProductsCard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DrawerProduct from "./DrawerProduct";
import api from "../../auth";

const ProductsCard = ({ categry_name, categry_path }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [choosedProduct, setChoosedProduct] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: "products-card",
    queryFn: async () => {
      const res = await api.get("/api/products/");

      return res.data;
      // return res.data.find((p) => p.isActive === true);
    },
  });

  const { data: productOneData } = useQuery({
    queryKey: ["product-name-id-drawer", choosedProduct],
    queryFn: async () => {
      if (!choosedProduct) return null;

      const res = await api.get(`/api/products/${choosedProduct}`);
      return res?.data;
    },
    enabled: !!choosedProduct, // ⭐ muhim
  });

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <h1 className="text-[25px] w-full" style={{ fontWeight: "bold" }}>
        {!isLoading && categry_name}
      </h1>

      <Row className="flex items-center mt-[-5px]">
        {data
          ?.filter((p) => p?.category == categry_path)
          ?.map((prduct, indx) => {
            return (
              <>
                <Col
                  span={12}
                  xs={{ span: 12 }}
                  md={{ span: 8 }}
                  lg={{ span: 6 }}
                  xl={{ span: 4 }}
                  key={indx}
                  style={{ padding: "10px" }}
                >
                  <div
                    className="overflow-hidden cursor-pointer"
                    style={{
                      borderRadius: "7px",
                      boxShadow: "0px 0px 8px -1px rgba(34, 60, 80, 0.18)",
                    }}
                    onClick={() => {}}
                  >
                    <img
                      src={prduct?.images?.[0]}
                      className="w-[100%] h-[260px] object-cover"
                      alt={prduct.name}
                      onClick={() => {
                        setChoosedProduct(prduct?._id);
                        navigate(`/users/${prduct?.name}/${prduct?._id}`);
                      }}
                    />
                    <div
                      className="flex itemscenter flex-col py-[5px] px-[11px]"
                      onClick={() => {
                        navigate(`/users/${prduct?.name}/${prduct?._id}`);
                      }}
                    >
                      <span className="font-bold">{prduct?.price} $</span>
                      <span className="line-through" style={{ color: "gray" }}>
                        {prduct?.price / 0.8} $
                      </span>
                      <span>{prduct?.name.slice(0, 20)}...</span>
                    </div>
                    <Button
                      type="primary"
                      className="w-full"
                      onClick={() => {
                        const token = localStorage.getItem("token");

                        if (!token) {
                          navigate("/login");
                        } else {
                          // showDrawer();
                          // setChoosedProduct(prduct?._id);
                        }
                      }}
                    >
                      Savatga qo'shish +
                    </Button>
                  </div>
                </Col>
                <DrawerProduct
                  onClose={onClose}
                  showDrawer={showDrawer}
                  open={open}
                  setOpen={setOpen}
                  id={prduct?._id}
                  imageIndex={0}
                  productOne={productOneData}
                />
              </>
            );
          })}
      </Row>
    </>
  );
};

export default ProductsCard;
