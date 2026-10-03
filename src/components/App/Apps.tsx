import { Grid } from "@chakra-ui/react";
import { APPS, WHATSAPP_URL } from "../../consts";
import Icon from "./Icon";
import { useLannagotchi } from "../../context/LannagotchiContext";
import { useWindows } from "../../context/WindowsContext";

const Apps = () => {
  const toggleArthur = useLannagotchi().toggleShowArthur;
  const { setOpenWindows, setMinimizedWindows, focusWindow } = useWindows();

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

  return (
    <Grid
      position="absolute"
      top="0"
      left="0"
      right="0"
      w="100%"
      h="100%"
      templateColumns="repeat(3, 1fr)"
      templateRows="repeat(6, 1fr)"
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
  );
};

export default Apps;
