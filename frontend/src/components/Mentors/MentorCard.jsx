import React from "react";
import UnifiedMentorCard from "./UnifiedMentorCard";

const MentorCard = ({ mentor, mentors, setMentors }) => {
  return (
    <UnifiedMentorCard
      mentor={mentor}
      mentors={mentors}
      setMentors={setMentors}
      mode="display"
      showAddButton={true}
    />
  );
};

export default MentorCard;
