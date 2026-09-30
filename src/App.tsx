import { useState } from "react";
import { Box, Button, Flex, Grid, Image, Text } from "@chakra-ui/react";
import Alanna from "./components/Alanna";
import { APPS, SPRITES } from "./consts";
import Icon from "./components/App/Icon";
import Arthur from "./components/Arthur";
import { useLannagotchi } from "./context/LannagotchiContext";

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  const startGame = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.error("Failed to enter fullscreen mode:", e);
    }

    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
      navigator.userAgent,
    );

    if (isMobile && screen.orientation?.lock) {
      try {
        await screen.orientation.lock("portrait");
      } catch (e) {
        console.error("Failed to lock screen orientation:", e);
      }
    }

    setHasStarted(true);
  };

  const toggleArthur = useLannagotchi().toggleShowArthur;

  if (!hasStarted) {
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
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      bg="bg"
    >
      <Box h="100%" w={{ base: "100%", lg: "fit-content" }} position="relative">
        <Image
          h="100%"
          w="100%"
          src={SPRITES.scene}
          alt="Quarto"
          imageRendering="pixelated"
        />
        <Grid
          position="absolute"
          top="0"
          left="0"
          right="0"
          w="100%"
          h="100%"
          templateColumns="repeat(4, 1fr)"
          templateRows="repeat(9, 1fr)"
          p={4}
        >
          {APPS.map((app) => (
            <Icon key={app.name} src={app.icon} label={app.name} onClick={toggleArthur} />
          ))}
        </Grid>
        <Arthur />
        <Alanna />
      </Box>
    </Flex>
  );
}

export default App;
