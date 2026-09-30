import { Box, Text } from "@chakra-ui/react";
import { NOTE_CONTENT } from "../../consts";

const NotesApp = () => {
  return (
    <Box
      minH="150px"
      p="12px"
      border="2px solid"
      borderColor="primary.200"
      bg="white"
      color="primary.950"
      whiteSpace="pre-wrap"
    >
      <Text m={0} fontSize="11px" lineHeight={1.8}>
        {NOTE_CONTENT}
      </Text>
    </Box>
  );
};

export default NotesApp;
