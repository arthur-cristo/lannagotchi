const playClickSound = () => {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return;

  const audioContext = new AudioContextConstructor();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(1400, now);
  gain.gain.setValueAtTime(0.035, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.025);

  window.setTimeout(() => void audioContext.close(), 60);
};

export default playClickSound;
