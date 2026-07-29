import React from 'react';
import About from "../About/About";
import Home from "./Home";
import Event from "../Events/Events";
import Faq from "../Faq/Faq";
import TestimonialSlider from "../Testimonials/Testimonial";
import CursorAnimation from "../Cursor/CursorAnimation";
import Footer from "../Footer/Footer";
import './Homee.css';

export default function Homee() {
  return (
    <>
      <CursorAnimation />
      <div className='home-background-image'>
        <div style={{width:'100vw',height:'7vh',backgroundColor:'transparent'}}></div>
        <Home />
        <About />
        <Event />
        <div id="testimonials"></div>
        <TestimonialSlider />
        <div id="faq"></div>
        <Faq />
        <Footer />
      </div>
    </>
  );
}