import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./SneakPeak.css";
import sneakBg from "../../assets/images/Sneakpeak.png";

const slides = [
  {
    title: "Director, American Express",
    description: "Managing credit risk models for American Express' $350B US small business portfolio, leveraging machine learning to identify and mitigate high-risk customers",
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
    description: "18+ months of experience as a Project Manager in the infrastructure sector and a background as a Financial Advisor in the Ministry of Defence",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Business Finance Head, Google India",
    description: "20+ years of experience across engineering, consulting, and technology, including leadership roles at L&T, Kearney, and Google in digital marketing and business finance",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Climate Change Analyst, World Bank",
    description: "Expertise in international climate change policy, climate finance, and international development, with a focus on sustainable global solutions and policy frameworks",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
  {
    title: "Junior Engagement Manager, McKinsey & Company",
    description: "Consultant with an MBA from IIM Ahmedabad and B.Tech from IIT Bombay. Experienced in management consulting, project management, & operational excellence",
    link: "/Login",
    buttonText: "Grab Mentorship",
  },
];

function Sneakpeak() {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const scroll = () => {
      if (!scrollRef.current || hovering) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
      }
    };

    intervalRef.current = setInterval(scroll, 3000);
    return () => clearInterval(intervalRef.current);
  }, [hovering]);

  const scrollByAmount = (amount) => {
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <>
      <div
        className="sneakpeak-container"
        style={{ backgroundImage: `url(${sneakBg})` }}
      >
        <div className="arrow left" onClick={() => scrollByAmount(-400)}>&#8592;</div>
        <div
          className="scroll-wrapper"
          ref={scrollRef}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {slides.map((slide, i) => (
            <motion.div
              className="mentor-card"
              key={i}
              whileHover={{ scale: 1.1, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="title-section">
                {slide.title.includes(',') ? (
                  <>
                    <h4 className="position-title">
                      <b>{slide.title.split(',')[0]}</b>
                    </h4>
                    <h5 className="company-name">
                      {slide.title.split(',')[1]}
                    </h5>
                  </>
                ) : (
                  <h4><b>{slide.title}</b></h4>
                )}
              </div>
              <p>{slide.description}</p>
              <div className="btn-wrapper">
                <Link to={slide.link}>
                  <button className="cssbuttons-io-button">
                    {slide.buttonText}
                    <div className="icon">
                      <svg height={24} width={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor" />
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="arrow right" onClick={() => scrollByAmount(400)}>&#8594;</div>
      </div>
    </>
  );
}

export default Sneakpeak;