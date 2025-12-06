import React from "react";
import CategoriesPage from "./pages/Products/Products";
import Corusel from "./components/corusel";

import "./App.css";
import ProductsCard from "./components/Products-card/ProductsCard";

const AppLayout = () => {
  return (
    <div>
      <Corusel />

      <CategoriesPage />

      <ProductsCard categry_path="phone" categry_name="Phone" />

      <ProductsCard categry_path="clothes" categry_name="Clothing" />

      <ProductsCard categry_path="electronics" categry_name="Electronics" />
    </div>
  );
};

export default AppLayout;
