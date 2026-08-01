import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import "./SneakPeak.css";
import sneakBg from "../../assets/images/Sneakpeak.png";

const slides = [
  {
    title: "Director, American Express",
    description:
      "Managing credit risk models for American Express' $350B US small business portfolio, leveraging machine learning to identify and mitigate high-risk customers",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Vice President, Citi Group",
    description: "AI researcher with 15 years' experience, including a PhD from INRIA Rennes",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "IAS Officer, Government of India",
    description: "Experienced IAS officer responsible for both policy formulation and execution",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Deputy Commissioner of Income Tax, Ministry of Finance",
    description:
      "18+ months of experience as a Project Manager in the infrastructure sector and a background as a Financial Advisor in the Ministry of Defence",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Business Finance Head, Google India",
    description:
      "20+ years of experience across engineering, consulting, and technology, including leadership roles at L&T, Kearney, and Google in digital marketing and business finance",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Climate Change Analyst, World Bank",
    description:
      "Expertise in international climate change policy, climate finance, and international development, with a focus on sustainable global solutions and policy frameworks",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Junior Engagement Manager, McKinsey & Company",
    description:
      "Consultant with an MBA from IIM Ahmedabad and B.Tech from IIT Bombay. Experienced in management consulting, project management, & operational excellence",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
];

function Sneakpeak() {
  const swiperRef = useRef(null);

  return (
    <>
      <div
        className="sneakpeak-container"
        style={{ backgroundImage: `url(${sneakBg})` }}
      >
        {/* Custom arrows — pinned to the full container, independent of the
            narrower .mySwiper box width */}
        <div
          className="arrow left"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          &#8592;
        </div>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={40}
          loop={true}
          navigation={false}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 1,
            scale: 0.85,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="mySwiper"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i} className="mentor-slide">
              <motion.div
                className="mentor-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="title-section">
                  {slide.title.includes(",") ? (
                    <>
                      <h4 className="position-title">
                        <b>{slide.title.split(",")[0]}</b>
                      </h4>
                      <h5 className="company-name">{slide.title.split(",")[1]}</h5>
                    </>
                  ) : (
                    <h4>
                      <b>{slide.title}</b>
                    </h4>
                  )}
                </div>
                <p>{slide.description}</p>
                <div className="btn-wrapper">
                  <Link to={slide.link}>
                    <button className="cssbuttons-io-button">
                      {slide.buttonText}
                      <div className="icon">
                        <svg
                          height={24}
                          width={24}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path
                            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </button>
                  </Link>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className="arrow right"
          onClick={() => swiperRef.current?.slideNext()}
        >
          &#8594;
        </div>
      </div>
    </>
  );
}

export default Sneakpeak;