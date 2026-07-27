import React from 'react';
import About from "../About/About";
import Home from "./Home";
import Event from "../Events/Events"
import Faq from "../Faq/Faq";
import TestimonialSlider from "../Testimonials/Testimonial";
import CursorAnimation from "../Cursor/CursorAnimation";
import Lottie from "lottie-react";
import animationData from "../../assets/scroll.json";
import Footer from "../Footer/Footer";
import "./Homee.css";
import BAT from "../ThreeShadowMap/ThreeShadowMap";

export default function Homee() {
  const scrollAnimation = () => {
    window.scrollBy({
      top: 1000,
      behavior: "smooth",
    });
  };

  return (
    <>
      <CursorAnimation />

      <div
        className="home-background-image"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BAT Background Layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <BAT />
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "fixed",
              bottom: "2%",
              right: "2%",
              width: "5%",
              height: "auto",
              zIndex: 1000,
              cursor: "pointer",
            }}
          >
            <Lottie
              animationData={animationData}
              onClick={scrollAnimation}
            />
          </div>

          <div
            style={{
              width: "100vw",
              height: "7vh",
              background: "transparent",
            }}
          />

          <Home />
          <About />
            <Event />
          <div id="testimonials" />
          <TestimonialSlider />
          <div id="faq" />
          <Faq />
          <Footer />
        </div>
      </div>
    </>
  );
}