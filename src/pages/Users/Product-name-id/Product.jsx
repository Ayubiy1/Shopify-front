import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Image, message } from "antd";

import "./Product.css";

const ProductNameId = () => {
  const { id } = useParams();

  const [imageIndex, setImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [countProduct, setCountProduct] = useState(1);
  const [combination, setCombination] = useState(null);

  // PRODUCTNI OLIB KELISH
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-name-id", id],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/products");

      return res.data.find((p) => p._id === id);
    },
  });

  // useEffect(() => {
  //   const aaa = data?.variants?.map(
  //     (v, onx) => v.combination == selectedVariant.combination
  //   );

  //   console.log(aaa);
  // }, []);

  const { mutate: productMuate } = useMutation({
    mutationFn: async () => {
      return axios.put(`http://localhost:3000/api/products${1}`);
    },
  });

  // CART GA QO‘SHISH
  const { mutate } = useMutation({
    mutationFn: async (product) =>
      axios.post("http://localhost:3000/api/cart/add", product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // token yuboriladi
        },
      }),
    onSuccess: () => {
      alert("Savatchaga qo‘shildi!");
    },
  });

  // DEFAULT OPTIONS — avtomatik tanlash
  useEffect(() => {
    if (!data?.options) return;

    let d = {};

    if (Array.isArray(data.options)) {
      data.options.forEach((o) => {
        d[o.name] = o.values[0]; // birinchi qiymatni tanlaymiz
      });
    }

    setSelectedOptions(d);

    const v = data.variants.find((v) =>
      Object.entries(d).every(([key, val]) => v.combination[key] === val)
    );

    setSelectedVariant(v ?? null);
  }, [data]);

  if (isLoading) return <p>Yuklanmoqda...</p>;
  if (isError) return <p>Xatolik yuz berdi</p>;
  if (!data) return <p>Mahsulot topilmadi</p>;

  // VARIANTNI TOPISH
  const findVariant = (opts) => {
    return data.variants.find((v) =>
      Object.entries(opts).every(([key, val]) => v.combination[key] === val)
    );
  };

  // OPTIONNI TANLASH
  const handleOptionChange = (optName, value) => {
    const updated = { ...selectedOptions, [optName]: value };
    setSelectedOptions(updated);

    const matched = findVariant(updated);
    setSelectedVariant(matched || null);

    if (matched?.stock === 0) {
      message.warning("Bu variant tugagan — faqat ko‘rish mumkin!");
    }
  };

  // COLOR TANLASH (rasm orqali)
  const handleColorSelect = (variant) => {
    const color = variant.combination.color;

    const updated = { ...selectedOptions, color };
    setSelectedOptions(updated);

    const matched = findVariant(updated);
    setSelectedVariant(matched || null);

    setImageIndex(0);

    if (matched?.stock === 0) {
      message.warning("Bu rang tugagan — faqat ko‘rish mumkin!");
    }
  };

  // CART GA QO‘SHISH
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    if (selectedVariant.stock === 0) return message.error("Tugagan variant!");

    console.log({
      productId: id,
      title: data.name,
      count: countProduct,
      price: selectedVariant.price,
      images: selectedVariant.images,
      combination: selectedVariant.combination,
    });

    // mutate({
    //   productId: id,
    //   title: data.name,
    //   count: countProduct,
    //   price: selectedVariant.price,
    //   images: selectedVariant.images,
    //   combination: selectedVariant.combination,
    // });

    mutate({
      count: countProduct,
      productId: id,
      title: data.name,
      combination: selectedVariant.combination,
      images: selectedVariant.images,
      price: selectedVariant.price,
    });
  };

  // Mavjud variantni aniqlash
  const isOptionAvailable = (name, value) => {
    const test = { ...selectedOptions, [name]: value };

    return data.variants.some((v) =>
      Object.entries(test).every(([k, val]) => v.combination[k] === val)
    );
  };

  // UNIQUE RANGLAR
  const uniqueColorVariants = Object.values(
    data.variants.reduce((acc, variant) => {
      const color = variant.combination.color;
      if (!acc[color]) {
        acc[color] = variant;
      }
      return acc;
    }, {})
  );

  // KO‘RSATILADIGAN RASMLAR
  const imagesToShow = selectedVariant ? selectedVariant.images : data.images;

  return (
    <div className="p-6">
      <h1 className="text-[24px] font-bold">{data.name}</h1>

      <div className="lg:flex gap-6 mt-5">
        {/* LEFT — IMAGES */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 h-[350px] overflow-y-scroll hidden-scrollbar">
            {imagesToShow.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-[80px] h-[80px] object-cover rounded cursor-pointer"
                style={{
                  border:
                    imageIndex === i
                      ? "2px solid black"
                      : "2px solid transparent",
                }}
                onClick={() => setImageIndex(i)}
              />
            ))}
          </div>

          <Image
            src={imagesToShow[imageIndex]}
            width={350}
            className="rounded-lg"
          />
        </div>

        {/* RIGHT — DETAILS */}
        <div className="lg:w-[350px] flex flex-col gap-5">
          <p className="text-xl text-green-600 font-bold">
            ${selectedVariant?.price || data.price}
          </p>

          <p className="text-gray-600">{data.description}</p>

          {/* COLOR OPTIONS */}
          {data.options?.some((o) => o.name === "color") && (
            <div>
              <h3 className="font-semibold mb-2">Rang:</h3>
              <div className="flex gap-3 flex-wrap">
                {uniqueColorVariants.map((v, i) => {
                  const isActive =
                    selectedOptions.color === v.combination.color;

                  return (
                    <div key={i} className="relative">
                      <img
                        src={v.images[0]}
                        className={`w-[55px] h-[55px] rounded-lg cursor-pointer 
                          ${isActive ? "colorOrsize" : "colorOrsize_no"}`}
                        onClick={() => handleColorSelect(v)}
                      />
                      {v.stock === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[2px] bg-red-500 rotate-45"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OTHER OPTIONS */}
          {data.options
            ?.filter((o) => o.name !== "color")
            .map((opt) => (
              <div key={opt.name}>
                <h3 className="font-semibold mb-1">{opt.name}:</h3>

                <div className="flex gap-3">
                  {opt.values.map((val) => {
                    const active = selectedOptions[opt.name] === val;
                    const available = isOptionAvailable(opt.name, val);

                    return (
                      <button
                        key={val}
                        onClick={() => handleOptionChange(opt.name, val)}
                        style={{ borderRadius: "6px", padding: "3px 6px" }}
                        className={`cursor-pointer
                          ${
                            active
                              ? "border-black font-bold allowed"
                              : "border-gray-400 border"
                          }
                          ${
                            !available
                              ? "text-gray-400 bg-gray-200 line-through not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* STOCK */}
          {selectedVariant && (
            <p>
              <strong>Qoldiq:</strong>
              {selectedVariant.stock > 0
                ? selectedVariant.stock + " dona"
                : "Tugagan"}
            </p>
          )}

          <div className="w-full">
            <div className="flex items-center justify-around w-[50%] mb-[5px]">
              <Button
                onClick={() => {
                  setCountProduct((prev) => (prev > 1 ? prev - 1 : 1));
                }}
                className="button-add"
                disabled={countProduct == 1 || selectedVariant?.stock == 0}
              >
                -
              </Button>
              <span>{countProduct}</span>
              <Button
                onClick={() => {
                  setCountProduct((prev) =>
                    selectedVariant.stock > prev ? prev + 1 : prev
                  );
                }}
                disabled={
                  selectedVariant?.stock == countProduct ||
                  selectedVariant?.stock == 0
                }
                className="button-add"
              >
                +
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="bg-black text-white py-2 rounded w-[50%]"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductNameId;
