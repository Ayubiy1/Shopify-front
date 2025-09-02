import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"

const ProductNameId = () => {
    const { name, id } = useParams()
    const [imageIndex, setImageIndex] = useState(0)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["product-name-id", id], // queryKey bo‘sh bo‘lmasin
        queryFn: async () => {
            const res = await axios.get("http://localhost:10000/api/products")
            return res?.data.filter((p) => p._id === id)
        },
    })

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error loading product</p>
    if (!data || data.length === 0) return <p>No product found</p>

    console.log(data[0]);


    return <>
        <div>
            <h1 className="text-[20px]"
                style={{
                    fontWeight: "bold"
                }}
            >
                {data[0].name}
            </h1>

            <div className="flex items-center">
                <div>
                    {data[0].images.map(((i, index) => {
                        return <img src={i} className={`w-[100px] h-[100px] object-contain rounded-xl cursor-pointer transition-[0.6s]`}
                            style={{
                                border: imageIndex === index ? "1px solid #000" : "1px solid transparent",
                                transition: "0.2s"
                            }}
                            onClick={() => {
                                setImageIndex(index)
                            }} />
                    }))}
                </div>

                <div className="flex items-center">
                    {
                        <img src={data[0].images[imageIndex]} className="w-[400px] h-[400px] object-contain" style={{ transition: "0.9s" }}
                        />
                    }

                    {/* {data[0].images.slice(0, data[0].images.length - 2).map((i => {
                        return 
                    }))} */}
                </div>
            </div>
        </div>
    </>
}

export default ProductNameId