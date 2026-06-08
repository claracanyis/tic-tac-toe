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
    board.printBoard();
  }

  const playRound = (row, column) => {
    console.log(`${getActivePlayer().playerName} played in row ${row}, column ${column}.`);
    board.setToken(row, column, getActivePlayer().token);
    let finishGame = checkGameOver();
    if (!finishGame) {
      switchPlayerTurn();
      printNewRound();
    }
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
