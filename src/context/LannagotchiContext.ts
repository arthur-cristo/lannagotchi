import {
  createContext,
  createElement,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type LannagotchiState = Record<string, unknown>;

interface LannagotchiContextValue {
  state: LannagotchiState;
  setState: Dispatch<SetStateAction<LannagotchiState>>;
  showArthur: boolean;
  toggleShowArthur: () => void;
}

const LannagotchiContext = createContext<LannagotchiContextValue | undefined>(
  undefined,
);

interface LannagotchiProviderProps {
  children: ReactNode;
  initialState?: LannagotchiState;
}

export function LannagotchiProvider({
  children,
  initialState = {},
}: LannagotchiProviderProps) {
  const [state, setState] = useState<LannagotchiState>(initialState);
  const [showArthur, setShowArthur] = useState(false);
  const toggleShowArthur = () => setShowArthur((current) => !current);

  return createElement(
    LannagotchiContext.Provider,
    { value: { state, setState, showArthur, toggleShowArthur } },
    children,
  );
}

export function useLannagotchi() {
  const context = useContext(LannagotchiContext);

  if (!context) {
    throw new Error(
      "useLannagotchi deve ser usado dentro de um LannagotchiProvider.",
    );
  }

  return context;
}

export { LannagotchiContext };
