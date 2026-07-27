import React, { useState, useEffect } from "react";
import "./Profile.css";
import UseFetchProfile from "../../hooks/useFetchProfile";
import UseEditProfile from "../../hooks/useEditProfile";
import UseRegisterMentors from "../../hooks/useRegisterMentors";
import WishlistModal from "../Wishlist/WishlistModal";
import CursorAnimation from "../Cursor/CursorAnimation";
import Swal from "sweetalert2";
import UnifiedMentorCard from "../Mentors/UnifiedMentorCard";

import registerTitleSvg from "../../assets/images/Register.svg";
import preferencesTitleSvg from "../../assets/images/Preferences.svg";
import batmanLogoSvg from "../../assets/images/Batman-Logo-2018 1.svg";
import profileBgImg from "../../assets/images/profile_bg.png";

import rollNumberSvg from "../../assets/images/Roll Number.svg";
import usernameSvg from "../../assets/images/Username.svg";
import ldapSvg from "../../assets/images/LDAP.svg";
import personalEmailSvg from "../../assets/images/Personal Email.svg";
import hostelSvg from "../../assets/images/Hostel.svg";
import roomNoSvg from "../../assets/images/Room No..svg";
import academicSvg from "../../assets/images/Academic.svg";
import sopSvg from "../../assets/images/Statement Of Purpose.svg";
import expectationsSvg from "../../assets/images/What are your Expectations from your Mentor.svg";

export default function Profile(props) {
  const DEGREE_CHOICES = {
    btech: "B.Tech.",
    bs: "B.S.",
    dual_degree: "Dual Degree",
    mtech: "M.Tech.",
    msc: "M.Sc.",
    phd: "PhD",
    other_degree: "Other Degree",
  };

  const BRANCH_CHOICES = {
    aero: "Aerospace Engineering",
    biosci: "Biosciences & Bioengineering",
    che: "Chemical Engineering",
    chem: "Chemistry",
    civil: "Civil Engineering",
    cle: "Centre for Liberal Education",
    cse: "Computer Science & Engineering",
    earthsci: "Earth Sciences and Resource Engineering",
    eco: "Economics",
    ee: "Electrical Engineering",
    energy: "Energy Science & Engineering",
    engphy: "Engineering Physics / Physics",
    envsci: "Environmental Science & Engineering (ESED)",
    geo: "Applied Geophysics",
    hss: "Humanities and Social Science (HSS)",
    ieor: "Industrial Engineering and Operations Research",
    math: "Mathematics",
    mech: "Mechanical Engineering",
    metallurgy: "Metallurgical Engineering & Materials Science (MEMS)",
    mgmt: "Shailesh J. Mehta School of Management (SJMSoM)",
    rural: "Centre for Technology Alternatives for Rural Areas (CTARA)",
    design: "IDC School of Design (IDC SoD)",
    other: "Other (If not mentioned above)",
  };

  const { editProfile } = UseEditProfile();
  const { fetchProfile, fetchedProfile } = UseFetchProfile();
  const { registerMentors } = UseRegisterMentors(props);

  const [profile, setProfile] = useState({
    user: {},
    email: "",
    hostel: "",
    room_no: "",
    academic_program: "",
    joining_year: "",
    graduation_year: "",
    linkedin: "",
    sop: "",    
    expectations: "",
  });

  const [preferences, setPreferences] = useState(() => {
    // Restore draft preferences from localStorage on mount
    try {
      const saved = localStorage.getItem("draftPreferences");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 5) return parsed;
      }
    } catch (e) {}
    return [null, null, null, null, null];
  });
  const [showWishlist, setShowWishlist] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
    };
    loadProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (fetchedProfile && fetchedProfile.user) {
      setProfile({
        user: fetchedProfile.user || {},
        email: fetchedProfile.email || "",
        hostel: fetchedProfile.hostel || "",
        room_no: fetchedProfile.room_no || "",
        academic_program: fetchedProfile.academic_program || "",
        joining_year: fetchedProfile.joining_year || "",
        graduation_year: fetchedProfile.graduation_year || "",
        linkedin: fetchedProfile.linkedin || "",
        sop: fetchedProfile.sop || "",
        expectations: fetchedProfile.expectations || "",
      });

      if (fetchedProfile.preferences && Array.isArray(fetchedProfile.preferences)) {
        // Only load from backend if no draft already saved locally
        const hasDraft = (() => {
          try {
            const saved = localStorage.getItem("draftPreferences");
            return saved && JSON.parse(saved).some((p) => p !== null);
          } catch { return false; }
        })();
        if (!hasDraft) {
          const loadedPrefs = [null, null, null, null, null];
          fetchedProfile.preferences.forEach((pref, index) => {
            if (index < 5) {
              loadedPrefs[index] = pref.mentor || null;
            }
          });
          setPreferences(loadedPrefs);
        }
      }

      if (fetchedProfile.is_registered) {
        setIsRegistered(true);
      }
    }
  }, [fetchedProfile]);

  // Persist draft preferences to localStorage whenever they change
  useEffect(() => {
    if (!isRegistered) {
      localStorage.setItem("draftPreferences", JSON.stringify(preferences));
    }
  }, [preferences, isRegistered]);

  // Derive already-selected mentor IDs for the modal
  const selectedMentorIds = preferences
    .filter((p) => p !== null)
    .map((p) => p.id);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleCardClick = (index) => {
    if (!isRegistered) {
      setActiveCard(index);
      setShowWishlist(true);
    }
  };

  const handleRemove = (index) => {
    if (!isRegistered) {
      const updatedPrefs = [...preferences];
      updatedPrefs[index] = null;
      setPreferences(updatedPrefs);
    }
  };

  const handleMentorSelect = (mentor) => {
    if (activeCard !== null) {
      const updatedPrefs = [...preferences];
      updatedPrefs[activeCard] = mentor;
      setPreferences(updatedPrefs);
      setShowWishlist(false);
      setActiveCard(null);
    }
  };

  const handleRegisteration = async (e) => {
    if (e) e.preventDefault();

    if (!profile.sop) {
      Swal.fire("Error!", "Statement of Purpose is required.", "error");
      return;
    }

    const hasPreference = preferences.some((pref) => pref !== null);
    if (!hasPreference) {
      Swal.fire("Error!", "Please select at least one mentor preference.", "error");
      return;
    }

    try {
      await editProfile({
        hostel: profile.hostel,
        room_no: profile.room_no,
        joining_year: profile.joining_year,
        graduation_year: profile.graduation_year,
        sop: profile.sop,
        expectations: profile.expectations,
      });

      const selectedMentors = preferences
        .filter((pref) => pref !== null)
        .map((pref) => pref.id);

      await registerMentors(selectedMentors);
      setIsRegistered(true);
      localStorage.removeItem("draftPreferences"); // Clear draft on successful registration

      Swal.fire({
        title: "Success!",
        text: "Your profile and mentor preferences have been registered successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire("Error!", "Registration failed. Please try again.", "error");
    }
  };

  return (
    <>
      <CursorAnimation />
      <div 
        className="profile-page-container"
        style={{ backgroundImage: `url(${profileBgImg})` }}
      >
        <div className="profile-overlay"></div>

        <div className="profile-main-content">
          <div className="profile-header-space"></div>

          {/* Top Title Graphic (Register.svg) */}
          <div className="profile-title-graphic-container">
            <img src={registerTitleSvg} alt="REGISTER" className="profile-register-title-img" />
          </div>

          {/* Registration Form Fields */}
          <form className="profile-form-grid" onSubmit={handleRegisteration}>
            {/* Row 1: Roll Number */}
            <div className="profile-form-row">
              <div className="profile-label label-svg-wrapper">
                <img src={rollNumberSvg} alt="ROLL NUMBER" className="label-svg-graphic" />
              </div>
              <div className="profile-input-frame text-display-field">
                {fetchedProfile?.user?.roll_number || "25B3004"}
              </div>
            </div>

            {/* Row 2: Username */}
            <div className="profile-form-row">
              <div className="profile-label label-svg-wrapper">
                <img src={usernameSvg} alt="USERNAME" className="label-svg-graphic" />
              </div>
              <div className="profile-input-frame text-display-field">
                {fetchedProfile?.user?.first_name || fetchedProfile?.user?.username || "krish"}
              </div>
            </div>

            {/* Row 3: LDAP */}
            <div className="profile-form-row">
              <div className="profile-label label-svg-wrapper">
                <img src={ldapSvg} alt="LDAP" className="label-svg-graphic" />
              </div>
              <div className="profile-input-frame text-display-field">
                {fetchedProfile?.user?.email || "25b3004@iitb.ac.in"}
              </div>
            </div>

            {/* Row 4: Personal Email */}
            <div className="profile-form-row">
              <div className="profile-label label-svg-wrapper">
                <img src={personalEmailSvg} alt="PERSONAL EMAIL" className="label-svg-graphic" />
              </div>
              <div className="profile-input-frame">
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  placeholder="Personal Email"
                  className="profile-field-input"
                />
              </div>
            </div>

            {/* Row 5: Hostel */}
            <div className="profile-form-row">
              <div className="profile-label label-svg-wrapper">
                <img src={hostelSvg} alt="HOSTEL" className="label-svg-graphic" />
              </div>
              <div className="profile-input-frame">
                <input
                  type="text"
                  name="hostel"
                  value={profile.hostel}
                  onChange={handleInputChange}
                  placeholder="Hostel"
                  className="profile-field-input"
                />
              </div>
            </div>

            {/* Row 6: Room No. / Program */}
            <div className="profile-form-row">
              <div className="profile-label label-svg-wrapper">
                <img src={roomNoSvg} alt="ROOM NO." className="label-svg-graphic" />
              </div>
              <div className="profile-input-frame">
                <input
                  type="text"
                  name="room_no"
                  value={profile.room_no}
                  onChange={handleInputChange}
                  placeholder="Program*"
                  className="profile-field-input"
                />
              </div>
            </div>

            {/* Row 7: Academic Subgrid */}
            <div className="profile-form-row academic-row">
              <div className="profile-label label-svg-wrapper">
                <img src={academicSvg} alt="ACADEMIC" className="label-svg-graphic" />
              </div>
              <div className="academic-subgrid-container">
                <div className="academic-subgrid-top">
                  <div className="academic-sub-box">
                    {BRANCH_CHOICES[fetchedProfile?.user?.dept] || "Department"}
                  </div>
                  <div className="academic-sub-box">
                    {DEGREE_CHOICES[fetchedProfile?.user?.degree] || "Degree*"}
                  </div>
                </div>

                <div className="academic-subgrid-bottom">
                  <div className="academic-sub-box input-box">
                    <input
                      type="text"
                      name="joining_year"
                      value={profile.joining_year}
                      onChange={handleInputChange}
                      placeholder="Joining year*"
                      className="profile-field-input sub-input"
                    />
                  </div>
                  <div className="academic-sub-box input-box">
                    <input
                      type="text"
                      name="graduation_year"
                      value={profile.graduation_year}
                      onChange={handleInputChange}
                      placeholder="Graduating year*"
                      className="profile-field-input sub-input"
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* Row 9: Statement of Purpose */}
            <div className="profile-form-row sop-row">
              <div className="profile-label label-svg-wrapper sop-svg-wrapper">
                <img src={sopSvg} alt="STATEMENT OF PURPOSE" className="label-svg-graphic sop-svg" />
              </div>
              <div className="profile-textarea-frame">
                <textarea
                  name="sop"
                  value={profile.sop}
                  onChange={handleInputChange}
                  placeholder="write your SOP (word limit: 200 words)"
                  className="profile-textarea-input"
                  rows={5}
                />
              </div>
            </div>

            {/* Row 10: Expectations From Mentor */}
            <div className="profile-form-row sop-row">
              <div className="profile-label label-svg-wrapper expectations-svg-wrapper">
                <img src={expectationsSvg} alt="WHAT ARE YOUR EXPECTATIONS FROM YOUR MENTOR" className="label-svg-graphic expectations-svg" />
              </div>
              <div className="profile-textarea-frame">
                <textarea
                  name="expectations"
                  value={profile.expectations}
                  onChange={handleInputChange}
                  placeholder="write your SOP (word limit: 200 words)"
                  className="profile-textarea-input"
                  rows={5}
                />
              </div>
            </div>
          </form>

          {/* Preferences Section Header Graphic (Preferences.svg) */}
          <div className="preferences-header-container">
            <img src={preferencesTitleSvg} alt="PREFERENCES" className="preferences-title-img" />
          </div>

          {/* Preferences Cards Section */}
          <div className="preferences-cards-wrapper">
            {/* Top Row: 3 Cards */}
            <div className="preferences-grid-top">
              {[0, 1, 2].map((index) => (
                <UnifiedMentorCard
                  key={index}
                  mentor={preferences[index]}
                  mode="profile"
                  preferenceIndex={index}
                  onSelect={() => !isRegistered && handleCardClick(index)}
                  onRemove={() => handleRemove(index)}
                  isRegistered={isRegistered}
                />
              ))}
            </div>

            {/* Bottom Row: 2 Cards Centered */}
            <div className="preferences-grid-bottom">
              {[3, 4].map((index) => (
                <UnifiedMentorCard
                  key={index}
                  mentor={preferences[index]}
                  mode="profile"
                  preferenceIndex={index}
                  onSelect={() => !isRegistered && handleCardClick(index)}
                  onRemove={() => handleRemove(index)}
                  isRegistered={isRegistered}
                />
              ))}
            </div>
          </div>

          {/* Bottom Interactive Register Pill Button (Rectangle 72 + Rectangle 73) */}
          <div className="bottom-register-container">
            <button 
              type="button" 
              className="batman-register-pill-btn"
              onClick={handleRegisteration}
              disabled={isRegistered}
            >
              <div className="inner-register-pill">
                <span className="register-text-default">REGISTER</span>
                <img src={batmanLogoSvg} alt="Bat Logo" className="register-bat-hover-img" />
              </div>
            </button>

            {isRegistered && (
              <div className="registration-success-badge">
                ✓ Registration Completed Successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wishlist Modal */}
      {showWishlist && (
        <WishlistModal
          onClose={() => {
            setShowWishlist(false);
            setActiveCard(null);
          }}
          onSelect={handleMentorSelect}
          selectedMentorIds={selectedMentorIds}
        />
      )}
    </>
  );
}