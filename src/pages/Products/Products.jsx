import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"

const ProductsPage = () => {
    const { data } = useQuery({
        queryKey: ["products-user"],
        queryFn: async () => {
            const res = await axios.get("http://localhost:3000/api/products/");
            return res.data;
        },

        onSuccess: () => { }
    })



    return <>

    </>
}

export default ProductsPage