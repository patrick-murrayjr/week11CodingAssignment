//initialize game variables
let gameOver;
let playerOneTurn;
let gameBoard = [];
let pellets = [];
let pelletCounter = 0;
let sound = new Audio();
let wakawaka = new Audio();
window.onload = pageLoad;

/**
 * function pageLoad
 *
 * Initializes a game by setting up the replay button and attaching an event listener to it
 */
function pageLoad() {
  let replayBtn = $('#replay');
  replayBtn.html('START GAME!');
  replayBtn
    .removeClass('hidden')
    .addClass('text-blink')
    .on('click', initializeGame);
}

/**
 * function initializeGame
 * Sets initial game state
 *
 */
function initializeGame() {
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
  pelletCounter = 0;
  resetPellets(pellets);
  setTimeout(playAnimations, 5000);
}

/**
 * function playSound
 * This function is used to provide sound effects throughout the game
 */
function playSound(audioSRC) {
  sound.src = audioSRC;
  sound.preload = 'auto';
  sound.volume = 0.8;
  sound.autoplay = true;
  sound.loop = false;
}

/**
 * function startWakaWaka
 *
 * This funtion is used to create the wakawaka pacman sound
 */
function startWakaWaka(audioSRC = './media/PacmanWakaWaka04.wav') {
  wakawaka.src = audioSRC;
  wakawaka.preload = 'auto';
  wakawaka.volume = 0.3;
  wakawaka.autoplay = true;
  wakawaka.loop = true;
}

/**
 * function stopWakaWaka
      This code defines a function called "stopWakaWaka". When this function is called, it pauses the audio.
*/
function stopWakaWaka() {
  wakawaka.pause();
}

/**
 * function isTieGame
 * 
      This function takes one parameter which is a multi-dimensional array representing a Tic Tac Toe game board. It returns a boolean value indicating whether the game has ended in a tie or not.
 */
function isTieGame(gameBoard) {
  //flatten array, return true is no blank spaces (0) are left
  return [].concat(...gameBoard).every(element => element !== 0);
}

/**
 * function intermission
 * 
      This is a function called "intermission" which creates an intermission end of game screen where the player is prompted to replay the game. 
 */
function intermission(audioSRC) {
  $('#replay').removeClass('hidden');
  $('#replay').addClass('text-blink');
  gameOver = true;
  playSound(audioSRC);
  $('#replay').html('PLAY AGAIN?');
  $('#replay').on('click', () => location.reload());
}

/**
 * function checkForHorizontalWin
 *
      This code defines a function called checkForHorizontalWin that takes one parameter win. This function checks if there is a horizontal win in a game board that is represented by a multi-dimensional array called gameBoard.
      
      To do this, the function first maps (transforms) each row of gameBoard into a sum of its values using .reduce(). The .reduce() method takes an accumulator (acc) and a current value (cur) as arguments and returns the sum of these values.

      Then, the function uses the .some() method to check if any of these sums equals the win parameter. The .some() method returns true if at least one element in the array passes the test, and false otherwise.
      
      Finally, the checkForHorizontalWin function returns the result of this test.
 */
function checkForHorizontalWin(win) {
  return gameBoard
    .map(row => row.reduce((acc, cur) => acc + cur), 0)
    .some(res => res === win);
}

/**
 * function transposeArray

      This function swaps the rows and column of an array
 */
function transposeArray(arr) {
  return arr[0].map((col, i) => arr.map(row => row[i]));
}

/**
 * function checkForVerticalWin

      This code defines a function named checkForVerticalWin that takes number win as an argument. The function first transposes a 2D array gameBoard. (Swaps the rows and columns in the array). Then the function maps each row to the sum of its elements and checks if any of the resulting sums match win. It returns a boolean value indicating whether there is a vertical win or not.

 */
function checkForVerticalWin(win) {
  let arr = transposeArray(gameBoard);
  return arr
    .map(row => row.reduce((acc, cur) => acc + cur), 0)
    .some(res => res === win);
}

/**
 * function checkForDiagonalWin
      This code defines a function called checkForDiagonalWin that checks if there is a diagonal win in a tic-tac-toe game. The function takes a parameter called win which is the number of marks in a row needed to win the game.

      First, the function makes a reversed copy of the gameBoard array.

      Then, it checks two diagonal lines of the gameBoard array and its reversed copy. If either of the sums of the diagonal values in each array is equal to the win parameter, the function returns true. Otherwise, it returns false.
 */
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

/**
 * function checkForWin
    
      This code defines a function that checks if a player has won in a game. The function takes one parameter "playerToken" which is used to calculate the target score that the player needs to win. The function then calls three other functions (checkForHorizontalWin(), checkForVerticalWin(), and checkForDiagonalWin()) to determine if the player achieved the target score in any of the three possible directions. If any of the three checking functions return true, the code checks if the target score is positive or negative. If positive, PACMAN wins, If negative, GHOSTS win. The function will display the winning status on the webpage and play an intermission sound before returning "true".
 */
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

/**
 * function resetSprites
      This code defines a function called resetSprites which resets the positions and animations of two sprites, pacman and ghost.

      First, it selects the main game wrapper element using jQuery's $('#wrapper') selector and assigns it to the variable wrapper. It then selects the pacman and ghost sprites using their respective IDs (#pacman-sprite and #ghost-sprite) and assigns them to the variables pacman and ghost.

      Next, it removes any animation classes from pacman and ghost using jQuery's removeClass() method. pacman is also given a hidden class, which hides it from view.

      Finally, the code appends pacman and ghost to wrapper using jQuery's append() method.
 */
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

/**
 * function resetPellets

      The code defines a function named "resetPellets" which takes a single parameter called "pellets".

      Inside the function, it defines four different loops which create and append different sets of pellets to the provided "pellet-container".

      All pellets have an "id" value, a class name, and are positioned at different coordinates on the screen using CSS.

      Finally, the function appends the "pellet-container" to the "#wrapper" element.
 */
function resetPellets(pellets) {
  const wrapper = $('#wrapper');
  const container = $('#pellet-container');

  const createPellet = (i, top, left) =>
    `<div id="pellet-${i}" class="cell pellet-sprite pellet pellet-animate" style="position: absolute; top: ${top}px; left: ${left}px;"></div>`;

  //create bottom left row of pellets
  for (let i = 0; i < 6; i++) pellets[i] = createPellet(i, 630, 370 - 52 * i);
  //create left column of pellets
  for (let i = 6; i < 16; i++)
    pellets[i] = createPellet(i, 630 - 52 * (i - 5), 106);
  //create top row of pellets
  for (let i = 16; i < 25; i++)
    pellets[i] = createPellet(i, 108, 106 + 52 * (i - 15));
  //create right column of pellets
  for (let i = 25; i < 36; i++)
    pellets[i] = createPellet(i, 108 + 52 * (i - 25), 632);
  //create bottom right row of pellets
  for (let i = 36; i < 40; i++)
    pellets[i] = createPellet(i, 630, 630 - 52 * (i - 35));

  pellets.forEach(pellet => container.append(pellet));

  // console.log(pellets.length);
  wrapper.append(container);
  // console.log(container.children());
}

/**
 * function eatPellets

      This function defines a function called eatPellets that uses setInterval to repeatedly call a function called removePellet every 300 milliseconds.
 */
function eatPellets() {
  // console.log(`Eat Pellet: ${pelletCounter}`);
  setInterval(() => {
    removePellet();
  }, 300);
}

/**
 * function removePellet
      This code defines a function called removePellet() which removes pellets from a game board. If the pelletCounter variable is less than 40, the function selects the pellet element with an ID of pellet-pelletCounter using jQuery and adds the hidden class to make it disappear from the game board. The pelletCounter variable is incremented after each pellet is removed. If pelletCounter is 40 or greater, the function calls stopWakaWaka().
 */
function removePellet() {
  if (pelletCounter < 40) {
    // console.log(`Remove Pellet: ${pelletCounter}`);
    let pellet = $(`#pellet-${pelletCounter++}`);
    pellet.addClass('hidden');
  } else {
    stopWakaWaka();
  }
}

/**
 * function playAnimations
 The code defines a function named "playAnimations".

      Inside the function, it selects the elements with IDs "wrapper", "pacman-sprite", and "ghost-sprite" using jQuery and assigns them to corresponding variables. It removes the "hidden" class from both pacman and ghost sprites and adds animation classes "pacman-animate" and "ghost-animate" respectively.

      It appends both the pacman and ghost sprites to the wrapper element.

      Lastly, it calls two other functions named "startWakaWaka()" and "eatPellets()" to play the pacman sound and begin the pellet eating animation.
 */
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
  startWakaWaka();
  eatPellets();
}

/**
 * function drawBoard

      This function takes a game board as input and renders it on the screen. The function first checks if the game is over. If not, it determines which player’s turn it is and sets their token accordingly.

      It then empties the game board and creates new elements to represent the game board. Depending on the value in the game board  array, a cell will be created for the pacman, ghost, or open spot. If the cell is an open spot, an event listener is added to it to allow the player to place their token. If the game is over and there is a tie, the game ends. Otherwise, the function calls checkForWin to determine if there is a winner. The winning player is then displayed on the screen. 
 */
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
      let row = $(`<div id="row-${i}" class="row"></row>`);
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
