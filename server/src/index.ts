// src/index.ts
// npx ts-node src/index.ts
import { LobbyRoom, Server } from 'colyseus';
import {} from 'colyseus';
import { createServer } from 'http';
import { TicTacToeRoom } from './TicTacToeRoom';
import express from 'express';
import { monitor } from '@colyseus/monitor';

const app = express();
const gameServer = new Server({
  server: createServer(app),
});

gameServer.define('lobby', LobbyRoom);
gameServer.define('tic-tac-toe', TicTacToeRoom).enableRealtimeListing();

app.get('/', (req, res) => {
  res.send('Tic Tac Toe Server');
});

app.use('/colyseus', monitor());

const PORT = 2567;
gameServer.listen(PORT, undefined, undefined, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
