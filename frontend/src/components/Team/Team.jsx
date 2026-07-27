import React from "react";
import "./Team.css";
import instagramIcon from "/teampage/instagram.svg";
import linkedinIcon from "/teampage/linkedin.svg";

// Overall Coordinator
import imageoc1 from "../../assets/images/oc1.jpeg";
import imageoc2 from "../../assets/images/oc2.jpeg";
// ASMP Team
import image9 from "../../assets/images/Bhavya.jpg.jpeg";
import image10 from "../../assets/images/Kartavya.jpg.jpeg";
import image15 from "../../assets/images/Samarveer Singh Virdi.jpeg";
import image16 from "../../assets/images/Shonit Kataria_.jpg";
import image5 from "../../assets/images/Muskan Meena.jpg";
import image14 from "../../assets/images/Sanman Ghanbahadur_.jpg";
import image3 from "../../assets/images/Samruddhi Gavali .jpg";
// Web Team
import image13 from "/teampage/arush.png";
import image11 from "../../assets/images/Indrani.jpg.jpeg";
import image2 from "../../assets/images/Rushikesh.jpg";
import image7 from "../../assets/images/lakhwinder.jpeg";
import image20 from "../../assets/images/img.jpg";
import image21 from "../../assets/images/Geetanjali.png";
import image22 from "../../assets/images/Gaurav.jpeg";
import image23 from "../../assets/images/Krish.png";
// Design Team
import image17 from "../../assets/images/Shravanee.jpg.jpeg";
import image18 from "../../assets/images/Shreyansh.jpg.jpeg";
import image25 from "../../assets/images/Aman.jpg";
import image26 from "../../assets/images/Annu.jpg";
import image27 from "../../assets/images/Mishthi.jpg";
import image28 from "../../assets/images/Simran.jpeg";
import image29 from "../../assets/images/Vesundhara.jpg";
import image30 from "../../assets/images/Suhani.jpg";

import CursorAnimation from "../Cursor/CursorAnimation";

const Team = () => {
  const teamData = {
    overallCoordinator:[
      {
        name: "Sai Sharanya",
        image: imageoc2,
        instagram: "https://www.instagram.com/sai_sharanya_06/?utm_source=ig_web_button_share_sheet",
        linkedin: "https://www.linkedin.com/in/kinnera-sai-sharanya-05b9b9292/",
        phone: "+91 83092 70649",
      },
      {
        name: "Sarvagya Jain",
        image: imageoc1,
        instagram: "https://www.instagram.com/sarvo75/?utm_source=ig_web_button_share_sheet",
        linkedin: "https://www.linkedin.com/in/sarvagya-jain-355798213/",
        phone: "+91 94248 00631",
      },
    ],
    webTeams: [
      {
        title: "ASMP TEAM 2025-26",
        coreMembers: [
          {
            name: "Bhavya Upadhyay",
            image: image9,
            instagram: "https://www.instagram.com/bhavyaupadhyay._?igsh=NjQ1MDY3bG56ZnE1&utm_source=qr",
            linkedin: "https://www.linkedin.com/in/bhavya-upadhyay-baa423332/",
            phone: "+91 70147 25133",
          },
          {
            name: "Kartavya Gupta",
            image: image10,
            instagram: "https://www.instagram.com/kart4vya?igsh=MTd2a3ZjeW1yZTl6Mg%3D%3D&utm_source=qr",
            linkedin: "https://www.linkedin.com/in/guptakartavya/",
            phone: "+91 79055 40591",
          },
        ],
        coordinators: [
          {
            name: "Samarveer Singh Virdi",
            image: image15,
            instagram: "https://www.instagram.com/samarveer_singh_virdi/",
            linkedin: "https://www.linkedin.com/in/samarveer-singh-virdi-7aa714380/",
            phone: "+91 93108 25979",
          },
          {
            name: "Shonit Kataria",
            image: image16,
            instagram: "https://www.instagram.com/shonitkataria/",
            linkedin:
              "https://www.linkedin.com/in/shonit-kataria-095736378/",
            phone: "+91 99231 11519",
          },
          {
            name: "Muskan Meena",
            image: image5,
            instagram: "",
            linkedin: "https://www.linkedin.com/in/muskan-meena-b8728b388/",
            phone: "+91 90127 03289",
          },
          {
            name: "Sanman Ghanbahadur",
            image: image14,
            instagram: "https://www.instagram.com/sanmanvg/",
            linkedin: "https://www.linkedin.com/in/sanman-ghanbahadur-514229379/",
            phone: "+91 92703 99404",
          },
          {
            name: "Samruddhi Gavali",
            image: image3,
            instagram: "https://www.instagram.com/samruddhii_990/",
            linkedin: "https://www.linkedin.com/in/samruddhi-gavali-79064b39b/",
            phone: "+91 94037 75626",
          },
        ],
      },

      {
        title: "WEB TEAM 2025-26",
        coreMembers: [
          {
            name: "Indrani Sahu",
            image: image11,
            instagram: "https://www.instagram.com/infinity.423/",
            linkedin: "https://www.linkedin.com/in/indrani-sahu-358049343/",
            phone: "+91 93020 41423",
          },
        ],
        coordinators: [
          {
            name: "Rushikesh Akkal",
            image: image2,
            instagram: "https://www.instagram.com/rushikesh_akkal/",
            linkedin: "https://www.linkedin.com/in/rushikesh-akkal-a97423373/",
            phone: "+91 75587 99565",
          },
          {
            name: "Disha Agarwal",
            image: image20,
            instagram: "https://www.instagram.com/disha_agarwal001/",
            linkedin: "https://www.linkedin.com/in/disha-agarwal-a01665376/",
            phone: "+91 99281 69642",
          },
          {
            name: "Geetanjali Rajesh Aswar",
            image: image21,
            instagram: "https://www.instagram.com/geetsraswar21/",
            linkedin: "https://www.linkedin.com/in/geetanjali-aswar-0b80b3387/",
            phone: "+91 70380 82878",
          },
          {
            name: "Gaurav",
            image: image22,
            instagram: "https://www.instagram.com/gaurav_vector2.0/",
            linkedin: "linkedin.com/in/gaurav-magdum-73a7b2388/?skipRedirect=true",
            phone: "+91 89624 37646",
          },
          {
            name: "Krish Tandel",
            image: image23,
            instagram: "https://www.instagram.com/krish_tandel.25/",
            linkedin: "https://www.linkedin.com/in/tandelkrish/",
            phone: "+91 90236 01901",
          },
          {
            name: "Lakhwinder Singh",
            image: image7,
            instagram: "https://www.instagram.com/lakhwinder28590/",
            linkedin: "https://www.linkedin.com/in/lakhwinder-singh-89440638a/",
            phone: "+91 83609 70365",
          },
        ],
      },

      {
        title: "DESIGN TEAM 2025-26",
        coreMembers: [
          {
            name: "Shravanee Kulkarni",
            image: image17,
            instagram: "https://www.instagram.com/shravanee_09?igsh=eDZqazd0Y3E1NDRn",
            linkedin: "https://www.linkedin.com/in/shravanee-kulkarni-230989356?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            phone: "+91 95791 65349",
          },
          {
            name: "Shreyansh Singh",
            image: image18,
            instagram: "https://www.instagram.com/shreyansh10.2/?hl=en",
            linkedin: "https://www.linkedin.com/in/shreyansh-singh-103183314/",
            phone: "+91 95204 29992",
          },
        ],
        coordinators: [
          {
            name: "Aman",
            image: image25,
            instagram: "https://www.instagram.com/amanjangid004?igsh=MTg5bTNuODQ1aTMyOQ%3D%3D",
            linkedin: "https://www.linkedin.com/in/aman-jangid-b60b08374?",
            phone: "+91 90793 52217",
          },
          {
            name: "Annu",
            image: image26,
            instagram: "https://www.instagram.com/_annu._87?igsh=dzQ5Nmg4bDJ0Ympu",
            linkedin: "https://www.linkedin.com/in/annu-kumari-416540387/",
            phone: "+91 76329 31266",
          },
          {
            name: "Mishthi",
            image: image27,
            instagram: "https://www.instagram.com/mishthiiii__22?igsh=eTcwYW9kN3hsZ3Vo",
            linkedin: "https://www.linkedin.com/in/mishthi-verma-6b995a3a6/",
            phone: "+91 78770 06492",
          },
          {
            name: "Simran",
            image: image28,
            instagram: "https://www.instagram.com/simran._suhani?igsh=MW5yeGM2dW1qZmY4Yg%3D%",
            linkedin: "https://www.linkedin.com/in/simran-suhani-594866371/",
            phone: "+91 94375 84363",
          },
          {
            name: "Vesundhara",
            image: image29,
            instagram: "https://www.instagram.com/vesundharaa/",
            linkedin: "http://www.linkedin.com/in/vesundhara-fagodia-147382409",
            phone: "+91 70144 90461",
          },
          {
            name: "Suhani",
            image: image30,
            instagram: "https://www.instagram.com/suhanii._.gupta_/?utm_source=ig_web_button_share_sheet",
            linkedin: "",
            phone: "+91 77150 47057",
          },
        ],
      },
    ],
  };

  const renderMember = (member, isOverall = false) => (
    <div className="team-member">
      <div
        className={isOverall ? "image-circle-large" : "image-circle"}
        style={{ backgroundImage: `url(${member.image})` }}
      ></div>
      <div className="name">{member.name}</div>

      {(member.instagram || member.linkedin) && (
        <div className="social-links">
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instagramIcon} alt="Instagram" className="icon" />
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" className="icon" />
            </a>
          )}
        </div>
      )}

      {member.phone && (
        <div
          className="phone-number"
          style={{
            marginTop: "8px",
            color: "white",
            fontSize: "0.9rem",
            padding: "4px 8px",
            borderRadius: "6px",
            backgroundColor: "rgba(255, 255, 255, 0.15)", // translucent white bg
            backdropFilter: "blur(5px)", // blurry glass effect
            WebkitBackdropFilter: "blur(5px)", // for Safari
            display: "inline-block",
            fontWeight: "600",
          }}
          title={`Call ${member.name}`}
        >
          📞 {member.phone}
        </div>
      )}
    </div>
);


  return (
    <>
      <CursorAnimation />
      <div className="team-members">
        <h1 className="headingg">SARC TEAM 2024-25</h1>

        <h2 className="head2">OVERALL COORDINATOR</h2>
        <div className="team-grid-single">
          {teamData.overallCoordinator.map((member, index) => (
    <React.Fragment key={`overall-${index}`}>
      {renderMember(member, true)}
    </React.Fragment>
  ))}
        </div>

        {teamData.webTeams.map((webTeam, teamIndex) => (
          <div key={`web-team-${teamIndex}`}>
            <h1 className="headingg">{webTeam.title}</h1>

            <h2 className="head2">CORE TEAM MEMBERS</h2>
            <div className="team-grid-core">
              {webTeam.coreMembers.map((member, index) => (
                <React.Fragment key={`core-${teamIndex}-${index}`}>
                  {renderMember(member)}
                </React.Fragment>
              ))}
            </div>

            <h3 className="sub-head">COORDINATORS</h3>
            <div className="team-grid-core">
              {webTeam.coordinators
                .filter(
                  (member) =>
                    member.name !== "Jasnoor Kaur" &&
                    member.name !== "Vaibhav Kumar"
                )
                .map((member, index) => (
                  <React.Fragment key={`coord-${teamIndex}-${index}`}>
                    {renderMember(member)}
                  </React.Fragment>
                ))}
            </div>

            <div className="team-grid-core">
              {webTeam.coordinators
                .filter(
                  (member) =>
                    member.name === "Jasnoor Kaur" ||
                    member.name === "Vaibhav Kumar"
                )
                .map((member, index) => (
                  <React.Fragment key={`coord-extra-${teamIndex}-${index}`}>
                    {renderMember(member)}
                  </React.Fragment>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Team;