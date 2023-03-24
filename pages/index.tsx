import { Box, Text, Flex } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import GradientLayout from '../components/gradientLayout';
import { db } from '../lib/db';
import { useMe } from '../lib/hooks';

const Home = ({ artists }) => {
  const { user } = useMe();

  return (
    <GradientLayout
      roundImage
      color="blue"
      subtitle="profile"
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user?.playlistsCount} public playlists`}
      image="./profile.png"
    >
      <Box color="white" paddingX="40px">
        <Box marginBottom="40px">
          <Text fontSize="2xl" fontWeight="bold">
            Top artists this month
          </Text>
          <Text fontSize="sm">only visible for you</Text>
        </Box>
        <Flex>
          {artists.map((artist) => (
            <Box key={artist.name} paddingX="5px" width="20%">
              <Box bg="gray.900" borderRadius="4px" padding="15px" width="100%">
                <Image
                  src="http://placekitten.com/300/300"
                  borderRadius="100%"
                />
                <Box marginTop="20px">
                  <Text fontSize="large">{artist.name}</Text>
                  <Text fontSize="x-small">Artist</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </GradientLayout>
  );
};

export const getServerSideProps = async () => {
  const artists = await db.artist.findMany({});

  return {
    props: { artists },
  };
};

export default Home;
