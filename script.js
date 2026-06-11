function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // Method to get the entire board to render it
  const getBoard = () => board;

  const setToken = (row, column, player) => {
    // check token is not set in this cell
    if (board[row][column].getValue() != 0) return;

    board[row][column].addToken(player);
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => 
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
    return boardWithCellValues;
  }

  return {getBoard, setToken, printBoard};
};


// Factory function for each cell in the board.
// It gets and sets the cell's value
function Cell() {
  let value = 0;    // private variable

  const addToken = (player) => {
    value = player;
  }

  const getValue = () => value;

  return {addToken, getValue}
}

const GameControl = ((playerOneName = "Player One", playerTwoName = "Player Two") => {
  const players = [{playerName: playerOneName, token: 1}, {playerName: playerTwoName, token: 2}];
  const board = Gameboard();

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0]? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log(`It's ${getActivePlayer().playerName}'s turn.`);
    return board.printBoard();
  }

  const playRound = (row, column) => {
    console.log(`${getActivePlayer().playerName} played in row ${row}, column ${column}.`);
    board.setToken(row, column, getActivePlayer().token);
    checkGameOver();
    switchPlayerTurn();
    return printNewRound();
  }

  const checkGameOver = () => {
    const currentBoard = board.getBoard();
    // Check if there is 3 in line
    const currentPlayerWins = currentBoard.some((row) => row.every((cell) => cell.getValue() === activePlayer.token)) ||
      [currentBoard[0][0], currentBoard[1][0], currentBoard[2][0]].every((cell) => cell.getValue() === activePlayer.token) ||
      [currentBoard[0][1], currentBoard[1][1], currentBoard[2][1]].every((cell) => cell.getValue() === activePlayer.token) ||
      [currentBoard[0][2], currentBoard[1][2], currentBoard[2][2]].every((cell) => cell.getValue() === activePlayer.token) ||
      [currentBoard[0][0], currentBoard[1][1], currentBoard[2][2]].every((cell) => cell.getValue() === activePlayer.token) ||
      [currentBoard[2][0], currentBoard[1][1], currentBoard[0][2]].every((cell) => cell.getValue() === activePlayer.token);

    const fullBoard = !currentBoard.some((row) => row.some((cell) => cell.getValue() === 0));

    if (currentPlayerWins) {
      console.log(`Game Over! ${activePlayer.playerName} wins!`);
      return true;
    }  else if (fullBoard) {
      console.log(`Game over! It's a tie!`);
      return true;
    } else {
      console.log('Keep playing!');
      return false;
    }
  }

  printNewRound();

  return {playRound, getActivePlayer}
})

const AppRender = () => {
  let game;
  let newRoundBoard;
  const btnStart = document.querySelector('.btn-start');
  const appBoard = document.querySelector('.board');
  const appCells = document.querySelectorAll('.cell');
  const playerOneNameInput = document.querySelector('#player-one-name');
  const playerTwoNameInput = document.querySelector('#player-two-name');
  const playerOneNameDisplay = document.querySelector('#name-p1-display');
  const playerTwoNameDisplay = document.querySelector('#name-p2-display');

  const startGame = () => {
    playerOneNameDisplay.textContent = (playerOneNameInput.value != '') ? playerOneNameInput.value : 'Player One';
    playerTwoNameDisplay.textContent = (playerTwoNameInput.value != '') ? playerTwoeNameInput.value : 'Player Two';
    game = GameControl(playerOneNameDisplay.textContent, playerTwoNameDisplay.textContent);
  }

  btnStart.addEventListener('click', startGame);

  const updateBoard = (newRoundBoard) => {
    newRoundBoard.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
      const buttonIndex = rowIndex*3 + columnIndex;
      const appCell = appCells[buttonIndex];
      switch(newRoundBoard[rowIndex][columnIndex]) {
        case 0:
          appCell.textContent = '';
          break;
        case 1:
          appCell.textContent = 'X';
          break;
        case 2:
          appCell.textContent = 'O';
          break;
      };
    }))
  }

  const clickBoardHandler = (event) => {
    const row = event.target.dataset.row;
    const column = event.target.dataset.column;
    newRoundBoard = game.playRound(row, column);
    updateBoard(newRoundBoard);
  }

  appBoard.addEventListener('click', clickBoardHandler);
}

AppRender();