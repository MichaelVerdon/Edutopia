import './LandingPage.css';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import sounds from './game/sounds/soundImports.js';

function LandingPage() {

    const handlePlayClick = () => {
        sounds[0].play()
    }

    return (

        <div className="landing-page">

            <div class="hexagon-container">
                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    E
                    </div>
                </div>

                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    d
                    </div>
                </div>

                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    u
                    </div>
                </div>

                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    t
                    </div>
                </div>

                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    o
                    </div>
                </div>

                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    p
                    </div>
                </div>

                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    i
                    </div>
                </div>

                <div class="landingPageHexagon">
                    <div class="hexagon-inner">
                    a
                    </div>
                </div>
            </div>
            
            <div className="button-container">
                <Link to="/game">
                    <button onClick={handlePlayClick} className="play-button">Play</button>
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;
