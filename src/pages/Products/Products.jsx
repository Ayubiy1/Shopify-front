import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const ProductsPage = () => {
  const { data } = useQuery({
    queryKey: ["products-user"],
    queryFn: async () => {
      const res = await api.get("/api/products/",
        { withCredentials: true }
      );
      return res.data;
    },

    onSuccess: () => {},
  });

  return <></>;
};

export default ProductsPage;
