import { Game } from "../hooks/useGames";

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <>
      <div>
        <img src={game.background_image} style={{ width: "300px"}}/>
        <h3>{game.name}</h3>
        <ul>
          {game.parent_platforms.map(({ platform }) => <li key={platform.id}>{platform.name}</li> )}
        </ul>
        <span>{game.metacritic}</span>
      </div>
    </>
  );
}