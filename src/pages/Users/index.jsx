import { Outlet } from "react-router-dom"
import Corusel from "../../components/corusel/index"
import CategoriesPage from "../Products/Products"

import "./User.css"
import HeaderComp from "../../components/header"
import CategoriesMiniComp from "../../components/categorys-mini-card/CategoriesMiniCard"

const UserPage = () => {
    return <>
        <div className="user">
            <HeaderComp />

            <CategoriesMiniComp />

            <Outlet />
        </div>
    </>
}
export default UserPage