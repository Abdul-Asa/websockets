const http = require('http');
var fs = require('fs');
const websocketServer = require('websocket').server;
const Answers = require('./Answers/Answers');
const PORT = process.env.PORT || 8000;
// const INDEX = fs.readFileSync('index.html');
const httpServer = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream('index.html').pipe(res);
});
httpServer.listen(PORT, () => console.log(`Listening.. on ${PORT}`));
//hashmap clients
// const clients = {};
let wait = [];

const wsServer = new websocketServer({
  httpServer: httpServer,
});

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  const clientId = guid();
  //On open connection
  connection.id = clientId;
  const payLoad = {
    method: 'connect',
    clientId: clientId,
  };
  connection.send(JSON.stringify(payLoad));
  connection.on('close', () => {
    const wow = [];
    wsServer.connections.forEach((el) => {
      if (el.userName && el.connected) {
        wow.push({ id: el.id, userName: el.userName });
      }
    });
    const payLoad = {
      method: 'online',
      lobby: wow,
    };
    wsServer.connections.forEach((el) => el.send(JSON.stringify(payLoad)));
  });
  connection.on('message', (message) => {
    const result = JSON.parse(message.utf8Data);
    if (result.method === 'connected') {
      connection.userName = result.userName;
      connection.match = '';
      const wow = [];
      wsServer.connections.forEach((el) => {
        if (el.userName) {
          wow.push({ id: el.id, userName: el.userName });
        }
      });
      const payLoad = {
        method: 'online',
        lobby: wow,
      };
      wsServer.connections.forEach((el) => el.send(JSON.stringify(payLoad)));
    }
    if (result.method === 'createGame') {
      const oppId = result.oppId;
      const clientId = result.clientId;
      const gameId = guid();
      let message = 'Waiting for response...';
      wsServer.connections.forEach((el) => {
        if (el.id === oppId) {
          if (el.match !== '') {
            message = result.oppName + ' is in a match';
          } else {
            el.match = gameId;
            wsServer.connections.forEach((el) => {
              if (el.id === clientId) {
                el.match = gameId;
              }
            });
          }
        }
      });
      let ode = '';
      message === 'Waiting for response...' ? (ode = gameId) : (ode = '');
      const payLoad1 = {
        method: 'invite',
        message: message,
        gameId: ode,
      };
      const payLoad2 = {
        method: 'invitation',
        oppName: result.clientName,
        oppId: clientId,
        gameId: ode,
      };
      wsServer.connections.forEach((el) => {
        if (el.id === clientId) el.send(JSON.stringify(payLoad1));
        if (message === 'Waiting for response...') {
          if (el.id === oppId) el.send(JSON.stringify(payLoad2));
        }
      });
    }
    if (result.method === 'rejected') {
      const oppId = result.oppId;
      const clientId = result.clientId;
      wsServer.connections.forEach((el) => {
        if (el.id === oppId) el.match = '';
        if (el.id === clientId) el.match = '';
      });
      const payLoad = {
        method: 'lol',
        clientId: result.oppId,
        oppName: result.clientName,
        oppId: clientId,
      };

      wsServer.connections.forEach((el) => {
        if (el.id === clientId) el.send(JSON.stringify(payLoad));
        if (el.id === oppId) el.send(JSON.stringify(payLoad));
      });
    }
    if (result.method === 'accepted') {
      const quekchon = shuffle(Answers.Ideas).slice(0, 5);
      const payLoad = {
        method: 'noice',
        questions: quekchon,
      };
      wsServer.connections.forEach((el) => {
        if (el.id === result.oppId) el.send(JSON.stringify(payLoad));
        if (el.id === result.clientId) el.send(JSON.stringify(payLoad));
      });
    }
    if (result.method === 'play') {
      const gameId = result.gameId;
      wait.push(gameId);
      if (wait.length == 1) {
        const payLoad = {
          method: 'wait',
          clientId: result.clientId,
          clientName: result.clientName,
          oppId: result.oppId,
          oppName: result.oppName,
          score: result.score,
        };
        wsServer.connections.forEach((el) => {
          if (el.id === result.oppId) el.send(JSON.stringify(payLoad));
          if (el.id === result.clientId) el.send(JSON.stringify(payLoad));
        });
      } else {
        const payLoad = {
          method: 'round',
          clientId: result.clientId,
          clientName: result.clientName,
          oppId: result.oppId,
          oppName: result.oppName,
          score: result.score,
        };
        wsServer.connections.forEach((el) => {
          if (el.id === result.oppId) el.send(JSON.stringify(payLoad));
          if (el.id === result.clientId) el.send(JSON.stringify(payLoad));
        });
        wait = [];
      }
    }
    if (result.method === 'quitMatch') {
      const oppId = result.oppId;
      const clientId = result.clientId;
      wsServer.connections.forEach((el) => {
        if (el.id === oppId) el.match = '';
        if (el.id === clientId) el.match = '';
      });
      const payLoad = {
        method: 'quit',
        clientId: result.oppId,
        oppName: result.clientName,
        oppId: clientId,
      };

      wsServer.connections.forEach((el) => {
        if (el.id === clientId) el.send(JSON.stringify(payLoad));
        if (el.id === oppId) el.send(JSON.stringify(payLoad));
      });
    }
    if (result.method === 'endMatch') {
      const oppId = result.oppId;
      const clientId = result.clientId;
      wsServer.connections.forEach((el) => {
        if (el.id === oppId) el.match = '';
        if (el.id === clientId) el.match = '';
      });
      const payLoad = {
        method: 'end',
        clientId: result.oppId,
        oppName: result.clientName,
        oppId: clientId,
      };

      wsServer.connections.forEach((el) => {
        if (el.id === clientId) el.send(JSON.stringify(payLoad));
        if (el.id === oppId) el.send(JSON.stringify(payLoad));
      });
    }
  });
  connection.on('error', (err) => {
    console.error('Socket encountered error: ', err.name, err.message);
  });
});

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
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
