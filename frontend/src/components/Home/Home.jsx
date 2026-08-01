import React from "react";
import asmpLogo from "../../assets/asmp.png"; 
import "./Home.css";

export default function Home() {
  return (
    <div id="mainsection" className="home-hero-container">
      <img src={asmpLogo} id="img" alt="ASMP Logo" className="homeback-img" />
    </div>
  );
}