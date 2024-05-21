### Server-side Colyseus Application README.md

# Tic-Tac-Toe Server

This is the server-side of the multiplayer Tic-Tac-Toe game built using Colyseus.

## Prerequisites

- Node.js and npm installed
- TypeScript installed

## Getting Started

Follow these steps to set up and run the Colyseus server.

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/tic-tac-toe-server.git

cd tic-tac-toe-server
```

### Running the Server

Start the Colyseus server:

```bash
npx ts-node src/index.ts
```

## Project Structure

- `src/GameState.ts` : Game state management and logic.

- `src/TicTacToeRoom.ts` : Colyseus room definition handling the game session.

- `src/index.ts` : Server setup and configuration.
