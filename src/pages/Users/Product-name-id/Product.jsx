import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Image, message } from "antd";

import "./Product.css";
import ProductsCard from "../../../components/Products-card/ProductsCard";

const ProductNameId = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [imageIndex, setImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [countProduct, setCountProduct] = useState(1);
  const [loadingAddCart, setLoadingAddCart] = useState();
  const [categorysName, setCategorysName] = useState(null);

  // PRODUCTNI OLIB KELISH
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-name-id", id],
    queryFn: async () => {
      const res = await axios.get(
        "https://angry-korie-developerayubiy-4da36956.koyeb.app/api/products",
        {
          withCredentials: true,
        },
      );

      return res.data.find((p) => p._id === id);
    },
  });

  const { mutate: productMuate } = useMutation({
    mutationFn: async () => {
      return axios.put(
        `https://angry-korie-developerayubiy-4da36956.koyeb.app/api/products${1}`,
      );
    },
  });

  // CART GA QO‘SHISH
  const { mutate } = useMutation({
    mutationFn: async (product) =>
      axios.post(
        "https://angry-korie-developerayubiy-4da36956.koyeb.app/api/cart/add",
        product,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // token yuboriladi
          },
        },
      ),
    onSuccess: (res) => {
      console.log(res);

      queryClient.invalidateQueries("product-name-id");

      setLoadingAddCart(false);
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
      Object.entries(d).every(([key, val]) => v.combination[key] === val),
    );

    setSelectedVariant(v ?? null);
  }, [data]);

  if (isLoading) return <p>Yuklanmoqda...</p>;
  if (isError) return <p>Xatolik yuz berdi</p>;
  if (!data) return <p>Mahsulot topilmadi</p>;

  // VARIANTNI TOPISH
  const findVariant = (opts) => {
    return data.variants.find((v) =>
      Object.entries(opts).every(([key, val]) => v.combination[key] === val),
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

    mutate({
      count: countProduct,
      productId: id,
      variantId: selectedVariant?._id,
      title: data.name,
      combination: selectedVariant.combination,
      images: selectedVariant.images,
      price: selectedVariant.price,
    });
    setLoadingAddCart(true);
  };

  // Mavjud variantni aniqlash
  const isOptionAvailable = (name, value) => {
    const test = { ...selectedOptions, [name]: value };

    return data?.variants?.some((v) =>
      Object.entries(test)?.every(([k, val]) => v?.combination[k] === val),
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
    }, {}),
  );

  // KO‘RSATILADIGAN RASMLAR
  const imagesToShow = selectedVariant ? selectedVariant.images : data.images;

  return (
    <div className="p-6">
      <h1 className="text-[24px] font-bold">{data.name}</h1>

      <div className="md:flex justify-around gap-6 mt-5">
        {/* LEFT — IMAGES */}
        <div className="">
          <div className="flex gap-2 w-1/4 md:w-1/1 overflow-y-scroll hidden-scrollbar my-[10px]">
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              {imagesToShow?.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  width={80}
                  height={80}
                  className="w-[80px] h-[80px] object-cover rounded cursor-pointer"
                  style={{
                    border:
                      imageIndex === i
                        ? "2px solid black"
                        : "2px solid transparent",
                  }}
                  onClick={() => {
                    setImageIndex(i);
                  }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
          <div className="flex gap-3 items-center">
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              <Image
                src={imagesToShow?.[0]}
                width={383}
                height={444}
                className="rounded-lg object-cover"
              />
              {imagesToShow?.[1] && (
                <Image
                  src={imagesToShow?.[1]}
                  width={383}
                  height={444}
                  className="rounded-lg object-cover"
                />
              )}
            </Image.PreviewGroup>
          </div>
          <h3>{data?.description}</h3>
        </div>
        {/* RIGHT — DETAILS */}
        <div className="lg:w-[500px] flex flex-col gap-5 mb-[20px]">
          <p className="text-xl text-green-600 font-bold">
            ${selectedVariant?.price || data.price}
          </p>

          <p className="text-gray-600">{data.description}</p>

          {/* COLOR OPTIONS */}
          {data.options?.some((o) => o.name === "color") && (
            <div className="w-full">
              <h3 className="font-semibold mb-2">Rang:</h3>
              <div className="flex gap-3 flex-wrap">
                {uniqueColorVariants.map((v, i) => {
                  const isActive =
                    selectedOptions.color === v.combination.color;

                  return (
                    <div key={i} className="relative">
                      <img
                        src={v?.images?.[0] || "/no-image.png"}
                        className={`w-[99px] h-[99px] rounded-lg cursor-pointer 
                        ${isActive ? "colorOrsize" : "colorOrsize_no"}`}
                        onClick={() => handleColorSelect(v)}
                      />
                      {v?.stock === 0 && (
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
                        className={`cursor-pointer text-[17px]
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
              <strong>Qoldiq: </strong>
              {selectedVariant.stock > 0
                ? selectedVariant.stock + " dona"
                : "Tugagan"}
            </p>
          )}

          {/* ok */}
          <div className="w-full">
            <div className="flex items-center justify-around w-[70%] mb-[5px]">
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
                    selectedVariant.stock > prev ? prev + 1 : prev,
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
              className="bg-black text-white py-2 rounded w-[70%]"
            >
              {loadingAddCart ? "Loading..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {categorysName?.map((c) => {
        return (
          <div className="mt-[30px] w-full">
            <ProductsCard categry_name={c.name} categry_path={c.slug} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductNameId;
