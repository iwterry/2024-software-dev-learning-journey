import { Heading } from '@chakra-ui/react';
import usePlatform from '../hooks/usePlatform';
import useGenre from '../hooks/useGenre';
import useGameQueryStore from '../stores/GameQueryStore';


const GameHeading = () => {
  const platformId = useGameQueryStore((store) => store.gameQuery.platformId);
  const genreId = useGameQueryStore((store) => store.gameQuery.genreId);
  const platform = usePlatform(platformId);
  const genre = useGenre(genreId);
  const heading = `${platform?.name || ''} ${genre?.name || ''} Games`;

  return (
    <Heading as='h1' marginY={5} fontSize='5xl'>{heading}</Heading>
  )
}

export default GameHeading