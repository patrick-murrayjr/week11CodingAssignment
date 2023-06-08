//initialize game
let gameOver;
let playerOneTurn;
let gameBoard = [];

function initializeGame() {
  gameOver = false;
  playerOneTurn = true;
  gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}
initializeGame();
drawBoard(gameBoard);

function isTieGame(gameBoard) {
  //flatten array, find index where element  is 0, if none are found returns -1
  return [].concat(...gameBoard).findIndex(element => element === 0);
}
function checkForWin(playerToken) {
  let win = playerToken * 3;
  if (
    gameBoard[0][0] + gameBoard[0][1] + gameBoard[0][2] == win ||
    gameBoard[1][0] + gameBoard[1][1] + gameBoard[1][2] == win ||
    gameBoard[2][0] + gameBoard[2][1] + gameBoard[2][2] == win ||
    gameBoard[0][0] + gameBoard[1][0] + gameBoard[2][0] == win ||
    gameBoard[0][1] + gameBoard[1][1] + gameBoard[2][1] == win ||
    gameBoard[0][2] + gameBoard[1][2] + gameBoard[2][2] == win ||
    gameBoard[0][0] + gameBoard[1][1] + gameBoard[2][2] == win ||
    gameBoard[0][2] + gameBoard[1][1] + gameBoard[2][0] == win
  ) {
    if (win > 0) {
      console.log('PACMAN WINS!');
      gameOver = true;
    }
    if (win < 0) {
      console.log('GHOSTS WIN!');
      gameOver = true;
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
    } else {
      //player 2 turn
      playerToken = -1;
    }
    //console.table(gameBoard);
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
              // console.log(`row: ${$(e.target).attr('row')}`);
              // console.log(`col: ${$(e.target).attr('col')}`);
              gameBoard[$(e.target).attr('row')][$(e.target).attr('col')] =
                playerToken;
              animatePlayer(
                playerToken,
                $(e.target).attr('row'),
                $(e.target).attr('col')
              );
              playerOneTurn = !playerOneTurn;
              drawBoard(gameBoard);
              checkForWin(playerToken);
              if (isTieGame(gameBoard) < 0) {
                console.log('TIE GAME');
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
