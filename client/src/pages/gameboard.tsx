import { useEffect, useState } from "react";
import "../styles/gameboard.css";

export default function GameBoard() {
  const PLAYER_SYMBOL = "X";
  const AI_SYMBOL = "O";
  const STARTING_BOARD = Array(9).fill(null);

  const [board, setBoard] = useState<(string | null)[]>(STARTING_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_SYMBOL);
  const [winner, setWinner] = useState<string | null>(null);

  function startGame() {
    setBoard(STARTING_BOARD);
    setCurrentPlayer(PLAYER_SYMBOL);
    setWinner(null);
  }

  useEffect(startGame, []);

  useEffect(() => {
    if (currentPlayer !== AI_SYMBOL || winner) return;
    checkWin(board);
  }, [board]);

  function getAiMove() {
    if (winner) return;
    const emptyIndexes = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null) as number[];

    if (emptyIndexes.length === 0) return;

    const randomMove =
      emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    const newBoard = [...board];
    newBoard[randomMove] = AI_SYMBOL;
    setBoard(newBoard);
    setCurrentPlayer(PLAYER_SYMBOL);
  }

  function checkWin(board: (string | null)[]) {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }

    if (!winner) {
      setTimeout(getAiMove, 750);
    }
  }

  function handleCellClick(index: number) {
    if (
      currentPlayer !== PLAYER_SYMBOL ||
      board[index] ||
      winner
    )
      return;

    const newBoard = [...board];
    newBoard[index] = PLAYER_SYMBOL;
    setBoard(newBoard);
    setCurrentPlayer(AI_SYMBOL);
  }

  return (
    <div className="gameboard-container">
      {winner && (
        <h2 className={`winner-text ${winner === PLAYER_SYMBOL ? "player" : "ai"}`}>
          {winner} wins!
        </h2>
      )}

      <div className="gameboard-grid">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={cell !== null || !!winner}
            className={`cell-button ${
              cell === PLAYER_SYMBOL
                ? "player"
                : cell === AI_SYMBOL
                ? "ai"
                : ""
            }`}
            title={!cell ? `Make a move on square ${idx + 1}` : ""}
          >
            {cell || ""}
          </button>
        ))}
      </div>

      <div className="gameboard-controls">
        <button onClick={startGame}>Play Again</button>
        <button onClick={() => alert("Player stats feature coming soon!")}>
          View Stats
        </button>
      </div>
    </div>
  );
}
