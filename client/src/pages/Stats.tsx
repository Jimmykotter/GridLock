import { useQuery } from '@apollo/client';
import { GET_USER_STATS } from '../utils/queries';
import { Link } from 'react-router-dom';

interface Game {
  datePlayed: string;
  result: string;
}

interface UserStatsData {
  getUserStats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    gameHistory: Game[];
  };
}

const Stats = () => {
  const { loading, error, data } = useQuery<UserStatsData>(GET_USER_STATS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading stats</p>;

  const { gamesPlayed, wins, losses, gameHistory } = data?.getUserStats || { gamesPlayed: 0, wins: 0, losses: 0, gameHistory: [] };

  return (
    <div className="stats-page" style={{ padding: '1rem' }}>
      <h1>Your Stats</h1>
      <p>Games Played: {gamesPlayed}</p>
      <p>Wins: {wins}</p>
      <p>Losses: {losses}</p>

      <h2>Game History</h2>
      {gameHistory.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <ul>
          {gameHistory.map((game, index) => (
            <li key={index}>
              {game.datePlayed}: {game.result}
            </li>
          ))}
        </ul>
      )}

      <Link to="/Stats">
        <button>Play Again</button>
      </Link>
    </div>
  );
};

export default Stats;
