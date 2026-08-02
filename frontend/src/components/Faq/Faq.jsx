import React, { useState,useEffect, useRef } from "react";
import "./Faq.css";
import Accordion from "react-bootstrap/Accordion";

const FAQs = () => {
  const faqsData = [
    {
      question: "Approximately how many days will it take to get the mentor and further information regarding the process?",
      answer: "You will be allocated a mentor or be given further information regarding your allocation within 7 days.",
    },
    {
      question: "What is the time for which I will be allocated a mentor?",
      answer: " Your mentor is being assigned to you for a year officially, but most people build lifelong bonds with their mentors and remain in touch even after the program ends.",
    },
    {
      question: "How will I get notified about the process?",
      answer: "You will receive emails notifying you about all the updates regarding the allocation. You will also receive contact details of your allocated mentor and information about the interactive sessions scheduled by us via email.",
    },
    {
      question: "How will my personal details be used?",
      answer: "Your personal details such as your name, roll number, and contact information will remain confidential. Only the allocated mentor will have access to your contact information.",
    },
    {
      question: "What is the process after registration for a mentee?",
      answer: "A mentor will be allocated to you based on your preferences and SOPs after the registration is completed. You have to initiate the conversation with your mentor and then you can mutually decide the way ahead. We will also have a few follow-ups for your assistance.",
    },
    {
      question: "I am having trouble registering. What should I do?",
      answer: "There might be an issue with webmail due to which you may not be receiving the verification mail. Wait for webmail to be up again and you will be good to go. If you are facing any other issue, contact the ASMP or Web team as soon as possible.",
    },
  ];
  const faqRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const scrollToFAQ = () => {
      faqRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    window.addEventListener('scrollToFaq', scrollToFAQ);

    return () => {
      window.removeEventListener('scrollToFaq', scrollToFAQ);
    };
  }, []);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div id="faq" ref={faqRef}>
      <div id="faqheader"
        style={{
          marginTop: "2%",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          fontWeight: "700",
          lineHeight: "1.2",
          textAlign: "center",
          marginLeft: "5%",
          marginRight: "5%",
          color: "white",
        }}
      >
        FAQ's
      </div>
      <div className="flex  bg-[#3f4f5b] from-gray-950 from-0% via-slate-800 via-43.5% to-black 87.5% mt-4 mb-0 ml-16 mr-16 p-4 text-white opacity-70 rounded-[25px]">
        <Accordion defaultActiveKey="0">
          {faqsData.map((item, index) => {
            return (
              <Accordion.Item eventKey={index} key={index} >
                <Accordion.Header className="font-fraunces pt-5">
                  {item.question}
                </Accordion.Header>
                <Accordion.Body className="font-fraunces pb-5 mt-2">
                  {item.answer}
                </Accordion.Body>
                <div className="border-1 w-full mt-2"></div>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </div>
      <div className="faq-footer"></div>
    </div>
  );
};

export default FAQs;