import { Routes } from '@angular/router';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';

export const routes: Routes = [
  {
    path: 'game/:roomId/:userName',
    component: TicTacToeComponent,
    title: "Let's Play!!!",
  },
  {
    path: '',
    redirectTo: 'game/default-room',
    pathMatch: 'full',
  },
];
