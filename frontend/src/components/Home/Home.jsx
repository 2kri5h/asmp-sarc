import React from "react";
import asmpLogoSvg from "../../assets/asmp-logo.svg";
import batmanSvg from "../../assets/batman.svg";
import "./Home.css";

export default function Home() {
  return (
    <div id="mainsection" className="home-hero-container">
      <img
        src={batmanSvg}
        alt="Batman Emblem"
        className="hero-batman-svg"
        loading="eager"
        fetchPriority="high"
      />
      <img
        src={asmpLogoSvg}
        id="img"
        alt="ASMP Logo"
        className="homeback-img"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}