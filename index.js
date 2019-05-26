var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var cors = require('cors');


http.listen(5000, function () {
    console.log('listening on *:5000');
});

app.use(cors());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

class GameState {
    constructor(){
        this.inProgress = false;
        this.numPlayers = 0;
        this.host = null;
        this.activeContestant = null;
        this.buzzerLocked = true;
    }
};

this.gameState = new GameState();

io.on('connection', (socket) => {
    console.log('user connected ' + socket.id);
    this.gameState.numPlayers++;

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);
        this.gameState.numPlayers--;

        // if the host disconnects, clear the game
        if (socket.id === this.gameState.currentHostSocketId){
            gameState = new GameState();
        }

        if (socket.id === this.gameState.activeContestant){
            this.gameState.activeContestant = null;
        }

        io.emit('StateChange', this.gameState);
        console.log('user disconnected');
    });
    
    // contestant buzzes in
    socket.on('Buzz', (name) => {
        if (!!this.gameState.inProgress && !this.gameState.buzzerLocked && !this.gameState.activeContestant){
            this.gameState.activeContestant = new Player(socket.id, name);

            console.log(`contestant buzz: ${name} (${socket.id})`);
        }

        socket.emit('StateChange', this.gameState);
    });

    // notify when new user joins
    io.emit('StateChange', this.gameState);
});
