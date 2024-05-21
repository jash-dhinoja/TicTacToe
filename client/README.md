# Tic-Tac-Toe Client

This is the client-side of the multiplayer Tic-Tac-Toe game built using Angular.

## Prerequisites

- Node.js and npm installed
- Angular CLI installed

## Getting Started

Follow these steps to set up and run the Angular application.

### Installation

#### Clone the repository:

```
git clone https://github.com/yourusername/tic-tac-toe-client.git
cd tic-tac-toe-client
```

### Running the Application

1. Start the Angular development server:

```bash
ng serve
```

2. Open your browser and navigate to:

```bash
http://localhost:4200/game/your-room-id/user-name
```

Replace your-room-id with the actual room ID you want to join or create and the user-name with a the User name that you want to join with.

## Project Structure

- `src/app/tic-tac-toe/tic-tac-toe.component.ts`: Main component handling the game logic and UI.
- `src/app/tic-tac-toe.service.ts` : Service for handling communication with the Colyseus server.
- `src/app/app-routing.module.ts` : Routing configuration to handle URLs with room IDs.
