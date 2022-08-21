const http = require('http');
var fs = require('fs');
const websocketServer = require('websocket').server;

const PORT = process.env.PORT || 8000;
// const INDEX = fs.readFileSync('index.html');
const httpServer = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream('index.html').pipe(res);
});
httpServer.listen(PORT, () => console.log(`Listening.. on ${PORT}`));
//hashmap clients
const clients = {};
const games = {};

const wsServer = new websocketServer({
  httpServer: httpServer,
});

const connect = () =>
  wsServer.on('request', (request) => {
    const connection = request.accept(null, request.origin);
    const clientId = guid();
    clients[clientId] = { connection: connection };
    let ode = [];
    for (var key in clients) {
      if (clients.hasOwnProperty(key)) {
        ode.push({ uN: clients[key].userName, iD: key });
      }
    }
    const payLoad = {
      method: 'connect',
      clientId: clientId,
      clients: [ode],
    };
    // connection.on('error', (err) => {
    //   console.error('Socket encountered error: ', err, 'Closing socket');
    // });
    connection.on('open', () => console.log('opened!'));
    connection.on('close', (e) => {
      console.log(
        'Socket is closed. Reconnect will be attempted in 1 second.',
        e
      );
      connect();
    });
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
            const wow = {
              userName: clients[key].userName,
              iD: key,
            };
            list.push(wow);
          }
        }
        const roster = uniqBy(list);
        console.log(list, roster);
        const payLoad = {
          method: 'online',
          clientId: clientId,
          lobby: roster,
        };
        // const con = clients[clientId].connection;
        // con.send(JSON.stringify(payLoad));

        for (key in clients) {
          clients[key].connection.send(JSON.stringify(payLoad));
        }
      }
      if (result.method === 'disconnected') {
        const clientId = result.clientId;
        console.log(clientId);
        delete clients[clientId];
      }
      if (result.method === 'createGame') {
        const clientId = result.clientId;
        const gameId = guid();
        games[gameId] = {
          id: gameId,
          clients: [result.clientId, result.oppId],
          gameStatus: 'pending',
        };

        const payLoad = {
          method: 'inviteGame',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };
        const payLoad2 = {
          method: 'inv',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };
        const con = clients[result.oppId].connection;
        const con2 = clients[result.clientId].connection;
        con.send(JSON.stringify(payLoad));
        con2.send(JSON.stringify(payLoad2));
      }
      if (result.method === 'rejected') {
        const gameId = result.gameId;
        delete games[gameId];

        const payLoad = {
          method: 'lol',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };

        const con = clients[result.oppId].connection;
        con.send(JSON.stringify(payLoad));
      }
      if (result.method === 'accepted') {
        const gameId = result.gameId;
        games[gameId].gameStatus = 'ongoing';
        const payLoad = {
          method: 'accepted',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };
        const con = clients[result.oppId].connection;
        con.send(JSON.stringify(payLoad));
      }
      if (result.method === 'play') {
        games[gameId].scores = [];
        const gameId = result.gameId;
        const clientId = result.clientId;
        if (games[gameId].clients[0] === clientId) {
          games[gameId].scores.push(result.scores);
        }
        if (games[gameId].clients[1] === clientId) {
          games[gameId].scores.push(result.scores);
        }
        const payLoad = {
          method: 'play',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
          scores: [games[gameId].scores],
        };
        const con = clients[result.oppId].connection;
        const con2 = clients[result.clientId].connection;
        con.send(JSON.stringify(payLoad));
        con2.send(JSON.stringify(payLoad2));
      }
      if (result.method === 'endMatch') {
        const gameId = result.gameId;
        const clientId = result.clientId;
        delete games[gameId];
        const payLoad = {
          method: 'endedMatch',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };
        const con = clients[result.oppId].connection;
        con.send(JSON.stringify(payLoad));
      }
      if (result.method === 'rematch') {
        const gameId = result.gameId;
        const clientId = result.clientId;
        delete games[gameId];
        const payLoad = {
          method: 'endedMatch',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };
        const con = clients[result.oppId].connection;
        con.send(JSON.stringify(payLoad));
      }
      if (result.method === 'acceptRematch') {
        const gameId = result.gameId;
        const clientId = result.clientId;
        delete games[gameId];
        const payLoad = {
          method: 'endedMatch',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };
        const con = clients[result.oppId].connection;
        con.send(JSON.stringify(payLoad));
      }
      if (result.method === 'chat') {
        const gameId = result.gameId;
        const clientId = result.clientId;
        delete games[gameId];
        const payLoad = {
          method: 'endedMatch',
          clientId: result.oppId,
          oppName: result.clientName,
          oppId: clientId,
          gameId: gameId,
        };
        const con = clients[result.oppId].connection;
        con.send(JSON.stringify(payLoad));
      }
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
    connection.on('error', (err) => {
      console.error('Socket encountered error: ', err.name, err.message);
    });
  });
connect();

const guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};

function findLastIndex(array, searchKey, searchValue) {
  var index = array
    .slice()
    .reverse()
    .findIndex((x) => x[searchKey] === searchValue);
  var count = array.length - 1;
  var finalIndex = index >= 0 ? count - index : index;
  return finalIndex;
}

function uniqBy(a) {
  const wow = [];
  const ode = [];
  const ans = [];
  a.forEach((el) => {
    wow.push(el.userName);
  });
  const uniqueArray = wow.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });
  uniqueArray.forEach((element) => {
    ode.push(findLastIndex(a, 'userName', element));
  });
  ode.forEach((el) => {
    ans.push(a[el]);
  });
  return ans;
}
