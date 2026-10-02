import { Box, Flex, Image } from "@chakra-ui/react";
import { useState } from "react";
import { GALLERY } from "../../consts";
import shuffle from "../../utils/shufle";

const GalleryApp = () => {
  const [photos] = useState(() => shuffle(GALLERY));

  return (
    <Flex direction="column" gap="8px" color="primary.950">
      <Box
        h="min(520px, 62vh)"
        overflowY="auto"
        overscrollBehavior="contain"
        scrollSnapType="y mandatory"
      >
        <Flex direction="column" gap="10px">
          {photos.map((path, index) => (
            <Box
              key={`${index}-${path}`}
              flex="0 0 auto"
              scrollSnapAlign="start"
              bg="primary.950"
            >
              <Image
                display="block"
                w="100%"
                objectFit="cover"
                src={photos[index]}
                alt="Random puppy"
              />
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default GalleryApp;
