import { useEffect, useState } from 'react';
import '../styles/gameboard.css';

type Cell = string | null;
const PLAYER_SYMBOL: Cell = 'X';
const AI_SYMBOL:      Cell = 'O';
const STARTING_BOARD: Cell[] = Array(9).fill(null);

export default function GameBoard() {
  const [board, setBoard] = useState<Cell[]>([...STARTING_BOARD]);
  const [currentPlayer, setCurrentPlayer] = useState<Cell>(PLAYER_SYMBOL);
  const [winner, setWinner] = useState<Cell>(null);

  const startGame = () => {
    setBoard([...STARTING_BOARD]);
    setCurrentPlayer(PLAYER_SYMBOL);
    setWinner(null);
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    checkWin(board);
  }, [board]);

  useEffect(() => {
    if (currentPlayer !== AI_SYMBOL || winner) return;

    const getAiMove = () => {
      const emptyIndexes = board.reduce<number[]>((acc, cell, idx) => {
        if (cell === null) acc.push(idx);
        return acc;
      }, []);
      if (emptyIndexes.length === 0) return;

      const randomMove =
        emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

      setBoard(prev => {
        const next = [...prev];
        next[randomMove] = AI_SYMBOL;
        return next;
      });
      setCurrentPlayer(PLAYER_SYMBOL);
    };

    const timer = setTimeout(getAiMove, 750);
    return () => clearTimeout(timer);
  }, [currentPlayer, board, winner]);

  const checkWin = (bd: Cell[]) => {
    const combos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6],
    ];
    for (const [a,b,c] of combos) {
      if (bd[a] && bd[a] === bd[b] && bd[b] === bd[c]) {
        setWinner(bd[a]);
        return;
      }
    }
  };

  const handleCellClick = (i: number) => {
    if (currentPlayer !== PLAYER_SYMBOL || board[i] !== null || winner) return;

    setBoard(prev => {
      const next = [...prev];
      next[i] = PLAYER_SYMBOL;
      return next;
    });
    setCurrentPlayer(AI_SYMBOL);
  };

  return (
    <div className="gameboard-container">
      {winner && (
        <div
          className={`winner-text ${
            winner === PLAYER_SYMBOL ? 'player' : 'ai'
          }`}
        >
          {winner} wins!
        </div>
      )}

      <div className="gameboard-grid">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            className={`cell-button ${
              cell === PLAYER_SYMBOL ? 'player' :
              cell === AI_SYMBOL     ? 'ai'     : ''
            }`}
            title={cell === null ? `Make a move on square ${idx + 1}` : ''}
            disabled={cell !== null || winner !== null}
          >
            {cell ?? ''}
          </button>
        ))}
      </div>

      <div className="gameboard-controls">
        <button onClick={startGame}>Play Again</button>
        <button onClick={() => alert('Player stats feature coming soon!')}>
          View Stats
        </button>
      </div>
    </div>
  );
}
