import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Room, RoomAvailable } from 'colyseus.js';
import { TicTacToeService } from '../tic-tac-toe.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  roomId = new FormControl('');
  userName = new FormControl('');

  lobby!: Room;

  availableRooms: RoomAvailable[] = [];

  tictactoeService = inject(TicTacToeService);

  constructor(private router: Router) {}

  /**
   * Initializes the lobby room with listeners
   */
  async ngOnInit() {
    this.lobby = await this.tictactoeService.initializeLobby();
    this.lobby.onMessage('rooms', (rooms) => {
      this.availableRooms = rooms;
    });

    this.lobby.onMessage('+', ([roomId, room]) => {
      const roomIndex = this.availableRooms.findIndex(
        (rm) => rm.roomId === roomId
      );
      if (roomIndex !== -1) {
        this.availableRooms[roomIndex] = room;
      } else {
        this.availableRooms.push(room);
      }
    });

    this.lobby.onMessage('-', (roomId) => {
      this.availableRooms = this.availableRooms.filter(
        (room) => room.roomId !== roomId
      );
    });
  }
}
