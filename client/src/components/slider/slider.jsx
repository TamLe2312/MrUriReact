import "./slider.css";
import Carousel from "react-bootstrap/Carousel";
import { useContext, useEffect, useState } from "react";
import { SliderContext } from "../../context/sliderContext";
import * as request from "../../utilities/request";
import { APP_URL } from "../../config/env";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../../context/socketContext";

const Slider = () => {
  const { socket } = useContext(SocketContext);
  const { sliders, setSliders } = useContext(SliderContext);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const run = async () => {
    if (sliders.length > 0) {
      setList(sliders);
    } else {
      const listSlider = await request.getRequest("users/slider");
      // console.log(listSlider);
      setSliders(listSlider.data.results);
      setList(listSlider.data.results);
    }
  };
  const handleRedirect = (item) => {
    navigate(`/categories/${item.category_slug}`);
  };
  useEffect(() => {
    if (socket) {
      socket.on("update_slider", (sliders) => {
        if (sliders.length > 0) {
          setList(sliders);
        } else {
          setList([]);
        }
      });
    }
  }, [socket]);
  useEffect(() => {
    run();
  }, []);
  return (
    list &&
    list.length > 0 && (
      <Carousel fade>
        {list.map((item) => {
          return (
            <Carousel.Item
              className="carouselItem"
              key={item.id}
              onClick={() => handleRedirect(item)}
            >
              <img
                src={APP_URL + "/public/uploads/" + item.img}
                alt={item.alt}
              />
            </Carousel.Item>
          );
        })}
      </Carousel>
    )
  );
};

export default Slider;
