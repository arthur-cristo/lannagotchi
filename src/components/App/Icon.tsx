import { VStack, Image, Text } from "@chakra-ui/react";

type Props = {
  src: string;
  label: string;
};

const Icon = ({ src, label }: Props) => {
  return (
    <VStack
      gap={0}
      justifyContent="center"
      alignItems="center"
      cursor="pointer"
    >
      <Image
        src={src}
        alt={label}
        w="64px"
        h="64px"
        objectFit="contain"
        imageRendering="pixelated"
      />
      <Text fontSize="sm" className="white shadow">
        {label}
      </Text>
    </VStack>
  );
};

export default Icon;
