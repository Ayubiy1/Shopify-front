import React from "react";
import CategoriesPage from "./pages/Products/Products"
import Corusel from "./components/corusel";

import "./App.css"

const AppLayout = () => {
    return (
        <div>
            <Corusel />

            <CategoriesPage />
            {/* <HeaderComp />
            <Outlet /> */}
        </div>
    );
};

export default AppLayout;
