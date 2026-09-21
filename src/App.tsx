import { Box, Flex, Image } from "@chakra-ui/react";
import Alanna from "./components/Alanna";
import { SPRITES } from "./consts";

function App() {
  return (
    <Flex
      w="100vw"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      bg="bg"
    >
      <Box h="100%"  position="relative"  bg="red">
        <Image
          h="100%"
          src={SPRITES.scene}
          alt="Quarto"
          imageRendering="pixelated"
        />
        <Alanna />
      </Box>
    </Flex>
  );
}

export default App;
