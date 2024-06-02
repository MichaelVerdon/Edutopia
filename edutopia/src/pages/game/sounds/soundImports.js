import select_sound from "./sfx/select_sound.mp3";
import purchase_sound from "./sfx/purchase_sound.mp3";
import start_trumpet_sound from "./sfx/start_trumpet_sound.mp3";
import land_select from "./sfx/land_select.mp3";

// Take sounds by index.
const sounds = [
   new Audio(select_sound), // Index 0
   new Audio(purchase_sound), // Cha-Ching!
   new Audio(start_trumpet_sound),
   new Audio(land_select)
];

export default sounds;