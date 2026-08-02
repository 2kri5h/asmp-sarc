import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./swiper-custom.css";

import testimonialBg from "../../assets/Testimonial.png";

const testimonials = [
  {
    name: "Preksha PC",
    image: "/testimonials/image1.jpg",
    feedback:
      "When I signed up for ASMP, I had no idea what to expect—but it turned out to be incredible. My mentor not only shared his expertise but also his inspiring journey. Visiting the Pilgrim office and the insightful sessions he organized gave me a real glimpse into the industry. I've learned so much and feel like I've gained a mentor for life.",
  },
  {
    name: "Anuj Yadav",
    image: "/testimonials/image2.jpg",
    feedback:
      "My ASMP mentorship was truly memorable. My mentor made the experience insightful and personal. He broke down complex ideas in finance and quant, tailored his advice to my interests, and constantly encouraged me to think deeper. His support felt more like a friendship than a formality, and it has left a lasting impact on my confidence.",
  },
  {
    name: "Kartik Padiya",
    image: "/testimonials/image3.jpg",
    feedback:
      "Having an ASMP mentor has been one of the most meaningful parts of my journey. My mentor was always supportive, offering honest guidance, whether it was career advice, project doubts, or just when I felt stuck. Over time, our bond grew from scheduled calls to spontaneous conversations. ASMP helped me build a truly valuable and lasting connection.",
  },
  {
    name: "Aarya Gaikwad",
    image: "/testimonials/image4.jpg",
    feedback:
      "ASMP program was a game-changer for me. The experience with my mentor was incredibly helpful. He was approachable, quick to respond, and always offered clear, practical advice. Even in brief interactions, he made an effort to support and guide me. His mentorship played a meaningful role in my learning, and I'm truly grateful for it.",
  },
];

const TestimonialSlider = () => {
  const testimonialRef = useRef(null);
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  useEffect(() => {
    const scrollToTestimonial = () => {
      testimonialRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    window.addEventListener("scrollToTestimonials", scrollToTestimonial);

    return () => {
      window.removeEventListener("scrollToTestimonials", scrollToTestimonial);
    };
  }, []);

  return (
    <section ref={testimonialRef} id="testimonials" className="testimonials-section">
      <div
        className="testimonial-background"
        style={{
          backgroundImage: `url(${testimonialBg})`,
        }}
      />

      <div className="testimonial-outer-box">
        <h2 className="testimonial-heading">TESTIMONIALS</h2>

        <div className="testimonials-swiper">
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl,
              nextEl,
            }}
            loop={true}
            centeredSlides={true}
            grabCursor={true}
            speed={500}
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2.1, spaceBetween: 25 },
              1024: { slidesPerView: 3, spaceBetween: 25 },
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <SwiperSlide key={idx}>
                <article className="testimonial-card">
                  <div className="testimonial-avatar">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.classList.add("avatar-fallback");
                        e.target.parentElement.innerText = testimonial.name.charAt(0);
                      }}
                    />
                  </div>
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-content">{testimonial.feedback}</p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons linked via state ref */}
          <div className="custom-nav-wrapper">
            <button
              ref={(node) => setPrevEl(node)}
              className="custom-prev"
              aria-label="Previous slide"
            >
              &#10094;
            </button>
            <button
              ref={(node) => setNextEl(node)}
              className="custom-next"
              aria-label="Next slide"
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;