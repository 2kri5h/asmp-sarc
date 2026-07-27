import React, { useEffect, useState } from "react";
import UseFetchMentors from "../../hooks/useFetchMentors";
// import { mentorsListConsult } from '../../data/noncore_consult';
import MentorCard from "../Mentors/MentorCard";

const Marketing = () => {
  const FIELDS = [
    // ['core_engineering', 'Core engineering'],
    // ['civil_services', 'Civil Services/Govt. of India'],
    // ['design', 'Design'],
    // ['finance', 'Finance'],
    // ['it', 'IT'],
    // ['management', 'Management'],
    // ['management_consulting', 'Management consulting'],
    ["marketing", "Marketing"],
    // ['product_management', 'Product Management'],
    // ['research', 'Research'],
    // ['strategy_consulting', 'Strategy consulting'],
    // ['entrepreneurship', 'Entrepreneurship'],
    // ['other', 'Other'],
  ];

  const [currField, setCurrField] = React.useState(FIELDS[0][0]);

  const { fetchMentors, loading, error, mentors, setMentors } =
    UseFetchMentors();
  function fetchMentorsByField(field) {
    setMentors(null);
    fetchMentors(field);
    setCurrField(field);
  }
  useEffect(() => {
    fetchMentors(currField);
  }, [currField, fetchMentors]);

  const handleFieldChange = (field) => {
    setCurrField(field);
  };
  if (loading || !mentors) {
    return (
      <>
        <div className="mentorbtncontainer">
          {FIELDS.map((field, index) => {
            return (
              <button
                className="mentorbutton"
                style={{
                  backgroundColor: currField == field[0] ? "orange" : "#3498db",
                }}
                key={index}
                onClick={() => {
                  fetchMentorsByField(field[0]);
                }}
              >
                {field[1]}
              </button>
            );
          })}
        </div>
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </>
    );
  }
  return (
    <div className="bs-example" style={{ backgroundColor: "transparent" }}>
      <div className="tab-content">
        <div className="tab-pane fade show active" id="marketing">
          <div
            className="wishlist-mentor-cards-ka-div"
            id="t05"
          >
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading &&
              !error &&
              mentors &&
              mentors.map((mentor, index) => (
                <MentorCard
                  // key={index}
                  // work_profile={mentor.work_profile}
                  // company_name={mentor.company_name}
                  // experience={mentor.designation}
                  // year={mentor.year}
                  key={index}
                  mentor={mentor}
                  mentors={mentors}
                  setMentors={setMentors}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
