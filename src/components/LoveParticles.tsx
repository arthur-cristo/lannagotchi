import { Box, Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { SPRITES } from "../consts";

type HeartData = {
  id: number;
  dx: number;
  rise: number;
  size: number;
  duration: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const Heart = ({ dx, rise, size, duration }: HeartData) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = ref.current?.animate(
      [
        { transform: "translate(0, 0)", opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { transform: `translate(${dx}px, ${-rise}px)`, opacity: 0 },
      ],
      { duration, easing: "ease-out", fill: "both" },
    );
    return () => animation?.cancel();
  }, [dx, rise, duration]);

  return (
    <Box
      ref={ref}
      position="absolute"
      bottom={0}
      left={0}
      ml={`${-size / 2}px`}
      w={`${size}px`}
      h={`${size}px`}
      opacity={0}
    >
      <Image src={SPRITES.heart} w="100%" h="100%" />
    </Box>
  );
};

const LoveParticles = ({
  active,
  side,
}: {
  active: boolean;
  side: "left" | "right";
}) => {
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (!active) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const spawn = () => {
      const heart: HeartData = {
        id: nextId.current++,
        dx: rand(-14, 14),
        rise: rand(30, 60),
        size: Math.round(rand(8, 16)),
        duration: rand(900, 1500),
      };

      setHearts((prev) => [...prev, heart]);
      setTimeout(
        () => setHearts((prev) => prev.filter((h) => h.id !== heart.id)),
        heart.duration + 50,
      );

      timeoutId = setTimeout(spawn, rand(150, 400));
    };

    spawn();
    return () => clearTimeout(timeoutId);
  }, [active]);

  return (
    <Box
      position="absolute"
      bottom="90%" // roughly head height; tweak to your sprites
      left={side === "left" ? 0 : "100%"}
      w={0}
      h={0}
      pointerEvents="none"
    >
      {hearts.map((h) => (
        <Heart key={h.id} {...h} />
      ))}
    </Box>
  );
};

export default LoveParticles;