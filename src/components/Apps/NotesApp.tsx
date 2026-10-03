import { Box, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { ASCII_ART, LOREM_IPSUM, NOTE_CONTENT } from "../../consts";

const STAR_CHARS = ["⠁", "⡀", "⡂", "⢁", "⠄", "⢀", "⠈", "⠐", "⠂"];

const generateAsciiArt = () => {
  const lines = ASCII_ART.trim().split("\n");

  return lines
    .map((line) =>
      [...line]
        .map((char) => {
          if (char === "⠀") return char;

          if (Math.random() < 0.75) return "⠀";

          return STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)];
        })
        .join(""),
    )
    .join("\n");
};

const NotesApp = () => {
  const [arts, setArts] = useState([ASCII_ART]);
  const showLorem =
    typeof window !== "undefined" &&
    ["1", "true"].includes(
      new URLSearchParams(window.location.search).get("l")?.toLowerCase() ?? "",
    );

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;

    const isNearBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;

    if (isNearBottom) {
      setArts((current) => [...current, generateAsciiArt()]);
    }
  };

  return (
    <VStack
      minH="150px"
      h="100%"
      border="2px solid"
      borderColor="primary.200"
      bg="white"
      color="primary.950"
      overflowY="auto"
      onScroll={handleScroll}
      gap={2}
    >
      {showLorem ? (
        <Text
          m={0}
          p={4}
          fontSize="xs"
          textAlign="format"
          lineHeight={1.8}
          whiteSpace="pre-wrap"
        >
          {LOREM_IPSUM}
        </Text>
      ) : (
        <>
          <Text
            m={0}
            p={4}
            fontSize="xs"
            textAlign="format"
            lineHeight={1.8}
            whiteSpace="pre-wrap"
          >
            {NOTE_CONTENT}
          </Text>

          <VStack w="100%" gap={0}>
            <Text
              m={0}
              fontSize="xs"
              px={4}
              textAlign="format"
              lineHeight={1.8}
              whiteSpace="pre-wrap"
              color="white"
              className="purple shadow"
              pt={16}
              bg="linear-gradient(0deg,rgba(0, 29, 115, 1) 40%, rgba(255, 255, 255, 1) 100%)"
            >
              Cada estrela abaixo guarda um pedacinho do tempo que ainda quero
              passar com você.
            </Text>
            <Box
              bg="linear-gradient(0deg,rgba(0, 0, 0, 1) 0%, rgba(0, 29, 115, 1) 100%)"
              w="100%"
            >
              {arts.map((art, index) => (
                <Box
                  key={index}
                  whiteSpace="pre"
                  fontFamily="monospace"
                  fontSize="xs"
                  textAlign="center"
                  color="white"
                  w="100%"
                >
                  {art}
                </Box>
              ))}
            </Box>
          </VStack>
        </>
      )}
    </VStack>
  );
};

export default NotesApp;
