// LandingPage.js

import "./LandingPage.css";
import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const handlePlayClick = () => {
    console.log("play game");
  };

  return (
    <div className="landing-page">
      <div className="hexagon-container">
        <div className="landingPageHexagon">
          <div className="hexagon-inner">E</div>
        </div>

        <div className="landingPageHexagon">
          <div className="hexagon-inner">d</div>
        </div>

        <div className="landingPageHexagon">
          <div className="hexagon-inner">u</div>
        </div>

        <div className="landingPageHexagon">
          <div className="hexagon-inner">t</div>
        </div>

        <div className="landingPageHexagon">
          <div className="hexagon-inner">o</div>
        </div>

        <div className="landingPageHexagon">
          <div className="hexagon-inner">p</div>
        </div>

        <div className="landingPageHexagon">
          <div className="hexagon-inner">i</div>
        </div>

        <div className="landingPageHexagon">
          <div className="hexagon-inner">a</div>
        </div>
      </div>

      <div className="button-container">
        <Link to="/game">
          <button onClick={handlePlayClick} className="play-button">
            Play
          </button>
        </Link>
        <button className="options-button">Options</button>
      </div>
    </div>
  );
}

export default LandingPage;
