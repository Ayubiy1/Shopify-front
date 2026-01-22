import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../auth";

const CategoriesMiniComp = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["Categories-mini-cards2"],
    queryFn: async () => {
      const res = await api.get("/api/categories/", { withCredentials: true });
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
                console.log(item?._id);

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
