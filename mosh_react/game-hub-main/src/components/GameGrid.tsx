import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import { Genre } from "../entities/Genre";
import GameCard from "./GameCard";
import GameCardContainer from "./GameCardContainer";
import GameCardSkeleton from "./GameCardSkeleton";
import { Platform } from "../entities/Platform";
import useGameQueryStore from "../stores/GameQueryStore";


const GameGrid = () => {
  const gameQuery = useGameQueryStore((store) => store.gameQuery);
  const { data, error, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useGames(gameQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];

  if (error) return <Text>{error.message}</Text>;

  return (
    <>
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        padding="10px"
        spacing={6}
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <GameCardContainer key={skeleton}>
              <GameCardSkeleton />
            </GameCardContainer>
          ))}
        {data?.pages.map((page) => {
          return page.results.map((game) => (
            <GameCardContainer key={game.id}>
              <GameCard game={game} />
            </GameCardContainer>
          ))
        })}
      </SimpleGrid>
      {hasNextPage && (
        <button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} style={{marginTop: "10px"}}>
          { isFetchingNextPage ? 'Loading' : 'Load More' }
        </button>
      )}
    </>
  );
};

export default GameGrid;
