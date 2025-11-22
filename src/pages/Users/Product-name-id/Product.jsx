import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Image, message } from "antd";
import { useLocalStorageState } from "ahooks";

import "./Product.css";

const ProductNameId = () => {
  const { id } = useParams();

  const [imageIndex, setImageIndex] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useLocalStorageState(
    "selectedVariant",
    { defaultValue: null }
  );

  // PRODUCTNI OLIB KELISH
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-name-id", id],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/products");
      return res.data.find((p) => p._id === id);
    },
  });

  // CART
  const { mutate } = useMutation({
    mutationFn: async (product) =>
      axios.post("http://localhost:3000/api/cart/add", product),
    onSuccess: () => message.success("Savatchaga qo‘shildi!"),
  });

  // ❗ Default optionlarni avtomatik tanlash
  useEffect(() => {
    if (data?.options) {
      let d = {};

      if (Array.isArray(data.options)) {
        data.options.forEach((o) => {
          d[o.name] = o.values[0];
        });
      }

      setSelectedOptions(d);

      const v = data.variants.find((v) =>
        Object.entries(d).every(([key, val]) => v.combination[key] === val)
      );

      setSelectedVariant(v ?? null);
    }
  }, [data]);

  if (isLoading) return <p>Yuklanmoqda...</p>;
  if (isError) return <p>Xatolik yuz berdi</p>;
  if (!data) return <p>Mahsulot topilmadi</p>;

  // UNIVERSAL VARIANT MATCH FUNCTION
  const findVariant = (opts) => {
    return data.variants.find((v) =>
      Object.entries(opts).every(([key, val]) => v.combination[key] === val)
    );
  };

  // OPTIONNI O‘ZGARTIRISH
  const handleOptionChange = (optName, value) => {
    const updated = { ...selectedOptions, [optName]: value };
    setSelectedOptions(updated);

    const matched = findVariant(updated);
    setSelectedVariant(matched || null);

    if (matched?.stock === 0) {
      message.warning("Bu variant tugagan — faqat ko‘rish mumkin!");
    }
  };

  // COLOR VARIANTI (rasm asosida tanlash)
  const handleColorSelect = (variant) => {
    const color = variant.combination.color;
    // console.log(color);

    const updated = { ...selectedOptions, color };
    setSelectedOptions(updated);

    const matched = findVariant(updated);
    setSelectedVariant(matched || null);

    setImageIndex(0);

    if (matched?.stock === 0) {
      message.warning("Bu rang tugagan — faqat ko‘rish mumkin!");
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    if (selectedVariant.stock === 0) return message.error("Tugagan variant!");

    mutate({
      productId: id,
      title: data.name,
      combination: selectedVariant.combination,
      images: selectedVariant.images,
      price: selectedVariant.price,
    });
  };

  const isOptionAvailable = (name, value) => {
    const test = { ...selectedOptions, [name]: value };

    return data.variants.some((v) =>
      Object.entries(test).every(([k, val]) => v.combination[k] === val)
    );
  };

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
          {Array.isArray(data.options) &&
            data.options?.some((o) => o.name === "color") && (
              <div>
                <h3 className="font-semibold mb-2">Rang:</h3>
                <div className="flex gap-3">
                  {data.variants.map((v, i) => {
                    const isActive =
                      selectedVariant?.combination?.color ===
                      v.combination.color;

                    const isUnavailable = v.stock === 0;

                    return (
                      <div className="relative color-variant-item" key={i}>
                        <img
                          src={v.images[0]}
                          className={`w-[55px] h-[55px] rounded-lg cursor-pointer
                          ${isActive ? "colorOrsize" : "colorOrsize_no"}
                         
                        `}
                          onClick={() => {
                            handleColorSelect(v);
                            console.log(v);
                          }}
                        />

                        {/* Cross line over image */}
                        {!isOptionAvailable("color", v.combination.color) && (
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

          {/* UNIVERSAL OTHER OPTIONS */}
          {Array.isArray(data.options) &&
            data.options
              .filter((o) => o.name !== "color")
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
                          className={`px-4 py-1 rounded allowed
                          ${
                            active
                              ? "border-black font-bold"
                              : "border-gray-300"
                          }
                          ${
                            !available
                              ? "text-gray-400 bg-gray-200 line-through not-allowed"
                              : "hover:bg-gray-100"
                          }
                        `}
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
              <strong>Qoldiq:</strong>{" "}
              {selectedVariant.stock > 0
                ? selectedVariant.stock + " dona"
                : "Tugagan"}
            </p>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="bg-black text-white py-2 rounded"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductNameId;

{
  // import { useMutation, useQuery } from "@tanstack/react-query";
  // import axios from "axios";
  // import { useState, useEffect } from "react";
  // import { useParams } from "react-router-dom";
  // import { Button, Image, message } from "antd";
  // import "./Product.css";
  // import { useLocalStorageState } from "ahooks";
  // const ProductNameId = () => {
  //   const { id } = useParams();
  //   const [imageIndex, setImageIndex] = useState(0);
  //   const [selectedOptions, setSelectedOptions] = useState({});
  //   const [selectedVariant, setSelectedVariant] = useLocalStorageState(
  //     "selectedVariant",
  //     {
  //       defaultValue: null,
  //     }
  //   );
  //   useEffect(() => {
  //     const handleClickOutside = (e) => {
  //       // Agar variantlarga bosilmagan bo‘lsa -> reset
  //       if (!e.target.closest(".color-variant-item")) {
  //         setSelectedVariant(null);
  //       }
  //     };
  //     window.addEventListener("click", handleClickOutside);
  //     return () => {
  //       window.removeEventListener("click", handleClickOutside);
  //     };
  //   }, []);
  //   const [choosedMemory, setChoosedMemory] = useState(null);
  //   // PRODUCTNI OLIB KELISH
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["product-name-id", id],
  //     queryFn: async () => {
  //       const res = await axios.get("http://localhost:3000/api/products");
  //       return res?.data.find((p) => p._id === id);
  //     },
  //   });
  //   // SAVATCHAGA QO‘SHISH
  //   const { mutate } = useMutation({
  //     mutationFn: async (product) => {
  //       return await axios.post(`http://localhost:3000/api/cart/add`, product);
  //     },
  //     onSuccess: () => {
  //       message.success("Savatchaga qo‘shildi! 🛒");
  //     },
  //   });
  //   // KIRGANDA BIRINCHI VARIANTNI TANLAB QO‘YADI
  //   useEffect(() => {
  //     if (data && data.options) {
  //       let defaultOptions = {};
  //       data.options.forEach((opt) => {
  //         defaultOptions[opt.name] = opt.values[0];
  //       });
  //       setSelectedOptions(defaultOptions);
  //       setSelectedVariant(defaultOptions?.memory);
  //       const firstVariant = data.variants.find((v) =>
  //         Object.entries(defaultOptions).every(
  //           ([key, val]) => v.combination[key] === val
  //         )
  //       );
  //       setSelectedVariant(firstVariant || null);
  //     }
  //   }, [data]);
  //   if (isLoading) return <p>Yuklanmoqda...</p>;
  //   if (isError) return <p>Xatolik yuz berdi...</p>;
  //   if (!data) return <p>Mahsulot topilmadi</p>;
  //   // 🔥 COLORNI RASMGA BOSIB TANLASH
  //   const handleColorSelect = (v) => {
  //     const color = v.combination.color;
  //     const newOptions = { ...selectedOptions, color };
  //     const onlyColorOption = { color }; // <-- faqat rang bilan ishlaymiz
  //     // variantni topamiz
  //     // const variant = data.variants.find((v) =>
  //     //   Object.entries(newOptions).every(
  //     //     ([key, val]) => v.combination[key] == val
  //     //   )
  //     // );
  //     const variant = data?.variants.find(
  //       (v) => v.combination.color === onlyColorOption?.color
  //     );
  //     // 🔥 Tanlanadi, lekin agar stock = 0 bo‘lsa hech qanday funksiya ishlamaydi
  //     setSelectedOptions(newOptions);
  //     setSelectedVariant(variant);
  //     // Agar tugagan bo‘lsa - faqat ogohlantiramiz
  //     if (variant && variant.stock === 0) {
  //       message.warning("Bu rang tugagan, faqat ko‘rish rejimida tanladingiz ❗");
  //     }
  //     setImageIndex(0);
  //   };
  //   // MEMORY OPTIONINI TANLASH
  //   const handleOptionChange = (option, value) => {
  //     // console.log(option);
  //     const newOptions = { ...selectedOptions, [option]: value };
  //     setSelectedOptions(newOptions);
  //     // const matched = data.variants.find((v) =>
  //     //   Object.entries(newOptions).every(([k, val]) => v.combination[k] === val)
  //     // );
  //     const matched = data.variants.find((v) => v.combination[option] === value);
  //     console.log(matched);
  //     // setSelectedVariant(matched || null);
  //   };
  //   const handleAddToCart = () => {
  //     if (!selectedVariant) return;
  //     if (selectedVariant.stock === 0)
  //       return message.error("Bu variant tugagan! Savatchaga qo‘shib bo‘lmaydi.");
  //     // mutate({ id, ...selectedVariant });
  //     console.log({
  //       productId: id,
  //       title: data.name,
  //       combination: selectedVariant.combination,
  //       images: selectedVariant.images,
  //       price: selectedVariant.price,
  //     });
  //     // mutate({
  //     //   userId: "123", // TEMPORARY — Auth qo‘shilgandan keyin real userId ketadi
  //     //   productId: id,
  //     //   title: data.name,
  //     //   combination: selectedVariant.combination,
  //     //   images: selectedVariant.images,
  //     //   price: selectedVariant.price,
  //     // });
  //   };
  //   const isOptionAvailable = (optionName, value) => {
  //     const testOptions = { ...selectedOptions, [optionName]: value };
  //     const aa = data?.variants?.some((v) =>
  //       Object.entries(testOptions).every(
  //         ([key, val]) => v.combination[key] === val
  //       )
  //     );
  //     // console.log(aa);
  //     return aa;
  //   };
  //   const imagesToShow = selectedVariant ? selectedVariant.images : data.images;
  //   // console.log(imagesToShow);
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-[24px] font-bold">{data.name}</h1>
  //       <div className="lg:flex items-start mt-5 gap-6">
  //         {/* LEFT SIDE — IMAGES */}
  //         <div className="flex gap-6">
  //           {/* Thumbnail images */}
  //           <div className="flex flex-col gap-2 overflow-y-scroll h-[350px] hidden-scrollbar">
  //             {imagesToShow.map((img, i) => (
  //               <img
  //                 key={i}
  //                 src={img}
  //                 className="w-[80px] h-[80px] object-contain cursor-pointer rounded-xl"
  //                 style={{
  //                   border:
  //                     imageIndex === i
  //                       ? "2px solid black"
  //                       : "2px solid transparent",
  //                 }}
  //                 onClick={() => setImageIndex(i)}
  //               />
  //             ))}
  //           </div>
  //           {/* Main image */}
  //           <div className="flex items-center justify-center">
  //             <Image
  //               src={imagesToShow[imageIndex]}
  //               width={350}
  //               className="rounded-xl"
  //             />
  //           </div>
  //         </div>
  //         {/* RIGHT SIDE — DETAILS */}
  //         <div className="lg:w-[350px] flex flex-col gap-5">
  //           {/* Price + Description */}
  //           <div>
  //             <div className="text-2xl font-semibold">{data.name}</div>
  //             <div className="text-xl font-bold text-green-600">
  //               {selectedVariant ? `$${selectedVariant.price}` : `$${data.price}`}
  //             </div>
  //             <p className="text-gray-600">{data.description}</p>
  //           </div>
  //           {/* 🔥 COLOR (IMAGE BASED SELECT) */}
  //           <div>
  //             <h3 className="font-semibold mb-2">Rang:</h3>
  //             <div className="flex gap-3">
  //               <div className="flex gap-3">
  //                 {data?.variants?.map((v, idx) => {
  //                   return (
  //                     <div className="relative">
  //                       <img
  //                         key={idx}
  //                         src={v.images[0]}
  //                         className={`w-[55px] h-[55px] rounded-lg border cursor-pointer
  //                     ${
  //                       selectedVariant?.combination?.color ===
  //                       v.combination.color
  //                         ? "border-black"
  //                         : "border-gray-300"
  //                     }
  //                     `}
  //                         // ${v.stock === 0 ? "opacity-40" : ""}
  //                         onClick={() => handleColorSelect(v)}
  //                       />
  //                       <span
  //                         className={`${
  //                           v?.combination?.memory !== choosedMemory && "span"
  //                         }`}
  //                       ></span>
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //             </div>
  //           </div>
  //           {/* MEMORY OPTIONS */}
  //           {data.options
  //             ?.filter((o) => o.name === "memory")
  //             .map((opt, idx) => {
  //               return (
  //                 <div key={idx} className="flex gap-3">
  //                   {opt.values.map((val, i) => {
  //                     const available = isOptionAvailable(opt.name, val);
  //                     const isSelected = selectedOptions[opt.name] === val;
  //                     return (
  //                       <button
  //                         key={i}
  //                         style={{ borderRadius: "7px", padding: "2px 5px" }}
  //                         className={`rounded border
  //                       ${
  //                         isSelected
  //                           ? "border-black font-bold cursor-pointer"
  //                           : "border-gray-300 border-transparent"
  //                       }
  //                       ${
  //                         !available
  //                           ? "bg-gray-200 text-gray-400 cursor-not-allowed not-allowed line-through"
  //                           : "hover:bg-gray-100"
  //                       }
  //                     `}
  //                         onClick={() => {
  //                           handleOptionChange(opt.name, val);
  //                           setChoosedMemory(val);
  //                         }}
  //                         // disabled={!available}
  //                       >
  //                         {val}
  //                       </button>
  //                     );
  //                   })}
  //                 </div>
  //               );
  //             })}
  //           {/* STOCK */}
  //           {selectedVariant && (
  //             <p>
  //               <strong>Qoldiq:</strong>{" "}
  //               {selectedVariant.stock > 0
  //                 ? selectedVariant.stock + " dona"
  //                 : "Tugagan"}
  //             </p>
  //           )}
  //           {/* ADD TO CART */}
  //           <Button
  //             onClick={handleAddToCart}
  //             disabled={!selectedVariant || selectedVariant.stock === 0}
  //             className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
  //           >
  //             Add to Cart
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  // export default ProductNameId;
}

{
  // import { useMutation, useQuery } from "@tanstack/react-query";
  // import axios from "axios";
  // import { useState, useEffect } from "react";
  // import { useParams } from "react-router-dom";
  // import { Button, Image, message } from "antd";
  // import "./Product.css";
  // import { useLocalStorageState } from "ahooks";
  // import OptionBlock from "./OptionBlock.jsx";
  // const ProductNameId = () => {
  //   const { id } = useParams();
  //   const [imageIndex, setImageIndex] = useState(0);
  //   const [selectedOptions, setSelectedOptions] = useState({});
  //   const [selectedVariant, setSelectedVariant] = useLocalStorageState(
  //     "selectedVariant",
  //     { defaultValue: null }
  //   );
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["product-name-id", id],
  //     queryFn: async () => {
  //       const res = await axios.get("http://localhost:3000/api/products");
  //       return res?.data.find((p) => p._id === id);
  //     },
  //   });
  //   const { mutate } = useMutation({
  //     mutationFn: async (product) => {
  //       return await axios.post(`http://localhost:3000/api/cart/add`, product);
  //     },
  //     onSuccess: () => message.success("Savatchaga qo‘shildi! 🛒"),
  //   });
  //   useEffect(() => {
  //     if (data && data.options) {
  //       let defaultOptions = {};
  //       data.options.forEach((opt) => {
  //         defaultOptions[opt.name] = opt.values[0];
  //       });
  //       setSelectedOptions(defaultOptions);
  //       const firstVariant = data.variants.find((v) =>
  //         Object.entries(defaultOptions).every(
  //           ([key, val]) => v.combination[key] === val
  //         )
  //       );
  //       setSelectedVariant(firstVariant || null);
  //     }
  //   }, [data]);
  //   const handleOptionChange = (option, value) => {
  //     const newOptions = { ...selectedOptions, [option]: value };
  //     setSelectedOptions(newOptions);
  //     const matched = data.variants.find((v) =>
  //       Object.entries(newOptions).every(([k, val]) => v.combination[k] === val)
  //     );
  //     setSelectedVariant(matched || null);
  //     if (option === "color") setImageIndex(0);
  //   };
  //   const handleAddToCart = () => {
  //     if (!selectedVariant) return;
  //     if (selectedVariant.stock === 0)
  //       return message.error("Bu variant tugagan! Savatchaga qo‘shib bo‘lmaydi.");
  //     mutate({
  //       productId: id,
  //       title: data.name,
  //       combination: selectedVariant.combination,
  //       images: selectedVariant.images,
  //       price: selectedVariant.price,
  //     });
  //   };
  //   const isOptionAvailable = (optionName, value) => {
  //     const testOptions = { ...selectedOptions, [optionName]: value };
  //     return data?.variants?.some((v) =>
  //       Object.entries(testOptions).every(
  //         ([key, val]) => v.combination[key] === val
  //       )
  //     );
  //   };
  //   if (isLoading) return <p>Yuklanmoqda...</p>;
  //   if (isError) return <p>Xatolik yuz berdi...</p>;
  //   if (!data) return <p>Mahsulot topilmadi</p>;
  //   const imagesToShow = selectedVariant ? selectedVariant.images : data.images;
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-[24px] font-bold">{data.name}</h1>
  //       <div className="lg:flex items-start mt-5 gap-6">
  //         {/* LEFT SIDE — IMAGES */}
  //         <div className="flex gap-6">
  //           <div className="flex flex-col gap-2 overflow-y-scroll h-[350px] hidden-scrollbar">
  //             {imagesToShow.map((img, i) => (
  //               <img
  //                 key={i}
  //                 src={img}
  //                 className="w-[80px] h-[80px] object-contain cursor-pointer rounded-xl"
  //                 style={{
  //                   border:
  //                     imageIndex === i
  //                       ? "2px solid black"
  //                       : "2px solid transparent",
  //                 }}
  //                 onClick={() => setImageIndex(i)}
  //               />
  //             ))}
  //           </div>
  //           <div className="flex items-center justify-center">
  //             <Image
  //               src={imagesToShow[imageIndex]}
  //               width={350}
  //               className="rounded-xl"
  //             />
  //           </div>
  //         </div>
  //         {/* RIGHT SIDE — DETAILS */}
  //         <div className="lg:w-[350px] flex flex-col gap-5">
  //           <div>
  //             <div className="text-2xl font-semibold">{data.name}</div>
  //             <div className="text-xl font-bold text-green-600">
  //               {selectedVariant ? `$${selectedVariant.price}` : `$${data.price}`}
  //             </div>
  //             <p className="text-gray-600">{data.description}</p>
  //           </div>
  //           {/* 🔥 DYNAMIC OPTIONS */}
  //           {data.options && (
  //             <div>
  //               {data.options.map((opt) => (
  //                 <OptionBlock
  //                   key={opt.name}
  //                   label={opt.name}
  //                   values={opt.values}
  //                   selected={selectedOptions[opt.name]}
  //                   onSelect={(val) => handleOptionChange(opt.name, val)}
  //                   isDisabled={(val) => !isOptionAvailable(opt.name, val)}
  //                 />
  //               ))}
  //             </div>
  //           )}
  //           {/* STOCK */}
  //           {selectedVariant && (
  //             <p>
  //               <strong>Qoldiq:</strong>{" "}
  //               {selectedVariant.stock > 0
  //                 ? selectedVariant.stock + " dona"
  //                 : "Tugagan"}
  //             </p>
  //           )}
  //           {/* ADD TO CART */}
  //           <Button
  //             onClick={handleAddToCart}
  //             disabled={!selectedVariant || selectedVariant.stock === 0}
  //             className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
  //           >
  //             Add to Cart
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  // export default ProductNameId;
}

{
  // import { useMutation, useQuery } from "@tanstack/react-query";
  // import axios from "axios";
  // import { useState, useEffect } from "react";
  // import { useParams } from "react-router-dom";
  // import { Button, Image, message, Typography } from "antd";
  // import "./Product.css";
  // const ProductNameId = () => {
  //   const { id } = useParams();
  //   const [imageIndex, setImageIndex] = useState(0);
  //   const [selectedOptions, setSelectedOptions] = useState({});
  //   const [selectedVariant, setSelectedVariant] = useState(null);
  //   const [sizeOrcolor, setSizeOrcolor] = useState(null);
  //   // --- PRODUCTNI OLIB KELISH ---
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["product-name-id", id],
  //     queryFn: async () => {
  //       const res = await axios.get("http://localhost:3000/api/products");
  //       return res?.data.find((p) => p._id === id);
  //     },
  //   });
  //   const { mutate } = useMutation({
  //     mutationFn: async (product) => {
  //       console.log(product);
  //       return await axios.post(`http://localhost:3000/api/cart/add`, product);
  //     },
  //     onSuccess: () => {
  //       alert("added korzinka");
  //     },
  //   });
  //   //   🔥 KIRGANDA AVTOMATIK VARIANT TANLASH
  //   useEffect(() => {
  //     if (data && data.options) {
  //       let defaultOptions = {};
  //       data.options.forEach((opt) => {
  //         defaultOptions[opt.name] = opt.values[0]; // birinchi optionni tanlaydi
  //       });
  //       setSelectedOptions(defaultOptions);
  //       const firstVariant = data.variants.find((v) =>
  //         Object.entries(defaultOptions).every(
  //           ([key, val]) => v.combination[key] === val
  //         )
  //       );
  //       setSelectedVariant(firstVariant || null);
  //     }
  //   }, [data]);
  //   if (isLoading) return <p>Loading...</p>;
  //   if (isError) return <p>Error loading product</p>;
  //   if (!data) return <p>No product found</p>;
  //   //     OPTIONNI TANLASH
  //   const handleOptionChange = (optionName, value) => {
  //     const newOptions = { ...selectedOptions, [optionName]: value };
  //     setSelectedOptions(newOptions);
  //     const variant = data?.variants?.find((v) =>
  //       Object.entries(newOptions).every(
  //         ([key, val]) => v.combination[key] === val
  //       )
  //     );
  //     setSelectedVariant(variant || null);
  //     setImageIndex(0);
  //   };
  //   const isOptionAvailable = (optionName, value) => {
  //     const testOptions = { ...selectedOptions, [optionName]: value };
  //     return data?.variants?.some((v) =>
  //       Object.entries(testOptions).every(
  //         ([key, val]) => v.combination[key] === val
  //       )
  //     );
  //   };
  //   const handleAddToCart = () => {
  //     if (!selectedVariant) return message.error("Iltimos, variant tanlang!");
  //     mutate({ id, ...selectedVariant });
  //     if (selectedVariant.stock <= 0)
  //       return message.error("Bu variant tugagan 😔");
  //     message.success("Savatchaga qo‘shildi! 🛒");
  //   };
  //   const imagesToShow = selectedVariant ? selectedVariant.images : data.images;
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-[24px] font-bold">{data.name}</h1>
  //       <div className="lg:flex items-start mt-5 gap-6">
  //         <div className="flex items-start mt-5 gap-6">
  //           {/* Left images */}
  //           <div className="flex flex-col gap-2 h-[350px] overflow-y-scroll hidden-scrollbar">
  //             {imagesToShow.map((img, index) => (
  //               <img
  //                 key={index}
  //                 src={img}
  //                 className="w-[100px] h-[100px] object-contain rounded-xl cursor-pointer"
  //                 style={{
  //                   border:
  //                     imageIndex === index
  //                       ? "2px solid #000"
  //                       : "2px solid transparent",
  //                   transition: "0.2s",
  //                 }}
  //                 onClick={() => setImageIndex(index)}
  //               />
  //             ))}
  //           </div>
  //           {/* Main image */}
  //           <div className="flex items-center justify-center">
  //             {data?.variants?.map((i, index) => {
  //               return i?.images.map((ia) => {
  //                 if (
  //                   i?.combination?.color == selectedVariant?.combination?.color
  //                 ) {
  //                   return (
  //                     <Image
  //                       src={ia}
  //                       width={300}
  //                       className="w-[350px] h-[350px] object-contain"
  //                       style={{
  //                         transition: "0.5s",
  //                         borderRadius: "20px",
  //                       }}
  //                     />
  //                   );
  //                 }
  //               });
  //             })}
  //           </div>
  //         </div>
  //         {/* Product details */}
  //         <div className="lg:w-[350px] flex flex-col gap-4">
  //           1
  //           <div className="flex gap-10 w-full">
  //             <h2 className="text-2xl font-semibold">{data.name}</h2>
  //             <p className="text-xl font-bold text-green-600">
  //               {selectedVariant ? `$${selectedVariant.price}` : `$${data.price}`}
  //             </p>
  //             <p className="text-gray-600">{data.description}</p>
  //           </div>
  //           {/* Options */}
  //           <div className="flex items-center">
  //             <Typography></Typography>
  //             <div className="flex items-center">
  //               {data?.variants?.map((opt, idx) => {
  //                 return (
  //                   <img
  //                     src={opt?.images[0]}
  //                     alt=""
  //                     className="w-[50px]"
  //                     onClick={() => {
  //                       console.log(opt?.combination?.color);
  //                     }}
  //                   />
  //                 );
  //               })}
  //             </div>
  //           </div>
  //           {data.options?.map((opt, idx) => {
  //             return (
  //               <div key={idx} className="flex gap-3 items-center flex-wrap">
  //                 <span className="font-medium">
  //                   {opt.name !== "color" ? opt.name : ""}
  //                 </span>
  //                 {opt.name == "memory"
  //                   ? opt.values.map((val, vIdx) => {
  //                       const isSelected = selectedOptions[opt.name] === val;
  //                       const available = isOptionAvailable(opt.name, val);
  //                       return (
  //                         <button
  //                           key={vIdx}
  //                           style={{ borderRadius: "7px", padding: "2px 5px" }}
  //                           className={`rounded border
  //                       ${
  //                         isSelected
  //                           ? "border-black font-bold cursor-pointer"
  //                           : "border-gray-300 border-transparent"
  //                       }
  //                       ${
  //                         !available
  //                           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
  //                           : "hover:bg-gray-100"
  //                       }
  //                     `}
  //                           onClick={() =>
  //                             available && handleOptionChange(opt.name, val)
  //                           }
  //                           disabled={!available}
  //                         >
  //                           {val}
  //                         </button>
  //                       );
  //                     })
  //                   : ""}
  //               </div>
  //             );
  //           })}
  //           {/* Stock info */}
  //           {selectedVariant && (
  //             <p className="text-sm">
  //               <strong>Qoldiq:</strong>{" "}
  //               {selectedVariant.stock > 0
  //                 ? `${selectedVariant.stock} dona`
  //                 : "Tugagan"}
  //             </p>
  //           )}
  //           <Button
  //             onClick={handleAddToCart}
  //             disabled={!selectedVariant || selectedVariant.stock <= 0}
  //             className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
  //           >
  //             Add to Cart
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  // export default ProductNameId;
}
{
  // import { useQuery } from "@tanstack/react-query";
  // import axios from "axios";
  // import { useState } from "react";
  // import { useParams } from "react-router-dom";
  // import { message } from "antd";
  // import "./Product.css";
  // const ProductNameId = () => {
  //   const { id } = useParams();
  //   const [imageIndex, setImageIndex] = useState(0);
  //   // variantlar uchun tanlangan qiymatlar
  //   const [selectedOptions, setSelectedOptions] = useState({});
  //   const [selectedVariant, setSelectedVariant] = useState(null);
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["product-name-id", id],
  //     queryFn: async () => {
  //       const res = await axios.get("http://localhost:3000/api/products");
  //       return res?.data.find((p) => p._id === id);
  //     },
  //   });
  //   if (isLoading) return <p>Loading...</p>;
  //   if (isError) return <p>Error loading product</p>;
  //   if (!data) return <p>No product found</p>;
  //   // variant tanlash
  //   const handleOptionChange = (optionName, value) => {
  //     const newOptions = { ...selectedOptions, [optionName]: value };
  //     setSelectedOptions(newOptions);
  //     const variant = data?.variants?.find((v) =>
  //       Object.entries(newOptions).every(
  //         ([key, val]) => v.combination[key] === val
  //       )
  //     );
  //     setSelectedVariant(variant || null);
  //   };
  //   // bu qiymat variantlar ichida mavjudmi?
  //   const isOptionAvailable = (optionName, value) => {
  //     const testOptions = { ...selectedOptions, [optionName]: value };
  //     return data?.variants?.some((v) =>
  //       Object.entries(testOptions).every(
  //         ([key, val]) => v.combination[key] === val
  //       )
  //     );
  //   };
  //   const handleAddToCart = () => {
  //     if (!selectedVariant) {
  //       return message.error("Iltimos, variant tanlang!");
  //     }
  //     if (selectedVariant.stock <= 0) {
  //       return message.error("Bu variant tugagan 😔");
  //     }
  //     message.success("Savatchaga qo‘shildi!");
  //     // TODO: savatchaga qo‘shish logikasi
  //   };
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-[24px] font-bold">{data.name}</h1>
  //       <div className="flex items-start mt-5 gap-6">
  //         {/* Chapdagi kichik rasmlar */}
  //         <div className="flex flex-col gap-2 h-[350px] overflow-y-scroll hidden-scrollbar">
  //           {data.images.map((i, index) => (
  //             <img
  //               key={index}
  //               src={i}
  //               className="w-[100px] h-[100px] object-contain rounded-xl cursor-pointer"
  //               style={{
  //                 border:
  //                   imageIndex === index
  //                     ? "2px solid #000"
  //                     : "2px solid transparent",
  //                 transition: "0.2s",
  //               }}
  //               onClick={() => setImageIndex(index)}
  //             />
  //           ))}
  //         </div>
  //         {/* Asosiy rasm */}
  //         <div className="flex items-center justify-center">
  //           <img
  //             src={data.images[imageIndex]}
  //             className="w-[400px] h-[400px] object-contain"
  //             style={{ transition: "0.5s" }}
  //           />
  //         </div>
  //         {/* Product tafsilotlari */}
  //         <div className="w-[350px] flex flex-col gap-4">
  //           <h2 className="text-2xl font-semibold">{data.name}</h2>
  //           <p className="text-xl font-bold text-green-600">
  //             {selectedVariant ? `$${selectedVariant.price}` : `$${data.price}`}
  //           </p>
  //           <p className="text-gray-600">{data.description}</p>
  //           {/* Options */}
  //           {data.options?.map((opt, idx) => (
  //             <div key={idx} className="flex gap-3 items-center flex-wrap">
  //               <span className="font-medium">{opt.name}:</span>
  //               {opt.values.map((val, vIdx) => {
  //                 const isSelected = selectedOptions[opt.name] === val;
  //                 const available = isOptionAvailable(opt.name, val);
  //                 return (
  //                   <button
  //                     key={vIdx}
  //                     className={`px-3 py-1 border rounded transition
  //                       ${
  //                         isSelected
  //                           ? "border-black font-semibold"
  //                           : "border-gray-300"
  //                       }
  //                       ${
  //                         !available
  //                           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
  //                           : "hover:bg-gray-100"
  //                       }
  //                     `}
  //                     onClick={() =>
  //                       available && handleOptionChange(opt.name, val)
  //                     }
  //                     disabled={!available}
  //                   >
  //                     {val}
  //                   </button>
  //                 );
  //               })}
  //             </div>
  //           ))}
  //           {/* Tanlangan variant haqida */}
  //           {selectedVariant && (
  //             <p className="text-sm">
  //               <strong>Qoldiq:</strong>{" "}
  //               {selectedVariant.stock > 0
  //                 ? `${selectedVariant.stock} dona`
  //                 : "Tugagan"}
  //             </p>
  //           )}
  //           <button
  //             onClick={handleAddToCart}
  //             disabled={!selectedVariant || selectedVariant.stock <= 0}
  //             className="bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
  //           >
  //             Add to Cart
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
}
{
  // import { useQuery } from "@tanstack/react-query";
  // import axios from "axios";
  // import { useState } from "react";
  // import { useParams } from "react-router-dom";
  // const ProductNameId = () => {
  //   const { name, id } = useParams();
  //   const [imageIndex, setImageIndex] = useState(0);
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["product-name-id", id], // queryKey bo‘sh bo‘lmasin
  //     queryFn: async () => {
  //       const res = await axios.get("http://localhost:3000/api/products");
  //       return res?.data.filter((p) => p._id === id);
  //     },
  //   });
  //   if (isLoading) return <p>Loading...</p>;
  //   if (isError) return <p>Error loading product</p>;
  //   if (!data || data.length === 0) return <p>No product found</p>;
  //   console.log(data[0]);
  //   return (
  //     <>
  //       <div>
  //         <h1
  //           className="text-[20px]"
  //           style={{
  //             fontWeight: "bold",
  //           }}
  //         >
  //           {data[0].name}
  //         </h1>
  //         <div className="flex items-center">
  //           <div className="flex gap-2 justify-between flex-col">
  //             {data[0].images.map((i, index) => {
  //               return (
  //                 <img
  //                   src={i}
  //                   className={`w-[150px] h-[150px] object-contain rounded-xl cursor-pointer transition-[0.6s]`}
  //                   style={{
  //                     border:
  //                       imageIndex === index
  //                         ? "1px solid #000"
  //                         : "1px solid transparent",
  //                     transition: "0.2s",
  //                   }}
  //                   onClick={() => {
  //                     setImageIndex(index);
  //                   }}
  //                 />
  //               );
  //             })}
  //           </div>
  //           <div className="flex items-center">
  //             {
  //               <img
  //                 src={data[0].images[imageIndex]}
  //                 className="w-[600px] h-[600px] object-contain"
  //                 style={{ transition: "0.9s" }}
  //               />
  //             }
  //             {/* {data[0].images.slice(0, data[0].images.length - 2).map((i => {
  //                         return
  //                     }))} */}
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };
  // export default ProductNameId;
}
