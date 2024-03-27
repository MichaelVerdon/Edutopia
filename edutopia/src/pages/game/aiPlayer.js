import PlayerObject from "./PlayerObject";

// Inherit from PlayerObject Class so they can have all functionalities of player class.
class aiPlayer extends PlayerObject{

    constructor (playerId){
        super(playerId)
        this.difficulty = this.setDifficulty();
    }

    // Difficulty is set between 1 and 4 which will be used as a multiplier for
    // probability or answering correctly. e.t.c difficulty of 2 means 2*0.25 = 0.5 probability of answering correctly
    setDifficulty(){
        return Math.floor(Math.random() * 4) + 1;
    }

    answerQuestion(){
        const probability = this.difficulty * 0.25; // Probability of getting answer right
        const randomValue = Math.random(); // Generate a random number between 0 and 1

        // Check if the probability is greater which means the answer is correct
        if (randomValue <= probability) {
            return true;
        } else {
            return false;
        }
    }
}

export default aiPlayer;