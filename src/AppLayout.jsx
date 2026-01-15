import CategoriesPage from "./pages/Products/Products";
import Corusel from "./components/corusel";

import "./App.css";
import ProductsCard from "./components/Products-card/ProductsCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const AppLayout = () => {
  const [checkCategory, setCheckCategory] = useState();

  const { data } = useQuery({
    queryKey: ["category-data-for-mini-card"],
    queryFn: async () =>
      await axios.get(
        "https://vital-blaire-developerayubiy-9da1c9ac.koyeb.app/api/categories",
        {
          withCredentials: true,
        }
      ),
  });

  return (
    <div>
      <Corusel />

      <CategoriesPage />

      <div className="mt-[20px]">
        {data?.data.map((citem) => {
          return (
            <ProductsCard
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
