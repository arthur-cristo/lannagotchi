import { useEffect, useState, type ReactNode } from "react";
import { Box, Button, Flex, Grid, Image, Text } from "@chakra-ui/react";
import Alanna from "./components/Alanna";
import { APPS, SPRITES } from "./consts";
import Icon from "./components/App/Icon";
import Arthur from "./components/Arthur";
import { useLannagotchi } from "./context/LannagotchiContext";
import DesktopWindow from "./components/App/DesktopWindow";
import NotesApp from "./components/Apps/NotesApp";
import MusicApp from "./components/Apps/MusicApp";
import PuppiesApp from "./components/Apps/PuppiesApp";
import GalleryApp from "./components/Apps/GalleryApp";

const requestFullscreenAndPortrait = async () => {
  if (!document.fullscreenElement) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error("Failed to enter fullscreen mode:", error);
    }
  }

  if (screen.orientation?.lock) {
    try {
      await screen.orientation.lock("portrait");
    } catch (error) {
      console.error("Failed to lock screen orientation:", error);
    }
  }
};

const WHATSAPP_URL = "https://wa.me/5571999408469";

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(() =>
    Boolean(document.fullscreenElement),
  );
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [windowOrder, setWindowOrder] = useState<string[]>([]);

  const startGame = async () => {
    await requestFullscreenAndPortrait();
    setHasStarted(true);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const handlePagePointerDown = () => {
      void requestFullscreenAndPortrait();
    };

    document.addEventListener("pointerdown", handlePagePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handlePagePointerDown);
  }, [hasStarted]);

  const toggleArthur = useLannagotchi().toggleShowArthur;

  const handleAppClick = (appName: string) => {
    if (appName === "Arthur") {
      toggleArthur();
      return;
    }

    if (appName === "WhatsApp") {
      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (appName === "Pixel Art Tool") {
      window.open(
        "https://arthur-cristo.github.io/PixelArtTool/",
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    setOpenWindows((current) =>
      current.includes(appName) ? current : [...current, appName],
    );
    setMinimizedWindows((current) =>
      current.filter((name) => name !== appName),
    );
    focusWindow(appName);
  };

  const focusWindow = (appName: string) => {
    setWindowOrder((current) => [
      ...current.filter((name) => name !== appName),
      appName,
    ]);
  };

  const closeWindow = (appName: string) => {
    setOpenWindows((current) => current.filter((name) => name !== appName));
    setMinimizedWindows((current) =>
      current.filter((name) => name !== appName),
    );
    setWindowOrder((current) => current.filter((name) => name !== appName));
  };

  const minimizeWindow = (appName: string) => {
    setMinimizedWindows((current) =>
      current.includes(appName) ? current : [...current, appName],
    );
  };

  const renderApp = (appName: string): ReactNode => {
    switch (appName) {
      case "Notas":
        return <NotesApp />;
      case "Músicas":
        return <MusicApp />;
      case "Cachorros":
        return <PuppiesApp />;
      case "Galeria":
        return <GalleryApp />;
      default:
        return null;
    }
  };

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
        <Grid
          position="absolute"
          top="0"
          left="0"
          right="0"
          w="100%"
          h="100%"
          templateColumns="repeat(4, 1fr)"
          templateRows="repeat(7, 1fr)"
          p={4}
        >
          {APPS.map((app) => (
            <Icon
              key={app.name}
              src={app.icon}
              label={app.name}
              onClick={() => handleAppClick(app.name)}
            />
          ))}
        </Grid>
        {openWindows.map((appName) => (
          <DesktopWindow
            key={appName}
            title={appName}
            zIndex={10 + windowOrder.indexOf(appName)}
            isMinimized={minimizedWindows.includes(appName)}
            onFocus={() => focusWindow(appName)}
            onClose={() => closeWindow(appName)}
            onMinimize={() => minimizeWindow(appName)}
          >
            {renderApp(appName)}
          </DesktopWindow>
        ))}
        <Arthur />
        <Alanna />
      </Box>
    </Flex>
  );
}

export default App;
