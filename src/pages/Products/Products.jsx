import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const ProductsPage = () => {
  const { data } = useQuery({
    queryKey: ["products-user"],
    queryFn: async () => {
      const res = await axios.get(
        "https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app/api/products/",
        { withCredentials: true }
      );
      return res.data;
    },

    onSuccess: () => {},
  });

  return <></>;
};

export default ProductsPage;
