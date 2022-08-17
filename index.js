const http = require('http');
const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(8000, () => console.log('Listening.. on 8000'));
//hashmap clients
const clients = {};
const games = {};

const wsServer = new websocketServer({
  httpServer: httpServer,
});

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  const clientId = guid();
  clients[clientId] = { connection: connection };
  const payLoad = {
    method: 'connect',
    clientId: clientId,
  };

  //send back the client connect

  //connect
  connection.on('open', () => console.log('opened!'));
  connection.on('close', () => console.log('closed!'));
  connection.on('message', (message) => {
    const result = JSON.parse(message.utf8Data);
    if (result.method === 'connected') {
      const clientId = result.clientId;
      clients[clientId].userName = result.userName;
      let list = [];

      for (var key in clients) {
        if (clients.hasOwnProperty(key)) {
          if (!clients[key].userName) {
            delete clients[key];
          }
        }
      }
      for (var key in clients) {
        if (clients.hasOwnProperty(key)) {
          list.push(clients[key].userName);
        }
      }

      const payLoad = {
        method: 'online',
        clientId: clientId,
        lobby: list,
      };
      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }
    //I have received a message from the client
    //a user want to create a new game
    // if (result.method === 'create') {
    //   const clientId = result.clientId;

    //   const gameId = guid();
    //   games[gameId] = {
    //     id: gameId,
    //     clients: [],
    //   };

    //   const payLoad = {
    //     method: 'create',
    //     game: games[gameId],
    //   };

    //   const con = clients[clientId].connection;
    //   con.send(JSON.stringify(payLoad));
    // }

    //a client want to join
    // if (result.method === 'join') {
    //   const clientId = result.clientId;
    //   const userName = result.userName;

    //   const gameId = result.gameId;
    //   const game = games[gameId];
    //   if (game.clients.length >= 3) {
    //     //sorry max players reach
    //     return;
    //   }
    //   // const color = { 0: 'Red', 1: 'Green', 2: 'Blue' }[game.clients.length];
    //   game.clients.push({
    //     clientId: clientId,
    //     userName: userName,
    //     score: 0,
    //   });
    //   //start the game
    //   if (game.clients.length === 3) updateGameState();

    //   const payLoad = {
    //     method: 'join',
    //     game: game,
    //   };
    //   //loop through all clients and tell them that people has joined
    //   game.clients.forEach((c) => {
    //     clients[c.clientId].connection.send(JSON.stringify(payLoad));
    //   });
    // }
    //a user plays
    // if (result.method === 'play') {
    //   const gameId = result.gameId;
    //   // const ballId = result.ballId;
    //   const score = result.score;
    //   let state = games[gameId].state;
    //   if (!state) state = {};

    //   state[score] = score;
    //   games[gameId].state = state;
    // }
  });
  connection.send(JSON.stringify(payLoad));
});

function updateGameState() {
  //{"gameid", fasdfsf}
  for (const g of Object.keys(games)) {
    const game = games[g];
    const payLoad = {
      method: 'update',
      game: game,
    };

    game.clients.forEach((c) => {
      clients[c.clientId].connection.send(JSON.stringify(payLoad));
    });
  }

  setTimeout(updateGameState, 500);
}

// then to call it, plus stitch in '4' in the third group
const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};
