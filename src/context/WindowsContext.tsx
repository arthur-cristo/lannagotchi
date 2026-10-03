import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import requestFullscreenAndPortrait from "../utils/requestFullscreenAndPortrait";
import { useLannagotchi } from "./LannagotchiContext";
import GalleryApp from "../components/Apps/GalleryApp";
import MusicApp from "../components/Apps/MusicApp";
import NotesApp from "../components/Apps/NotesApp";
import PuppiesApp from "../components/Apps/PuppiesApp";
import SettingsApp from "../components/Apps/SettingsApp";

type WindowsContextValue = {
  openWindows: string[];
  minimizedWindows: string[];
  windowOrder: string[];
  isFullscreen: boolean;
  focusWindow: (appName: string) => void;
  closeWindow: (appName: string) => void;
  minimizeWindow: (appName: string) => void;
  renderApp: (appName: string) => ReactNode;
  setOpenWindows: React.Dispatch<React.SetStateAction<string[]>>;
  setMinimizedWindows: React.Dispatch<React.SetStateAction<string[]>>;
  setWindowOrder: React.Dispatch<React.SetStateAction<string[]>>;
};

const WindowsContext = createContext<WindowsContextValue | null>(null);

export const WindowsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [windowOrder, setWindowOrder] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(() =>
    Boolean(document.fullscreenElement),
  );
  const { hasStarted } = useLannagotchi();

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
      case "Configurações":
        return <SettingsApp />;
      default:
        return null;
    }
  };

  const value = useMemo(
    () => ({
      openWindows,
      minimizedWindows,
      windowOrder,
      isFullscreen,
      focusWindow,
      closeWindow,
      minimizeWindow,
      renderApp,
      setOpenWindows,
      setMinimizedWindows,
      setWindowOrder,
    }),
    [
      openWindows,
      minimizedWindows,
      windowOrder,
      isFullscreen,
      focusWindow,
      closeWindow,
      minimizeWindow,
      renderApp,
      setOpenWindows,
      setMinimizedWindows,
      setWindowOrder,
    ],
  );

  return (
    <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>
  );
};

export const useWindows = () => {
  const ctx = useContext(WindowsContext);
  if (!ctx) throw new Error("useWindows must be used inside WindowsProvider");
  return ctx;
};
