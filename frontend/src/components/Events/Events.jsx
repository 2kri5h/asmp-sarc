import React, { useState, useRef, useEffect } from "react";
import "./Events.css";
import CursorAnimation from "../Cursor/CursorAnimation";

const EventImages = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const scrollRefs = useRef([]);
  const animationRefs = useRef([]);

  const events = [
    {
      id: 1,
      title: "Break The Ice",
      imgSrc: "/events/breaktheice.jpg",
      description:
        "Break the Ice is the flagship event of the Alumni Student Mentorship Program that is conducted during the Alumination. The event focuses on bringing mentors and mentees involved in the regular ASMP phase together so that they can interact with each other over lunch. Besides lunch, a number of other informal activities are organized and a photo booth is also set up so as to create an atmosphere suited for an open and free interaction.",
    },
    {
      id: 2,
      title: "Shadow Program",
      imgSrc: "/events/shadowprogram.jpg",
      description:
        "Students get the opportunity to visit alumni workplaces and gain insights into corporate life. The program involves discussions with alumni, introductions to co-workers, and observations of work methodologies. Past visits have included companies like the Bombay Stock Exchange (BSE), National Stock Exchange (NSE), and Hindustan Unilever Limited (HUL).",
    },
    {
      id: 3,
      title: "Nail The Prep",
      imgSrc: "/events/ntp.jpg",
      description:
        "SARC provides an opportunity to all third year students to be a part of mock internship interview program - Nail The Prep, which is planned to engage students in mock interviews with our highly esteemed alumni. NTP generally happens in July, wherein our alumni with the experience in different fields like Finance, consult, PM, IT, software etc. take mock interviews of students who are targeting internships. NTP also involves a QnA session named as Ask The Alum (ATA) to clarify students' doubts about internship season.",
    },
    {
      id: 4,
      title: "Group Mentoring",
      imgSrc: "/events/groupmentoring.jpg",
      description:
        "Group mentoring is a networking and learning opportunity where students can connect with successful alumni and fellow students who share similar interests. In these sessions, experienced alumni from various fields such as finance, consulting, IT, analytics, and product management interact with small groups of 4-5 students in an offline format. It's a chance to gain insights, ask questions, and receive guidance in a focused and personalized setting, allowing the students to explore specific career options and expand their professional network.",
    },
  ];

  const handleClick = (index) => {
    if(window.innerWidth > 768) return;
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    animationRefs.current.forEach((id) => {
      if (id) cancelAnimationFrame(id);
    });

    if (activeIndex === null) return;

    const el = scrollRefs.current[activeIndex];
    if (!el) return;

    // Mobile → Manual Scroll
    if (window.innerWidth <= 768) {
      el.style.position = "static";
      el.style.top = "0";
      el.style.transform = "none";

      if (el.parentElement) {
        el.parentElement.scrollTop = 0;
      }

      return;
    }

    // Desktop → Auto Scroll
    el.style.position = "absolute";
    el.style.top = "100%";

    const step = () => {
      const currentTop = parseFloat(el.style.top);

      if (currentTop <= 0) {
        el.style.top = "0px";
        return;
      }

      el.style.top = `${currentTop - 1}px`;

      animationRefs.current[activeIndex] =
        requestAnimationFrame(step);
    };

    animationRefs.current[activeIndex] =
      requestAnimationFrame(step);

    return () => {
      animationRefs.current.forEach((id) => {
        if (id) cancelAnimationFrame(id);
      });
    };
  }, [activeIndex]);

    return (
    <>
      <CursorAnimation />

      <div
        className="main-container-events"
        style={{
          backgroundColor: "transparent",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="heading">Events</h1>

        <div className="event-images-container">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="event-item"
              onClick={() => handleClick(index)}
            >
              <div className="flip-container">
                <div
                  className={`flipper ${
                    activeIndex === index ? "flipped" : ""
                  }`}
                >
                  {/* FRONT */}
                  <div className="front">
                    <img
                      src={event.imgSrc}
                      alt={event.title}
                      className="event-image"
                    />
                  </div>

                  {/* BACK */}
                  <div className="back">
                    <div className="event-description">
                      <div className="scroll-wrapper">
                        <div
                          className="scroll-content"
                          ref={(el) =>
                            (scrollRefs.current[index] = el)
                          }
                        >
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="event-title">
                <p>{event.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EventImages;