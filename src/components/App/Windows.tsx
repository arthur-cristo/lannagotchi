import { useWindows } from "../../context/WindowsContext";
import DesktopWindow from "./DesktopWindow";

const Windows = () => {
  const {
    openWindows,
    minimizedWindows,
    windowOrder,
    focusWindow,
    closeWindow,
    minimizeWindow,
    renderApp,
  } = useWindows();
  return (
    <>
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
    </>
  );
};

export default Windows;
