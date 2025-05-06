import { useState, useEffect } from "react";

export function GameBoard() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const token = localStorage.getItem("token") || "";

  const startGame = async () => {
    const res = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      console.error("Failed to start game");
      return;
    }
    const { gameId: id, board: initialBoard } = await res.json();
    setGameId(id);
    setBoard(initialBoard);
  };

  const handleCellClick = async (idx: number) => {
    if (!gameId || board[idx]) return;
    const res = await fetch(`/api/games/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ position: idx }),
    });
    if (!res.ok) {
      console.error("Move failed");
      return;
    }
    const { board: updatedBoard } = await res.json();
    setBoard(updatedBoard);
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="gameboard">
      <h1>Tic‑Tac‑Toe</h1>
      <div className="board-grid">
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
            className="cell"
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
            {cell}
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
