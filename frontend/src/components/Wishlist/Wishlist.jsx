import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import Swal from "sweetalert2";
import UseFetchWishlist from "../../hooks/useFetchWishlist";
import UseDeleteFromWishlist from "../../hooks/useDeleteFromWishlist";
import Wishlist_MentorCard from "./Wishlist_MentorCards";
import { Link } from "react-router-dom";
import gothamBg from "../../assets/images/Gotham City 2 1.png";

const MOCK_WISHLIST = [
  {
    id: 1,
    name: "Mohit Yadav",
    company_name: "Amazon",
    designation: "Associate Product Manager",
    year: "2023",
    experience: "2 Yrs",
    work_profile: "Product Management"
  },
  {
    id: 2,
    name: "Priya Sharma",
    company_name: "McKinsey & Co",
    designation: "Strategy Consultant",
    year: "2022",
    experience: "3 Yrs",
    work_profile: "Management Consulting"
  },
  {
    id: 3,
    name: "Rahul Verma",
    company_name: "Google",
    designation: "Senior SDE",
    year: "2021",
    experience: "4 Yrs",
    work_profile: "Software Engineering"
  },
  {
    id: 4,
    name: "Ananya Roy",
    company_name: "Goldman Sachs",
    designation: "Investment Analyst",
    year: "2023",
    experience: "2 Yrs",
    work_profile: "Quantitative Finance"
  }
];

export default function Wishlist(props) {
  const { fetchMentors, mentors, setMentors } = UseFetchWishlist();
  const { deleteMentor } = UseDeleteFromWishlist();

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const displayMentors = Array.isArray(mentors) ? mentors : [];

  async function handleDeleteMentor(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this mentor from wishlist",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES",
      cancelButtonText: "CANCEL",
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
        confirmButton: 'custom-swal-confirm-btn',
        cancelButton: 'custom-swal-cancel-btn',
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteMentor(id);
        const newMentors = displayMentors.filter((m) => m.id !== id);
        setMentors(newMentors);
        Swal.fire({
          title: "Removed!",
          text: "Mentor has been removed from wishlist.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-confirm-btn',
          },
          buttonsStyling: false
        });
      }
    });
  }

  return (
    <>
      <div 
        className="wishlist-page-container"
        style={{ backgroundImage: `url(${gothamBg})` }}
      >
        <div className="wishlist-overlay"></div>

        <div className="wishlist-content-wrapper">
          <div className="wishlist-header-space"></div>

          {/* Wishlist Cards Grid Section (2 Columns matching Figma) */}
          <div className="wishlist-cards-section">
            {displayMentors.length > 0 ? (
              <div className="wishlist-grid-container">
                {displayMentors.map((mentor, index) => (
                  <div key={mentor.id || index} className="wishlist-grid-card-wrapper">
                    <Wishlist_MentorCard 
                      mentor={mentor} 
                      mentors={displayMentors} 
                      setMentors={setMentors} 
                      onDelete={handleDeleteMentor}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-wishlist-msg">
                <h2>No mentors in the wishlist</h2>
              </div>
            )}
          </div>

          <div className="register-action-container">
            <Link to="/profile">
              <button className="proceed-register-btn">
                Proceed to Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
