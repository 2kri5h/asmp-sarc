import React from "react";
import homeback from "../../assets/homeback.png";
import ThreeShadowMap from "../ThreeShadowMap/ThreeShadowMap";
import "./Home.css";

export default function Home() {
  return (
    <div id="mainsection" className="home-hero-container">
      <img src={homeback} id="img" alt="ASMP Home" className="homeback-img" />
      <div className="bat-entrance-layer">
        <ThreeShadowMap />
      </div>
    </div>
  );
}