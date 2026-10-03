import { Box, Flex, Image } from "@chakra-ui/react";
import Alanna from "./components/Alanna";
import { SPRITES } from "./consts";
import Arthur from "./components/Arthur";
import { useLannagotchi } from "./context/LannagotchiContext";
import Apps from "./components/App/Apps";
import InitialMenu from "./components/InitialMenu";
import { useWindows } from "./context/WindowsContext";
import Windows from "./components/App/Windows";

function App() {
  const { hasStarted } = useLannagotchi();
  const { isFullscreen } = useWindows();

  if (!hasStarted) return <InitialMenu />;

  return (
    <Flex
      w="100vw"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      bg="bg"
    >
      <Box
        h="100%"
        w={{ base: "100%", lg: "fit-content" }}
        position="relative"
        overflow="hidden"
      >
        <Image
          h="100%"
          w="100%"
          src={SPRITES.scene}
          alt="Quarto"
          imageRendering="pixelated"
          objectFit={isFullscreen ? "fill" : "cover"}
          objectPosition="bottom"
        />
        <Apps />
        <Windows />
        <Arthur />
        <Alanna />
      </Box>
    </Flex>
  );
}

export default App;
