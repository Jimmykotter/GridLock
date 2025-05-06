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
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="cell"
            onClick={() => handleCellClick(idx)}
            disabled={!!cell}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
