import Player from './PlayerObject';

class GameHandler{

    constructor(players){
        // players will be an array of Player Objects
        this.players = players;
        // Hard-coded for now for testing purposes (Will change it to array of players)
        this.player1 = new Player(1);
        this.player2 = new Player(2);
        this.player3 = new Player(3);
        this.player4 = new Player(4);
    }

    // Increment Points if answered correctly
    static questionAnswered(status){
        if(status){
            this.player.techPoints(player.techPoints + 1)
        }
    }

    // Add plot to a players ownedTiles array
    static claimPlot(tile, player_id){
        for(player in players){
            if(player.id === player_id){
                player.ownedTiles = player.ownedTiles.push(tile)
            }
        }  
    }

    // Remove a specified plot from a players ownedTiles array
    static removePlot(tile, player_id){
        for(player in players){
            if(player.id === player_id){
                player.ownedTiles = player.ownedTiles.filter(item => item !== tile);
                // Remove player from game if they have 0 tiles owned (eliminated)
                if(player.ownedTiles.length === 0){
                    this.players.splice(this.players.indexOf(player), 1)
                    player.liveStatus = false; //Used for showing player alive on HUD or not
                }
            }
        }  
    }

    // Set player initial tiles
    // To be continued when hex board is committed to repo
    static assignStartingTiles(){
        var allocatedTiles = [];
    }

    // Used for checking for a winner each turn
    static getWinner(){
        if(this.players.length === 1){
            return this.players[0]
        }
        else{
            return 0; // Return 0 if no winner
        }
    }
}

export default GameHandler;

