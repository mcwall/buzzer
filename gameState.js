export default class GameState {
    constructor(){
        this.active = false;
        this.numPlayers = 0;
        this.currentHostId = null;
        this.activeContestant = null;
        this.buzzerLocked = true;
    }
};