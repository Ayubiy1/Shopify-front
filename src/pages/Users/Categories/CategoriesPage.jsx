import { useQuery } from "@tanstack/react-query";
import { Button, Col, Row } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CategoriesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ["product-by-categoryId", id],
    queryFn: async () => {
      const res = await axios.get(
        `https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/products`,
        { withCredentials: true }
      );
      return res.data.filter((i) => i.categoryId == id);
    },
  });

  return (
    <>
      <Row gutter={[16, 16]} className="justify-center p-2">
        {products?.map((item) => {
          console.log(item?.images[0]);

          return (
            <Col
              key={item._id}
              xs={12}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              className="p-2"
              onClick={() => {
                navigate(`/users/${item?.name}/${item?._id}`);
              }}
            >
              <div
                onClick={() => navigate(`/product/${item?._id}`)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="w-full h-52 flex items-center justify-center overflow-hidden rounded-t-xl">
                  <img
                    src={item?.images[0]}
                    alt={item?.name}
                    className="object-contain min-w-full h-full h[10px]"
                  />
                </div>

                <div
                  className="flex flex-col gap-1 text-sm justify-between h-[200px]"
                  style={{ padding: "10px" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-md text-xs">
                      Original
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-md text-xs">
                      Super narx
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-700">
                      {item?.price.toLocaleString()} $
                    </span>
                    <span className="line-through text-gray-400 text-sm">
                      {(item?.price * 1.3).toLocaleString()} $
                    </span>
                  </div>

                  <p className="text-gray-700 font-medium line-clamp-2">
                    {item?.name}
                  </p>
                  <p className="text-gray-500 text-xs line-clamp-2">
                    {item?.description}
                  </p>

                  <Button
                    type="primary"
                    className="bg-purple-600 text-white text-sm rounded-lg py-2 mt-2 hover:bg-purple-700 transition"
                  >
                    Savatga
                  </Button>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default CategoriesPage;
