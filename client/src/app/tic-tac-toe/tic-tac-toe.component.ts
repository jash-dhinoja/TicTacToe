import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicTacToeService } from '../tic-tac-toe.service';
import { CommonModule } from '@angular/common';
import * as BABYLON from 'babylonjs';
import '@babylonjs/loaders';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css',
})
export class TicTacToeComponent {
  board: string[] = Array(9).fill('');
  currentSymbol: string = '';
  currentPlayer: string = '';
  gameOver: boolean = false;
  winner: string = '';
  playerName!: string;
  players!: Map<string, string>;
  waitingForOtherPlayers = false;
  spectator = false;

  route = inject(ActivatedRoute);
  ticTacToeService = inject(TicTacToeService);

  @ViewChild('renderCanvas', { static: true })
  renderCanvas!: ElementRef<HTMLCanvasElement>;
  meshes: BABYLON.Mesh[][] = Array(3).fill([]);

  constructor() {}

  async ngOnInit() {
    const roomId = String(this.route.snapshot.params['roomId']);
    this.playerName = String(this.route.snapshot.params['userName']);

    const room = await this.ticTacToeService.joinOrCreateRoom(
      roomId,
      this.playerName
    );

    room.onMessage('wait', () => (this.waitingForOtherPlayers = true));
    room.onMessage('play', () => (this.waitingForOtherPlayers = false));

    room.onMessage('spectator', () => (this.spectator = true));

    room.onMessage('update-board', (index) => this.animateChanges(index));

    room.onMessage('reset-client', () => this.drawBabylonBoard());

    this.ticTacToeService.onStateChange((state) => {
      console.log('State change');
      this.board = state.board;
      this.currentSymbol = state.currentSymbol;
      this.gameOver = state.gameOver;
      this.winner = state.winner;
      this.players = state.players;
      this.currentPlayer = state.currentPlayer;
    });

    this.drawBabylonBoard();
  }

  resetGame() {
    this.ticTacToeService.resetGame();
  }

  drawBabylonBoard() {
    const canvas = this.renderCanvas.nativeElement;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
      'camera1',
      Math.PI / 2,
      0,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
    light.intensity = 0.7;

    const spacing = 1.5;

    // for (let i = 0; i < 3; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     const box = BABYLON.MeshBuilder.CreateBox(
    //       `box_${i}_${j}`,
    //       { size: 1 },
    //       scene
    //     );
    //     box.position.x = (i - 1) * spacing;
    //     box.position.z = (j - 1) * spacing;
    //     box.isPickable = !this.spectator;
    //     this.meshes[i][j] = box;

    //     const torus = BABYLON.MeshBuilder.CreateTorus(
    //       `torus_${i}_${j}`,
    //       { diameter: 1, thickness: 0.4 },
    //       scene
    //     );
    //     torus.position.x = (i - 1) * spacing;
    //     torus.position.z = (j - 1) * spacing;

    //     torus.scaling = new BABYLON.Vector3(0, 0, 0); // Start torus with scale 0

    //     // Create the "X" cross
    //     const xCross = this.createXCross(`xCross_${i}_${j}`, scene);
    //     xCross.scaling = new BABYLON.Vector3(0, 0, 0); // Start X with scale 0
    //     xCross.rotation.x = Math.PI / 2;
    //     xCross.position.x = (i - 1) * spacing;
    //     xCross.position.z = (j - 1) * spacing;

    //     box.actionManager = new BABYLON.ActionManager(scene);
    //     box.actionManager.registerAction(
    //       new BABYLON.ExecuteCodeAction(
    //         BABYLON.ActionManager.OnPickTrigger,
    //         () => {
    //           if (
    //             this.currentPlayer === this.playerName &&
    //             this.board[i * 3 + j] === '' &&
    //             !this.gameOver
    //           ) {
    //             console.log('Box clicked ', i, j);
    //             this.makeMove(i * 3 + j);
    //           }
    //         }
    //       )
    //     );
    //   }
    // }

    for (let indx = 0; indx < 9; indx++) {
      const i = Math.floor(indx / 3);
      const j = indx % 3;

      // Box creation
      const box = BABYLON.MeshBuilder.CreateBox(
        `box_${i}_${j}`,
        { size: 1 },
        scene
      );
      box.position.x = (i - 1) * spacing;
      box.position.z = (j - 1) * spacing;
      box.isPickable = !this.spectator;
      this.meshes[i][j] = box;

      // Torus Creation
      const torus = BABYLON.MeshBuilder.CreateTorus(
        `torus_${i}_${j}`,
        { diameter: 1, thickness: 0.4 },
        scene
      );
      torus.scaling = new BABYLON.Vector3(0, 0, 0); // Start torus with scale 0
      torus.position.x = (i - 1) * spacing;
      torus.position.z = (j - 1) * spacing;

      // Custom xCross creation
      const xCross = this.createXCross(`xCross_${i}_${j}`, scene);
      xCross.scaling = new BABYLON.Vector3(0, 0, 0); // Start X with scale 0
      xCross.rotation.x = Math.PI / 2;
      xCross.position.x = (i - 1) * spacing;
      xCross.position.z = (j - 1) * spacing;

      box.actionManager = new BABYLON.ActionManager(scene);
      box.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => {
            if (
              this.currentPlayer === this.playerName &&
              this.board[indx] === '' &&
              !this.gameOver
            ) {
              this.makeMove(indx);
              // this.makeMove(i * 3 + j);
            }
          }
        )
      );
    }

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }

  createXCross(name: string, scene: BABYLON.Scene): BABYLON.TransformNode {
    const xCross = new BABYLON.TransformNode(name, scene);

    const bar1 = BABYLON.MeshBuilder.CreateBox(
      'bar1',
      { height: 0.2, width: 1, depth: 0.2 },
      scene
    );
    bar1.rotation = new BABYLON.Vector3(0, 0, Math.PI / 4);
    bar1.parent = xCross;

    const bar2 = BABYLON.MeshBuilder.CreateBox(
      'bar2',
      { height: 0.2, width: 1, depth: 0.2 },
      scene
    );
    bar2.rotation = new BABYLON.Vector3(0, 0, -Math.PI / 4);
    bar2.parent = xCross;

    return xCross;
  }

  animateChanges(index: number) {
    const i = Math.floor(index / 3);
    const j = index % 3;

    const scene = this.meshes[i][j].getScene();
    const box = scene.getMeshByName(`box_${i}_${j}`);
    const torus = scene.getMeshByName(`torus_${i}_${j}`);
    const xCross = scene.getTransformNodeByName(`xCross_${i}_${j}`);

    const frameRate = 60;

    // Animation for scaling down the cube
    const boxScaleDown = new BABYLON.Animation(
      'boxScaleDown',
      'scaling',
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFramesbox = [];
    keyFramesbox.push({ frame: 0, value: new BABYLON.Vector3(1, 1, 1) });
    keyFramesbox.push({ frame: 60, value: new BABYLON.Vector3(0, 0, 0) });
    boxScaleDown.setKeys(keyFramesbox);

    // Animation for scaling up the torus
    const torusScaleUp = new BABYLON.Animation(
      'torusScaleUp',
      'scaling',
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFramesTorus = [];
    keyFramesTorus.push({ frame: 0, value: new BABYLON.Vector3(0, 0, 0) });
    keyFramesTorus.push({ frame: 60, value: new BABYLON.Vector3(1, 1, 1) });
    torusScaleUp.setKeys(keyFramesTorus);

    // Animation for scaling up the X cross
    const xScaleUp = new BABYLON.Animation(
      'xScaleUp',
      'scaling',
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keyFramesX = [];
    keyFramesX.push({ frame: 0, value: new BABYLON.Vector3(0, 0, 0) });
    keyFramesX.push({ frame: 60, value: new BABYLON.Vector3(1, 1, 1) });
    xScaleUp.setKeys(keyFramesX);

    if (box && torus && xCross) {
      box.animations = [boxScaleDown];
      torus.animations = [torusScaleUp];
      xCross.animations = [xScaleUp];
      scene.beginAnimation(box, 0, 60, false);
      scene.beginAnimation(
        this.currentSymbol === 'X' ? xCross : torus,
        0,
        60,
        false
      );
    }
  }

  makeMove(index: number) {
    if (!this.gameOver && this.board[index] === '') {
      this.ticTacToeService.makeMove(index, this.playerName);
    }
  }
}

// TODO: add Reset button
