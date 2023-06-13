//initialize game
let gameOver;
let playerOneTurn;
let gameBoard = [];
let pellets = [];
// pellets.length = 11; //36;
let sound = new Audio();
let wakawaka = new Audio();
window.onload = pageLoad;

function pageLoad() {
  $('#replay').html('START GAME!');
  $('#replay').removeClass('hidden');
  $('#replay').addClass('text-blink');
  $('#replay').on('click', () => initializeGame());
}

function playSound(audioSRC) {
  sound.src = audioSRC;
  sound.preload = 'auto';
  sound.volume = 0.8;
  sound.autoplay = true;
  sound.loop = false;
}

function startWakaWaka(audioSRC = './media/PacmanWakaWaka04.wav') {
  wakawaka.src = audioSRC;
  wakawaka.preload = 'auto';
  wakawaka.volume = 0.3;
  wakawaka.autoplay = true;
  wakawaka.loop = true;
}

function stopWakaWaka() {
  wakawaka.pause();
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
  resetSprites();
  resetPellets(pellets);
  setTimeout(playAnimations, 5000);
  setTimeout(startWakaWaka, 5000);
}

function isTieGame(gameBoard) {
  //flatten array, return true is no blank spaces (0) are left
  return [].concat(...gameBoard).every(element => element !== 0);
}

function intermission(audioSRC) {
  $('#replay').removeClass('hidden');
  $('#replay').addClass('text-blink');
  $('#replay').on('click', () => initializeGame());
  gameOver = true;
  playSound(audioSRC);
}

function checkForHorizontalWin(win) {
  return gameBoard
    .map(row => row.reduce((acc, cur) => acc + cur), 0)
    .some(res => res === win);
}

function transposeArray(arr) {
  return arr[0].map((col, i) => arr.map(row => row[i]));
}

function checkForVerticalWin(win) {
  let arr = transposeArray(gameBoard);
  return arr
    .map(row => row.reduce((acc, cur) => acc + cur), 0)
    .some(res => res === win);
}

function checkForDiagonalWin(win) {
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

  if (
    checkForHorizontalWin(win) ||
    checkForVerticalWin(win) ||
    checkForDiagonalWin(win)
  ) {
    if (win > 0) {
      console.log('PACMAN WINS!');
      $('#display').html('PACMAN WINS!');
      intermission('./media/intermission.wav');
      stopWakaWaka();
      return true;
    }
    if (win < 0) {
      $('#display').html('GHOSTS WIN!');
      intermission('./media/intermission.wav');
      stopWakaWaka();
      return true;
    }
  }
}

function resetSprites() {
  let wrapper = $('#wrapper');
  let pacman = $('#pacman-sprite');
  pacman.removeClass('pacman-animate');
  pacman.addClass('hidden');
  wrapper.append(pacman);

  let ghost = $('#ghost-sprite');
  ghost.removeClass('ghost-animate');
  ghost.addClass('hidden');
  wrapper.append(ghost);
}

function resetPellets(pellets) {
  console.log('Reset Pellets');
  let wrapper = $('#wrapper');
  let container = $('#pellet-container');

  //create top row of pellets
  for (let i = 0; i < 11; i++) {
    let pellet = `<div id="pellet-${i}" class="cell pellet-sprite pellet pellet-animate" style="
    position: absolute;
     top: ${106 + 0 * i}px;
     left: ${106 + 52 * i}px; "></div>`;
    pellets[i] = pellet;
  }
  //create bottom row of pellets
  for (let i = 11; i < 22; i++) {
    let pellet = `<div id="pellet-${i}" class="cell pellet-sprite pellet pellet-animate" style="
    position: absolute;
     top: ${630}px;
     left: ${106 + 52 * (i - 11)}px; "></div>`;
    pellets[i] = pellet;
  }

  //create left column of pellets
  for (let i = 22; i < 31; i++) {
    let pellet = `<div id="pellet-${i}" class="cell pellet-sprite pellet pellet-animate" style="
    position: absolute;
     top: ${106 + 52 * (i - 21)}px;
     left: ${106}px; "></div>`;
    pellets[i] = pellet;
  }

  //create right column of pellets
  for (let i = 31; i < 40; i++) {
    let pellet = `<div id="pellet-${i}" class="cell pellet-sprite pellet pellet-animate" style="
    position: absolute;
     top: ${106 + 52 * (i - 30)}px;
     left: ${627}px; "></div>`;
    pellets[i] = pellet;
  }

  for (let i = 0; i < pellets.length; i++) {
    container.append(pellets[i]);
  }
  console.log(pellets.length);
  wrapper.append(container);
  console.log(container.children());
}

function playAnimations() {
  let wrapper = $('#wrapper');
  let pacman = $('#pacman-sprite');
  pacman.removeClass('hidden');
  pacman.addClass('pacman-animate');
  wrapper.append(pacman);

  let ghost = $('#ghost-sprite');
  ghost.removeClass('hidden');
  ghost.addClass('ghost-animate');
  wrapper.append(ghost);
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
          cell = $(
            `<div id="cell-${i * 3 + j}" class="cell ghost ghost-eye"></div>`
          );
        }
        if (gameBoard[i][j] > 0) {
          // console.log('wakawaka');
          //create pacman cells
          cell = $(
            `<div id="cell-${i * 3 + j}" class="cell pacman chomp"></div>`
          );
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
              playerOneTurn = !playerOneTurn;
              drawBoard(gameBoard);
              checkForWin(playerToken);
              if (isTieGame(gameBoard) && !gameOver) {
                console.log('TIE GAME');
                $('#display').html('TIE GAME!');
                intermission('./media/death_1.wav');
                stopWakaWaka();
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
