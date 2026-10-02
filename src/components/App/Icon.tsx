import { VStack, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import playClickSound from "../../utils/playClickSound";

type Props = {
  src: string;
  label: string;
  onClick: () => void;
};

const Icon = ({ src, label, onClick }: Props) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    window.setTimeout(() => setIsPressed(false), 140);
    playClickSound();
    onClick();
  };

  return (
    <VStack
      gap={0}
      justifyContent="center"
      alignItems="center"
      cursor="pointer"
      onClick={handleClick}
      transform={isPressed ? "scale(1.12)" : "scale(1)"}
      transition="transform 140ms steps(2, end)"
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
