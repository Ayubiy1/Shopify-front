import CategoriesPage from "./pages/Products/Products";
import Corusel from "./components/corusel";

import "./App.css";
import ProductsCard from "./components/Products-card/ProductsCard";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "./auth";

const AppLayout = () => {
  const [checkCategory, setCheckCategory] = useState();

  const { data } = useQuery({
    queryKey: ["category-data-for-mini-card"],
    queryFn: async () =>
      await api.get("/api/categories", {
        withCredentials: true,
      }),
  });

  return (
    <div>
      <Corusel />

      <CategoriesPage />

      <div className="mt-[20px]">
        {data?.data.map((citem, indx) => {
          return (
            <ProductsCard
              key={indx}
              indx={indx}
              categry_path={citem?.slug}
              categry_name={citem?.name}
            />
          );
        })}
        {/* <ProductsCard categry_path="clothes" categry_name="Clothing" />

        <ProductsCard categry_path="electronics" categry_name="Electronics" />

        <ProductsCard
          categry_path="home-kitchen"
          categry_name="Home & Kitchen
"
        /> */}
      </div>
    </div>
  );
};

export default AppLayout;
