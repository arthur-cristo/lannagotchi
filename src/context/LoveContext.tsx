import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LOVE_DURATION = 2500;
const LOVE_COOLDOWN = 6000; // so they can walk apart before it can retrigger

type LoveContextValue = {
  inLove: boolean;
  tick: number;
  bump: () => void;
  startLove: () => void;
};

const LoveContext = createContext<LoveContextValue | null>(null);

export const LoveProvider = ({ children }: { children: React.ReactNode }) => {
  const [inLove, setInLove] = useState(false);
  const [tick, setTick] = useState(0);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const bump = useCallback(() => setTick((t) => t + 1), []);

  const startLove = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setInLove(true);
    timers.current.push(
      setTimeout(() => setInLove(false), LOVE_DURATION),
      setTimeout(() => (busy.current = false), LOVE_DURATION + LOVE_COOLDOWN),
    );
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const value = useMemo(
    () => ({ inLove, tick, bump, startLove }),
    [inLove, tick, bump, startLove],
  );

  return <LoveContext.Provider value={value}>{children}</LoveContext.Provider>;
};

export const useLove = () => {
  const ctx = useContext(LoveContext);
  if (!ctx) throw new Error("useLove must be used inside LoveProvider");
  return ctx;
};
