import { useEffect, useState } from "react";
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
  useEffect(startGame, []); //start game on mount
  useEffect(() => {
    if (currentPlayer !== AI_SYMBOL || winner) return;
    // //  Added winner check so AI doesn't move after game over
    checkWin(board);
  }, [board]);
  //  Added winner to dependency array for safety
  function getAiMove() {
    if (winner) return;
    const emptyIndexes = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null) as number[];
    if (emptyIndexes.length === 0) return; // no available moves
    const randomMove =
      emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    const newBoard = [...board];
    newBoard[randomMove] = AI_SYMBOL;
    setBoard(newBoard);
    setCurrentPlayer(PLAYER_SYMBOL); // return turn to human
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
    if (currentPlayer !== PLAYER_SYMBOL || board[index] || winner) return;
    //  Added winner check: prevents player from clicking after game ends
    const newBoard = [...board];
    newBoard[index] = PLAYER_SYMBOL;
    setBoard(newBoard);
    setCurrentPlayer(AI_SYMBOL); // Switch to AI
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {winner && <h2>{winner} wins!</h2>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: "5px",
          marginBottom: "20px",
        }}
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "32px",
            }}
            title={!cell ? `make a move on square ${idx + 1}` : ""}
            disabled={cell !== null || winner !== null}
            // disable button if the square is filled or someone won
          >
            {cell || ""}
          </button>
        ))}
      </div>
      {/* added buttons for play agian and view stats */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={startGame}>Play Again</button>
        <button onClick={() => alert("Player stats feature coming soon!")}>
          View Stats
        </button>
      </div>
    </div>
  );
}