import React, { useState, useEffect } from "react";
import "../Wishlist/Wishlist_MentorCards.css";
import Swal from "sweetalert2";
import axios from "axios";
import UseAddToWishlist from "../../hooks/useAddToWishlist";
import UseDeleteFromWishlist from "../../hooks/useDeleteFromWishlist";
import UseFetchWishlist from "../../hooks/useFetchWishlist";
import batmanLogoSvg from "../../assets/images/Batman-Logo-2018 1.svg";
import companyNameSvg from "../../assets/images/Company Name.svg";
import subtractSvg from "../../assets/images/Subtract.svg";
import rectangle47Svg from "../../assets/images/Rectangle 47.svg";
import subtractCardSvg from "../../assets/Subtract.svg";
import unionCardSvg from "../../assets/Union.svg";
import ellipseSvg from "../../assets/Ellipse 7.svg";
import { API_BASE_URL } from "../../apiConfig";

const getDesignationStyle = (text) => {
  if (!text) return { fontStyle: "normal" };
  const len = text.length;
  // BatmanForeverAlternate is very wide
  if (len > 32) return { fontSize: "9.5px", lineHeight: "11.5px", letterSpacing: "0.01em" };
  if (len > 22) return { fontSize: "11px", lineHeight: "13px", letterSpacing: "0.02em" };
  if (len > 12) return { fontSize: "13px", lineHeight: "15px", letterSpacing: "0.03em" };
  return { fontSize: "14.5px", lineHeight: "16.5px", letterSpacing: "0.04em" };
};

const getCompanyStyle = (text) => {
  if (!text) return { fontStyle: "normal" };
  const len = text.length;
  // Exima Geometric is narrower
  if (len > 32) return { fontSize: "8.5px", lineHeight: "10.5px" };
  if (len > 20) return { fontSize: "10px", lineHeight: "12px" };
  if (len > 12) return { fontSize: "12px", lineHeight: "14px" };
  return { fontSize: "14px", lineHeight: "16px" };
};

const getCircleDesignationStyle = (text) => {
  if (!text) return { fontStyle: "normal" };
  const len = text.length;
  if (len > 45) return { fontSize: "11px", lineHeight: "14px", whiteSpace: "normal" };
  if (len > 30) return { fontSize: "12.5px", lineHeight: "16px", whiteSpace: "normal" };
  if (len > 18) return { fontSize: "14px", lineHeight: "18px", whiteSpace: "normal" };
  return { fontSize: "15.5px", lineHeight: "20px", whiteSpace: "normal" };
};

const getCircleCompanyStyle = (text) => {
  if (!text) return { fontStyle: "normal" };
  const len = text.length;
  if (len > 60) return { fontSize: "11px", lineHeight: "14px" };
  if (len > 40) return { fontSize: "13px", lineHeight: "16.5px" };
  if (len > 25) return { fontSize: "15px", lineHeight: "19px" };
  if (len > 15) return { fontSize: "17.5px", lineHeight: "22px" };
  return { fontSize: "20px", lineHeight: "25px" };
};

const getExperienceText = (mentor) => {
  if (!mentor) return "2 Yrs";
  if (mentor.experience) return mentor.experience;
  if (mentor.exp) return mentor.exp;
  const gradYear = parseInt(mentor.year || mentor.graduation_year, 10);
  if (!isNaN(gradYear) && gradYear > 1950 && gradYear <= 2026) {
    const years = Math.max(1, 2026 - gradYear);
    return `${years} Yrs`;
  }
  return "2 Yrs";
};

const UnifiedMentorCard = ({
  mentor,
  mentors,
  setMentors,
  mode = "display", // "display", "wishlist", "selection", "profile"
  onSelect = null,
  onDelete = null,
  onRemove = null,
  showAddButton = true,
  showRemoveButton = false,
  isRegistered = false,
  preferenceIndex = null,
  isAlreadySelected = false,
}) => {
  const [clicked, setClicked] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addMentor } = UseAddToWishlist();
  const { deleteMentor } = UseDeleteFromWishlist();

  // Check if mentor is in wishlist on mount or when mentor id changes
  useEffect(() => {
    let isMounted = true;
    const checkWishlist = async () => {
      const accessToken = localStorage.getItem("accessToken") || "82cf3f73-f995-4d72-92bb-7c158a38232a";
      let mentorInWishlist = false;

      // First check localWishlist for instant UI response
      try {
        const local = JSON.parse(localStorage.getItem("localWishlist") || "[]");
        if (local.includes(mentor.id)) {
          mentorInWishlist = true;
        }
      } catch (e) {}

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/registration/wishlist/`,
          {
            params: { accessToken },
            headers: { "Content-Type": "application/json" }
          }
        );
        if (response.status === 200 && isMounted) {
          const list = response.data || [];
          if (list.some((item) => item.id === mentor.id)) {
            mentorInWishlist = true;
          }
        }
      } catch (err) {
        console.warn("Error checking API wishlist status:", err);
      }

      if (isMounted) {
        setIsInWishlist(mentorInWishlist);
      }
    };

    if (mentor && mentor.id) {
      checkWishlist();
    }
    return () => {
      isMounted = false;
    };
  }, [mentor?.id]);

  const handleWishlistAction = async (e) => {
    if (e) e.stopPropagation();
    if (isInWishlist) {
      await deleteFromWishlist(mentor.id);
    } else {
      await addToWishlist(mentor.id);
    }
  };

  const handleRemoveFromWishlist = async () => {
    console.log("Clicked!");
    setClicked((prevState) => !prevState);
    await deleteFromWishlist(mentor.id);
  };

  async function addToWishlist(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to add this mentor to the wishlist",
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
        await addMentor(id);
        setIsInWishlist(true);
        Swal.fire({
          title: "Added!",
          text: "Mentor has been added to wishlist.",
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

  async function deleteFromWishlist(id) {
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
        setIsInWishlist(false);
        if (mode === "wishlist" || mode === "selection") {
          if (setMentors && mentors) {
            const newMentors = [...mentors];
            let something = newMentors.filter((m) => m.id == id)[0];
            if (something) {
              newMentors.splice(newMentors.indexOf(something), 1);
              setMentors(newMentors);
            }
          }
        }
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

  const handleSelect = () => {
    if (onSelect) {
      onSelect(mentor);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(mentor.id);
    } else {
      handleRemoveFromWishlist();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  // For Selection / Modal mode
  if (mode === "selection") {
    return (
      <div className="wishlist-figma-card selection-card">
        {/* 1. Top Batman Logo Emblem (Batman-Logo-2018 1.svg) */}
        <img
          src={batmanLogoSvg}
          alt="Batman Logo"
          className="wishlist-batman-logo"
        />

        {/* 2. Outer Wireframe Frame (Subtract.svg 240px x 258px) */}
        <img
          src={subtractSvg}
          alt="Outer Wireframe"
          className="wishlist-subtract-bg"
        />

        {/* 3. Inner Wireframe Box (Rectangle 47.svg 205px x 231px) */}
        <div className="wishlist-inner-card-box">
          <img
            src={rectangle47Svg}
            alt="Inner Wireframe"
            className="wishlist-rect47-bg"
          />

          {/* Content overlaid inside Rectangle 47 */}
          <div className="wishlist-card-content selection-card-content">
            <div className="selection-card-text-scroll">
              <div className="wishlist-card-designation selection-card-designation" style={getDesignationStyle(mentor?.designation || mentor?.work_profile)}>
                {(mentor?.designation || mentor?.work_profile || "Associate Product Manager").toUpperCase()}
              </div>

              <div className="wishlist-card-company-text selection-card-company-text" style={getCompanyStyle(mentor?.company_name || mentor?.name)}>
                {mentor?.company_name || mentor?.name || "Company Name"}
              </div>
            </div>

            {/* Vertical Stacked Buttons */}
            <div className="selection-card-buttons">
              <button
                className={`selection-btn select-action-btn${isAlreadySelected ? " already-selected-btn" : ""}`}
                onClick={isAlreadySelected ? undefined : handleSelect}
                disabled={isAlreadySelected}
                style={isAlreadySelected ? { background: "#2a6e3f", cursor: "default", opacity: 1 } : {}}
              >
                {isAlreadySelected ? "SELECTED ✓" : "SELECT"}
              </button>
              <button className="selection-btn remove-action-btn" onClick={handleDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For Profile Mode (Preference Cards)
  if (mode === "profile") {
    const prefNum = (preferenceIndex !== null && preferenceIndex !== undefined) ? preferenceIndex + 1 : 1;
    return (
      <div className="profile-preference-card-wrapper">
        <div className="preference-label">
          Preference {prefNum}
        </div>
        <div className="wishlist-figma-card profile-pref-card" onClick={!mentor ? onSelect : undefined}>
          {/* Top Bat Logo */}
          <img src={batmanLogoSvg} alt="Bat Logo" className="wishlist-batman-logo" />

          {/* Outer Wireframe */}
          <img src={subtractSvg} alt="Subtract" className="wishlist-subtract-bg" />

          {/* Inner Wireframe */}
          <div className="wishlist-inner-card-box">
            <img src={rectangle47Svg} alt="Rect47" className="wishlist-rect47-bg" />

            <div className="wishlist-card-content">
              {mentor ? (
                <>
                  <div className="wishlist-card-designation" style={getDesignationStyle(mentor.designation || mentor.work_profile)}>
                    {(mentor.designation || mentor.work_profile || "Associate Product Manager").toUpperCase()}
                  </div>
                  <div className="wishlist-card-company-text" style={getCompanyStyle(mentor.company_name || mentor.name)}>
                    {mentor.company_name || mentor.name || "Company Name"}
                  </div>
                  <div className="wishlist-card-divider"></div>
                  <div className="wishlist-card-info-scroll">
                    <div className="wishlist-card-grad">
                      <span className="wishlist-bat-label">Graduation year:</span> <span className="wishlist-grad-val">{mentor.year || mentor.graduation_year || "2023"}</span>
                    </div>
                    <div className="wishlist-card-exp">
                      <span className="wishlist-bat-label">Experience:</span>
                      <div className="wishlist-exp-body">{mentor.work_profile || getExperienceText(mentor)}</div>
                    </div>
                  </div>
                  <button
                    className="wishlist-card-remove-btn-inner"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemove) onRemove();
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <div className="please-select-pref-text">
                    Please select your Preference {prefNum}
                  </div>
                  <button
                    className="wishlist-card-remove-btn-inner select-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelect) onSelect();
                    }}
                  >
                    Select
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For Wishlist Mode, render exact Figma wireframe card layout using Subtract.svg & Rectangle 47.svg
  if (mode === "wishlist") {
    return (
      <div className="wishlist-figma-card">
        {/* 1. Top Batman Logo Emblem (Batman-Logo-2018 1.svg) */}
        <img
          src={batmanLogoSvg}
          alt="Batman Logo"
          className="wishlist-batman-logo"
        />

        {/* 2. Outer Wireframe Frame (Subtract.svg 240px x 258px) */}
        <img
          src={subtractSvg}
          alt="Outer Wireframe"
          className="wishlist-subtract-bg"
        />

        {/* 3. Inner Wireframe Box (Rectangle 47.svg 205px x 231px) */}
        <div className="wishlist-inner-card-box">
          <img
            src={rectangle47Svg}
            alt="Inner Wireframe"
            className="wishlist-rect47-bg"
          />

          {/* Content overlaid inside Rectangle 47 */}
          <div className="wishlist-card-content">
            <div className="wishlist-card-designation" style={getDesignationStyle(mentor?.designation || mentor?.work_profile)}>
              {(mentor?.designation || mentor?.work_profile || "Associate Product Manager").toUpperCase()}
            </div>

            <div className="wishlist-card-company-text" style={getCompanyStyle(mentor?.company_name || mentor?.name)}>
              {mentor?.company_name || mentor?.name || "Company Name"}
            </div>

            <div className="wishlist-card-divider"></div>

            <div className="wishlist-card-info-scroll">
              <div className="wishlist-card-grad">
                <span className="wishlist-bat-label">Graduation year:</span> <span className="wishlist-grad-val">{mentor?.year || mentor?.graduation_year || "2023"}</span>
              </div>
              <div className="wishlist-card-exp">
                <span className="wishlist-bat-label">Experience:</span>
                <div className="wishlist-exp-body">{mentor?.work_profile || getExperienceText(mentor)}</div>
              </div>
            </div>

            {/* 4. Remove Button inside Inner Content Box */}
            <button className="wishlist-card-remove-btn-inner" onClick={handleDelete}>
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }


  // For display mode — Group 48 structure with Subtract.png, Union.png, and Ellipse 7.svg:
  return (
    <div className="mentor-capsule-wrapper">
      <div className="mentor-capsule-card" data-mode={mode}>

        {/* 1. SUBTRACT BLOCK: Top section (Designation + Company Name) */}
        <div
          className="mentor-card-subtract"
          style={{ backgroundImage: `url(${subtractCardSvg})` }}
        >
          <div className="mentor-card-top-scroll">
            <div
              className="mentor-card-designation"
              style={getCircleDesignationStyle(mentor?.designation || mentor?.work_profile)}
            >
              {(mentor?.designation || "Associate Product Manager").toUpperCase()}
            </div>
            <div
              className="mentor-card-company"
              style={getCircleCompanyStyle(mentor?.company_name || mentor?.name)}
            >
              {mentor?.company_name || mentor?.name || "Company Name"}
            </div>
          </div>
        </div>

        {/* 2. UNION BLOCK: Bottom section (Graduation Year + Experience + Ellipse 7.svg) */}
        <div
          className="mentor-card-union"
          style={{ backgroundImage: `url(${unionCardSvg})` }}
        >



          {/* Graduation Year above Experience, inline format */}
          <div className="mentor-card-grad-row">
            Graduation year: <span className="mentor-card-grad-val">{mentor?.year || mentor?.graduation_year || "2023"}</span>
          </div>

          {/* Experience section below Graduation Year */}
          <div className="mentor-card-exp-label">Experience:</div>
          <div className="mentor-card-exp-scroll">
            <div className="mentor-card-exp-text">
              {mentor?.work_profile || "—"}
            </div>
          </div>

          {/* Ellipse 7.svg Wishlist Button */}
          <div
            className={`mentor-card-ellipse-7 ${isInWishlist ? "active" : ""}`}
            onClick={
              mode === "wishlist" && showRemoveButton
                ? handleDelete
                : handleWishlistAction
            }
          >
            <img src={ellipseSvg} alt="Wishlist shape" className="mentor-ellipse-svg-img" />
            <div className="mentor-wishlist-btn-text">
              {mode === "wishlist" && showRemoveButton
                ? "REMOVE"
                : isInWishlist
                ? "IN WISHLIST ✓"
                : "ADD TO WISHLIST"}
            </div>
          </div>
        </div>

      </div>
    </div>
  );






};

export default UnifiedMentorCard;







