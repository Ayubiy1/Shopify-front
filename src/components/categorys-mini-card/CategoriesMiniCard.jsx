import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoriesMiniComp = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: "Categories-mini-cards2",
    queryFn: async () => {
      const res = await axios.get("https://shopify-backend-vcnq.onrender.com/api/categories/");
      return res.data;
    },
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {data?.map((item, index) => {
          return (
            <span
              key={index}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(`/users/${item?._id}`);
              }}
            >
              {item?.name}
            </span>
          );
        })}
      </div>
    </>
  );
};

export default CategoriesMiniComp;
