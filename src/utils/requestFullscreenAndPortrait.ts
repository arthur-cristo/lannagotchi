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
    } catch (error) {}
  }
};

export default requestFullscreenAndPortrait;
