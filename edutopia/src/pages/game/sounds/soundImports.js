import select_sound from "./sfx/select_sound.mp3";
import purchase_sound from "./sfx/purchase_sound.mp3";
import start_trumpet_sound from "./sfx/start_trumpet_sound.mp3";
import land_select from "./sfx/land_select.mp3";
import fighting_sound from "./sfx/fighting_sound.mp3";
import correct_sound from './sfx/correct_sound.mp3';
import incorrect_sound from './sfx/incorrect_sound.mp3';
import land_won from './sfx/land_won.mp3';
import land_lost from './sfx/land_lost.mp3';

// Take sounds by index.
const sounds = [
   new Audio(select_sound), // Index 0
   new Audio(purchase_sound), // Cha-Ching!
   new Audio(start_trumpet_sound),
   new Audio(land_select),
   new Audio(fighting_sound),
   new Audio(correct_sound),
   new Audio(incorrect_sound),
   new Audio(land_lost),
   new Audio(land_won),
];

export default sounds;