import React, { useEffect, useRef } from "react";
import { Button, Carousel } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const contentStyle = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
const Corusel = () => {
  const carouselRef = useRef(null);

  const { data } = useQuery({
    queryKey: ["corusel-user"],
    queryFn: async () => {
      const res = await axios.get("https://angry-korie-developerayubiy-4da36956.koyeb.app/api/corusel/", {
        withCredentials: true,
      });

      return res?.data;
    },
  });

  useEffect(() => {
    data?.forEach((item) => {
      axios.patch(`https://angry-korie-developerayubiy-4da36956.koyeb.app/api/corusel/${item._id}/view`);
    });
  }, []);

  const handleClick = (id) => {
    axios.patch(`https://angry-korie-developerayubiy-4da36956.koyeb.app/api/corusel/${id}/click`);
  };

  const onChange = (currentSlide) => {};
  return (
    <>
      <div style={{ position: "relative" }}>
        <Carousel ref={carouselRef} autoplay autoplaySpeed={2000}>
          {data?.map((item, index) => (
            <div key={index}>
              <img
                src={item?.image}
                alt={item?.title}
                onClick={() => handleClick(item._id)}
                style={{
                  width: "100%",
                  height: "444px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
            </div>
          ))}
        </Carousel>

        <Button
          shape="circle"
          icon={<LeftOutlined />}
          onClick={() => carouselRef.current.prev()}
          style={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
          }}
        />

        {/* NEXT */}
        <Button
          shape="circle"
          icon={<RightOutlined />}
          onClick={() => carouselRef.current.next()}
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
          }}
        />
      </div>
    </>
  );
};
export default Corusel;
