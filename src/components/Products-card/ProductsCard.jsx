import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row } from "antd";
import axios from "axios";

import "./ProductsCard.css";
import { useNavigate } from "react-router-dom";

const ProductsCard = ({ categry_name, categry_path }) => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: "products-card",
    queryFn: async () => {
      const res = await axios.get(
        "https://shopify-backend-vcnq.onrender.com/api/products/"
      );

      return res;
    },
  });

  return (
    <>
      <h1>{categry_name}</h1>

      <Row className="flex items-center mt-[20px]">
        {data?.data
          .filter((p) => p.category == categry_path)
          ?.map((prduct, indx) => {
            return (
              <Col
                span={12}
                xs={{ span: 12 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                xl={{ span: 6 }}
                key={indx}
                style={{ padding: "10px" }}
              >
                <div
                  className="overflow-hidden cursor-pointer"
                  style={{
                    borderRadius: "7px",
                    boxShadow: "0px 0px 8px -1px rgba(34, 60, 80, 0.18)",
                  }}
                  onClick={() => {
                    navigate(`/users/${prduct?.name}/${prduct?._id}`);
                  }}
                >
                  <img
                    src={prduct?.images?.[0]}
                    className="w-[100%] h-[260px] object-cover"
                    alt={prduct.name}
                  />
                  <div className="flex itemscenter flex-col py-[5px] px-[11px]">
                    <span className="font-bold">{prduct?.price} $</span>
                    <span className="line-through" style={{ color: "gray" }}>
                      {prduct?.price / 0.8} $
                    </span>
                  </div>
                </div>
              </Col>
            );
          })}
      </Row>
    </>
  );
};

export default ProductsCard;
