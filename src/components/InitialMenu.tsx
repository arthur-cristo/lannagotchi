import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { useLannagotchi } from "../context/LannagotchiContext";
import requestFullscreenAndPortrait from "../utils/requestFullscreenAndPortrait";

const InitialMenu = () => {
  const { setHasStarted } = useLannagotchi();
  const startGame = async () => {
    await requestFullscreenAndPortrait();
    setHasStarted(true);
  };
  return (
    <Flex className="start-menu" direction="column" alignItems="center">
      <Box className="start-menu__panel">
        <Text as="h1" className="start-menu__title">
          Lannagotchi
        </Text>
        <Button className="start-menu__button" onClick={startGame}>
          Play
        </Button>
      </Box>
    </Flex>
  );
};

export default InitialMenu;
