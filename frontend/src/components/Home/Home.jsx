import React from "react";
import homeback from "../../assets/homeback.png";
import "./Home.css";

export default function Home() {
  return (
    <div id="mainsection" className="home-hero-container">
      <img src={homeback} id="img" alt="ASMP Home" className="homeback-img" />
    </div>
  );
}