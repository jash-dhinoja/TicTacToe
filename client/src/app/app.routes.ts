import { Routes } from '@angular/router';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'game/:roomId/:userName',
    component: TicTacToeComponent,
    title: "Let's Play!!!",
  },
  {
    path: 'lobby',
    component: HomeComponent,
    title: 'Lobby',
  },
  {
    path: '',
    redirectTo: '/lobby',
    pathMatch: 'full',
  },
];
