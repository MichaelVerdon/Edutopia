import React, { Component } from 'react';
import { Hexagon, Text, Pattern } from 'react-hexgrid';
import {Tile} from './Tile';
import GameSettings from './GameSettings';
import plains from './plains.png'; 
import mountain from './mountain.png'; 

class InteractiveHexagon extends Component {
  constructor(props) {
    super(props);
    // Initialise the Tile with coordinates
    this.tile = new Tile(props.q, props.r);
    this.state = {
      inputText: "",
      isClicked: false,
    };
    this.handleHexClick = this.handleHexClick.bind(this);
  }

  timeoutId = null;

  handleHexClick() {
    console.log("Hexagon clicked: ", this.props.q, this.props.r);
    this.setState(prevState => ({ isClicked: !prevState.isClicked }));

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.setState({ isClicked: false });
      this.timeoutId = null; // Clear the timeoutId
    }, 5000);

    // Handle text input/change logic
    if (this.state.inputText) {
      const changeText = window.confirm(`Current text for Hexagon at (${this.tile.coordinates.x}, ${this.tile.coordinates.y}): ${this.state.inputText}\nDo you want to change it?`);
      if (changeText) {
        const newUserInput = prompt(`Enter new text for Hexagon at (${this.tile.coordinates.x}, ${this.tile.coordinates.y}):`, this.state.inputText);
        if (newUserInput !== null && newUserInput.trim() !== '') {
          this.setState({ inputText: newUserInput });
        }
      }
    } else {
      const newUserInput = prompt(`Enter text for Hexagon at (${this.tile.coordinates.x}, ${this.tile.coordinates.y}):`, "");
      if (newUserInput !== null && newUserInput.trim() !== '') {
        //this.setState({ inputText: newUserInput });
        console.log("Current tile text: ", newUserInput)
      }
    }
    
    console.log(this.tile.getTileInfo());
    console.log("Backgorund image \n", this.tile.getBackgroundImageForBiome());
    
  }

  render() {
    const { size, q, r } = this.props;
    
    const patternId1 = 'patternPlains';
    const patternId2 = 'patternMountain';
    const plainsPattern = this.tile.biome === "Plains" ? (
      <RotatedPattern id={patternId1} link={plains} size={{ x: 30, y: 30 }} />
    ) : null;

    const mountainPattern = this.tile.biome === "Mountain" ? (
      <RotatedPattern id={patternId2} link={mountain} size={{ x: 30, y: 30 }} />
    ) : null;

    return (
      <React.Fragment>
        {plainsPattern}
        {mountainPattern}
        <Hexagon
          q={q} r={r} s={-q - r}
          size={size}
          fill={this.tile.biome === "Plains" ? patternId1 : this.tile.biome === "Mountain" ? patternId2 : "none"}
          onClick={this.handleHexClick}
          style={{
            stroke: this.state.isClicked ? 'red' : 'black',
            strokeWidth: this.state.isClicked ? 2 : 1,
            pointerEvents: 'all'
            
          }}
        >
          <Text
            x="0"
            y="0"
            fontSize={size.x * 0.5}
            textAnchor="middle"
            stroke='black'
            fill="black"
            //style={{ pointerEvents: 'all' }}
          >
            {this.state.inputText || `${q},${r}`}
          </Text>
        </Hexagon>
      </React.Fragment>
    );
  }
}
const RotatedPattern = ({ id, link }) => (
  <svg style={{ height: 0 }}>
    <defs>
      <pattern id={id} patternUnits="objectBoundingBox" width="1" height="1" viewBox="0 0 30 30" preserveAspectRatio="xMidYMid slice">
        <g transform="rotate(30, 15, 15)"> {/* Rotate around the center */}
          <image href={link} x="0" y="0" width="30" height="30" preserveAspectRatio="xMidYMid slice" />
        </g>
      </pattern>
    </defs>
  </svg>
);

export default InteractiveHexagon;
