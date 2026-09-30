import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

type WindowPosition = {
  x: number;
  y: number;
};

type DesktopWindowProps = {
  title: string;
  children?: ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  initialPosition?: WindowPosition;
};

const DEFAULT_POSITION = { x: 24, y: 24 };

const DesktopWindow = ({
  title,
  children,
  onClose,
  onMinimize = onClose,
  onFocus,
  zIndex = 10,
  initialPosition = DEFAULT_POSITION,
}: DesktopWindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const windowRef = useRef<HTMLElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isMaximized) return;

    const scene = windowRef.current?.parentElement;
    if (!scene) return;

    const sceneBounds = scene.getBoundingClientRect();
    dragOffset.current = {
      x: event.clientX - sceneBounds.left - position.x,
      y: event.clientY - sceneBounds.top - position.y,
    };
    onFocus?.();
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const windowElement = windowRef.current;
    const scene = windowElement?.parentElement;
    if (!windowElement || !scene) return;

    const sceneBounds = scene.getBoundingClientRect();
    const maxX = scene.clientWidth - windowElement.offsetWidth;
    const maxY = scene.clientHeight - windowElement.offsetHeight;

    setPosition({
      x: Math.max(
        0,
        Math.min(event.clientX - sceneBounds.left - dragOffset.current.x, maxX),
      ),
      y: Math.max(
        0,
        Math.min(event.clientY - sceneBounds.top - dragOffset.current.y, maxY),
      ),
    });
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  useEffect(() => {
    if (!isDragging) return;

    const stopDraggingOnBlur = () => setIsDragging(false);
    window.addEventListener("blur", stopDraggingOnBlur);
    return () => window.removeEventListener("blur", stopDraggingOnBlur);
  }, [isDragging]);

  const controlProps = {
    display: "grid",
    w: "24px",
    h: "23px",
    placeItems: "center",
    p: 0,
    border: "2px solid",
    borderColor: "primary.950",
    borderRadius: 0,
    bg: "primary.300",
    color: "primary.950",
    fontFamily: "inherit",
    fontSize: "13px",
    lineHeight: 1,
    cursor: "pointer",
    _hover: { bg: "primary.50" },
    _focusVisible: { bg: "primary.50" },
    _active: { transform: "translate(1px, 1px)" },
  } as const;

  return (
    <Box
      as="section"
      ref={windowRef}
      position="absolute"
      zIndex={zIndex}
      display="flex"
      w={isMaximized ? "auto" : "min(360px, calc(100% - 16px))"}
      minH={isMaximized ? 0 : "220px"}
      flexDirection="column"
      inset={isMaximized ? 2 : undefined}
      left={isMaximized ? undefined : `${position.x}px`}
      top={isMaximized ? undefined : `${position.y}px`}
      border="3px solid"
      borderColor="primary.950"
      outline="2px solid"
      outlineColor="primary.50"
      bg="primary.100"
      boxShadow="8px 8px 0 rgba(25, 19, 28, 0.55)"
      color="primary.950"
      textAlign="left"
      imageRendering="pixelated"
      aria-label={`${title} window`}
      onPointerDownCapture={onFocus}
    >
      <Flex
        minH="32px"
        alignItems="center"
        justifyContent="space-between"
        p="3px 4px 3px 8px"
        background="linear-gradient(90deg, #581c87, #a855f7 70%, #c084fc)"
        color="primary.50"
        cursor="grab"
        touchAction="none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <Text
          overflow="hidden"
          fontSize="12px"
          lineHeight={1}
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {title}
        </Text>
        <Flex gap="3px" onPointerDown={(event) => event.stopPropagation()}>
          <Button
            type="button"
            {...controlProps}
            onClick={onMinimize}
            aria-label={`Minimize ${title}`}
          >
            -
          </Button>
          <Button
            type="button"
            {...controlProps}
            onClick={() => setIsMaximized((current) => !current)}
            aria-label={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
          >
            □
          </Button>
          <Button
            type="button"
            {...controlProps}
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            X
          </Button>
        </Flex>
      </Flex>
      <Box flex={1} p="20px" bg="primary.50">
        {children}
      </Box>
    </Box>
  );
};

export default DesktopWindow;
