//initialize game
let gameOver;
let playerOneTurn;
let gameBoard = [];
let introSound = new Audio();
window.onload = pageLoad;

function pageLoad() {
  $('#replay').html('START GAME!');
  $('#replay').removeClass('hidden');
  $('#replay').addClass('text-blink');
  $('#replay').on('click', () => initializeGame());
}

function playSound(audioSRC) {
  introSound.src = audioSRC;
  introSound.autoplay = true;
  introSound.loop = false;
}

function initializeGame() {
  console.log('initializeGame called');
  playSound('./media/game_start.wav');
  gameOver = false;
  playerOneTurn = true;
  gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  $('#replay').removeClass('text-blink');
  $('#replay').addClass('hidden');
  drawBoard(gameBoard);
}

function isTieGame(gameBoard) {
  //flatten array, find index where element  is 0, if none are found returns -1
  // return [].concat(...gameBoard).findIndex(element => element === 0);
  return [].concat(...gameBoard).every(element => element !== 0);
}

function intermission(audioSRC) {
  $('#replay').removeClass('hidden');
  $('#replay').addClass('text-blink');
  $('#replay').on('click', () => initializeGame());
  gameOver = true;
  playSound(audioSRC);
}

function checkHorizontalWin(win) {
  return gameBoard
    .map(row => row.reduce((acc, cur) => acc + cur), 0)
    .some(res => res === win);
}
function transpose(arr) {
  return arr[0].map((col, i) => arr.map(row => row[i]));
}

function checkVerticalWin(win) {
  let arr = transpose(gameBoard);
  return arr
    .map(row => row.reduce((acc, cur) => acc + cur), 0)
    .some(res => res === win);
}

function checkDiagonalWin(win) {
  let reversed = [...gameBoard].reverse();
  return (
    gameBoard
      .map((row, index) => row[index])
      .reduce((acc, cur) => acc + cur, 0) === win ||
    reversed
      .map((row, index) => row[index])
      .reduce((acc, cur) => acc + cur, 0) === win
  );
}

function checkForWin(playerToken) {
  let win = playerToken * 3;
  checkDiagonalWin(win);
  if (
    checkHorizontalWin(win) ||
    checkVerticalWin(win) ||
    checkDiagonalWin(win)
  ) {
    if (win > 0) {
      console.log('PACMAN WINS!');
      $('#display').html('PACMAN WINS!');
      intermission('./media/intermission.wav');
      return true;
    }
    if (win < 0) {
      $('#display').html('GHOSTS WIN!');
      intermission('./media/intermission.wav');
      return true;
    }
  }
}

function animatePlayer(playerToken, row, col) {
  //
  console.log(`token: ${playerToken} row: ${row} col: ${col}`);
}
function drawBoard(gameBoard) {
  if (!gameOver) {
    let playerToken;
    // if player one turn
    if (playerOneTurn) {
      playerToken = 1;
      $('#display').html('PACMAN: GO!');
    } else {
      //player 2 turn
      playerToken = -1;
      $('#display').html('GHOST: GO!');
    }

    let board = $('#game-board');
    board.empty();

    let cellContainer = $(`<div class="cell-container">`);
    board.append(cellContainer);
    for (let i = 0; i < 3; i++) {
      let row = $(`<div id="row-${i}" class="row">`);
      for (let j = 0; j < 3; j++) {
        let cell;
        if (gameBoard[i][j] < 0) {
          //create ghost cells
          cell = $(`<div id="cell-${i * 3 + j}" class="cell ghost"></div>`);
        }
        if (gameBoard[i][j] > 0) {
          //create pacman cells
          cell = $(`<div id="cell-${i * 3 + j}" class="cell pacman"></div>`);
        }
        if (gameBoard[i][j] == 0) {
          //create open cells
          cell = $(
            `<div id="cell-${
              i * 3 + j
            }" class="cell open" row="${i}" col="${j}"></div>`
          );

          cell.on('click', e => {
            if (!gameOver) {
              gameBoard[$(e.target).attr('row')][$(e.target).attr('col')] =
                playerToken;
              playSound('./media/credit.wav');
              animatePlayer(
                playerToken,
                $(e.target).attr('row'),
                $(e.target).attr('col')
              );
              playerOneTurn = !playerOneTurn;
              drawBoard(gameBoard);
              checkForWin(playerToken);
              if (isTieGame(gameBoard) && !gameOver) {
                console.log('TIE GAME');
                $('#display').html('TIE GAME!');
                intermission('./media/death_1.wav');
              }
            }
          });
        }
        row.append(cell);
      }
      cellContainer.append(row);
    }
  }
}
