import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./swiper-custom.css";
import img1 from '/testimonials/image1.jpg'
import img2 from '/testimonials/image2.jpg'
import img3 from '/testimonials/image3.jpg'
import img4 from '/testimonials/image4.jpg'

const testimonials = [
  {
    name: "Preksha PC",
    image: img1,
    feedback:
      "When I signed up for ASMP, I had no idea what to expect—but it turned out to be incredible. My mentor not only shared his expertise but also his inspiring journey. Visiting the Pilgrim office and the insightful sessions he organized gave me a real glimpse into the industry. I've learned so much and feel like I've gained a mentor for life.",
  },
  {
    name: "Anuj Yadav",
    image: img2,
    feedback:
      "My ASMP mentorship was truly memorable. My mentor made the experience insightful and personal. He broke down complex ideas in finance and quant, tailored his advice to my interests, and constantly encouraged me to think deeper. His support felt more like a friendship than a formality, and it has left a lasting impact on my confidence.",
  },
  {
    name: "Kartik Padiya",
    image: img3,
    feedback:
      "Having an ASMP mentor has been one of the most meaningful parts of my journey. My mentor was always supportive, offering honest guidance, whether it was career advice, project doubts, or just when I felt stuck. Over time, our bond grew from scheduled calls to spontaneous conversations. ASMP helped me build a truly valuable and lasting connection.",
  },
  {
    name: "Aarya Gaikwad",
    image: img4,
    feedback:
      "ASMP program was a game-changer for me. The experience with my mentor was incredibly helpful. He was approachable, quick to respond, and always offered clear, practical advice. Even in brief interactions, he made an effort to support and guide me. His mentorship played a meaningful role in my learning, and I'm truly grateful for it."
  },
];

const TestimonialSlider = () => {
  const testimonialRef = useRef(null);

  useEffect(() => {
    const scrollToTestimonial = () => {
      testimonialRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("scrollToTestimonials", scrollToTestimonial);

    return () => {
      window.removeEventListener("scrollToTestimonials", scrollToTestimonial);
    };
  }, []);

  return (
    <div
      ref={testimonialRef}
      id="testimonials"
      style={{
        background: "transparent",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="testimonials-panel">
        <div
          className="testimonialHeading"
          id="TestimoinalHeading"
          style={{
            marginTop: "2%",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            fontWeight: "700",
            lineHeight: "1.2",
            textAlign: "center",
            marginLeft: "5%",
            marginRight: "5%",
            color: "rgba(255, 255, 255, 1)",
          }}
        >
          TESTIMONIALS
        </div>
        <div className="slider-container">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          centeredSlides={true}
          onImagesReady={(swiper) => swiper.update()}
          breakpoints={{
            1300: { slidesPerView: 3, spaceBetween: 50 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            480: { slidesPerView: 1, spaceBetween: 20 },
            0: { slidesPerView: 1, spaceBetween: 15 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <div className="avatar-wrapper">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="avatar-img"
                  />
                </div>
                <div className="name-heading" id="TestimonialHeading">
                  {testimonial.name}
                </div>
                <div className="testimonal-content" id="TestimonialContent">
                  {testimonial.feedback}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;