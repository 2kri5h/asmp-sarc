import React from "react";
import UnifiedMentorCard from "../Mentors/UnifiedMentorCard";

const Wishlist_MentorCard = ({ mentor, mentors, setMentors }) => {
  return (
    <UnifiedMentorCard
      mentor={mentor}
      mentors={mentors}
      setMentors={setMentors}
      mode="wishlist"
      showRemoveButton={true}
    />
  );
};

export default Wishlist_MentorCard;