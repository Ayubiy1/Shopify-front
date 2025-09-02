import React from "react";
import { Carousel } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const contentStyle = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
const Corusel = () => {
  const { data } = useQuery({
    queryKey: ["corusel-user"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:10000/api/corusel/");

      return res?.data;
    },
  });


  const onChange = (currentSlide) => { };
  return (
    <>
      <Carousel autoplay autoplaySpeed={3000}>
        {data?.map((item, index) => (
          <div key={index}>
            <img
              src={item?.image}
              alt={item?.title}
              style={{ width: "100%", height: "444px", objectFit: "cover", borderRadius: "15px" }}
            />
          </div>
        ))}
      </Carousel>
    </>
  );
};
export default Corusel;
