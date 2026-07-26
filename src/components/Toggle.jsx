import React, { useState, useEffect, useRef } from "react";
import "./Toggle.css";
import CursorAnimation from "./CursorAnimation";
import UnifiedMentorCard from "./UnifiedMentorCard";
import UseFetchMentors from "../hooks/useFetchMentors";
import batLogoImg from "../assets/images/download__80_-removebg-preview 2.png";
import homeBg from "../assets/images/Justice bleeds black 1.png";

const MOCK_MENTORS = [
  {
    id: 1,
    name: "Mohit Yadav",
    company_name: "Amazon",
    designation: "Associate Product Manager",
    year: "2023",
    experience: "2 Yrs",
    work_profile: "Product Management",
    field: "product_management"
  },
  {
    id: 2,
    name: "Priya Sharma",
    company_name: "McKinsey & Co",
    designation: "Strategy Consultant",
    year: "2022",
    experience: "3 Yrs",
    work_profile: "Management Consulting",
    field: "management_consulting"
  },
  {
    id: 3,
    name: "Rahul Verma",
    company_name: "Google",
    designation: "Senior SDE",
    year: "2021",
    experience: "4 Yrs",
    work_profile: "Software Engineering",
    field: "software"
  },
  {
    id: 4,
    name: "Ananya Roy",
    company_name: "Goldman Sachs",
    designation: "Investment Analyst",
    year: "2023",
    experience: "2 Yrs",
    work_profile: "Quantitative Finance",
    field: "finance"
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    company_name: "ISRO / DRDO",
    designation: "Lead Systems Engineer",
    year: "2020",
    experience: "5 Yrs",
    work_profile: "Aerospace Engineering",
    field: "core_engineering"
  },
  {
    id: 6,
    name: "Sneha Patel",
    company_name: "Boston Consulting Group",
    designation: "Business Analyst",
    year: "2022",
    experience: "3 Yrs",
    work_profile: "Strategy & Operations",
    field: "strategy_consulting"
  }
];

const LEFT_CORE_FIELDS = [
  { id: "core_engineering", label: "Core Engineering" },
  { id: "research", label: "Research" },
  { id: "it", label: "IT / Software" },
  { id: "analytics", label: "Analytics" },
  { id: "civil_services", label: "Civil Services / Govt." }
];

const RIGHT_NONCORE_FIELDS = [
  { id: "management_consulting", label: "Management Consulting" },
  { id: "strategy_consulting", label: "Strategy Consulting" },
  { id: "finance", label: "Finance" },
  { id: "product_management", label: "Product Management" },
  { id: "design", label: "Design & Marketing" }
];

const Toggle = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeField, setActiveField] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const observerTarget = useRef(null);
  const { fetchMentors, mentors, setMentors } = UseFetchMentors();

  useEffect(() => {
    fetchMentors(activeField);
    setVisibleCount(12);
  }, [activeField, fetchMentors]);

  useEffect(() => {
    const target = observerTarget.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 12);
        }
      },
      { threshold: 0.1 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  const handleFieldClick = (fieldId) => {
    if (activeField === fieldId) {
      setActiveField("all");
    } else {
      setActiveField(fieldId);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveField("all");
  };

  const displayMentors = (() => {
    let list = (mentors && mentors.length > 0) ? mentors : MOCK_MENTORS;
    if (selectedCategory === "core") {
      const coreIds = LEFT_CORE_FIELDS.map(f => f.id);
      list = list.filter(m => coreIds.includes(m.pref || m.field));
    } else if (selectedCategory === "noncore") {
      const nonCoreIds = RIGHT_NONCORE_FIELDS.map(f => f.id);
      list = list.filter(m => nonCoreIds.includes(m.pref || m.field));
    }
    return list;
  })();

  return (
    <>
      <CursorAnimation />
      <div 
        className="figma-mentor-landing"
        style={{ backgroundImage: `url(${homeBg})` }}
      >
        <div className="landing-overlay"></div>

        <div className="figma-content-container">
          {/* Top Bat Badges Row */}
          <div className="top-bat-row">
            {/* CORE Bat Logo Button */}
            <div 
              className={`bat-badge-box left-bat ${selectedCategory === "core" ? "active" : ""}`}
              onClick={() => handleCategoryClick(selectedCategory === "core" ? "all" : "core")}
            >
              <div className="bat-symbol-shape">
                <img src={batLogoImg} alt="Bat Logo" className="bat-png-img" />
              </div>
              <div className="bat-badge-text">CORE</div>
            </div>

            {/* NON CORE Bat Logo Button */}
            <div 
              className={`bat-badge-box right-bat ${selectedCategory === "noncore" ? "active" : ""}`}
              onClick={() => handleCategoryClick(selectedCategory === "noncore" ? "all" : "noncore")}
            >
              <div className="bat-symbol-shape">
                <img src={batLogoImg} alt="Bat Logo" className="bat-png-img" />
              </div>
              <div className="bat-badge-text">NON CORE</div>
            </div>
          </div>

          {/* 10 Filter Pill Rectangles Grid */}
          <div className="filter-rectangles-container">
            {/* Left Column (5 pills) */}
            <div className="filter-column left-col">
              {LEFT_CORE_FIELDS.map((item) => (
                <button
                  key={item.id}
                  className={`filter-rectangle-btn ${activeField === item.id ? "active" : ""}`}
                  onClick={() => handleFieldClick(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Column (5 pills) */}
            <div className="filter-column right-col">
              {RIGHT_NONCORE_FIELDS.map((item) => (
                <button
                  key={item.id}
                  className={`filter-rectangle-btn ${activeField === item.id ? "active" : ""}`}
                  onClick={() => handleFieldClick(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mentor Cards Grid Section */}
          <div className="mentor-cards-section">
            <div className="mentor-cards-grid">
              {displayMentors.slice(0, visibleCount).map((mentor, index) => (
                <div key={mentor.id || index} className={`mentor-grid-item card-pos-${index + 1}`}>
                  <UnifiedMentorCard
                    mentor={mentor}
                    mentors={displayMentors}
                    setMentors={setMentors}
                    mode="display"
                    showAddButton={true}
                  />
                </div>
              ))}
            </div>
            {/* Infinite Scroll Sentinel */}
            <div ref={observerTarget} style={{ height: "40px", width: "100%" }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Toggle;
