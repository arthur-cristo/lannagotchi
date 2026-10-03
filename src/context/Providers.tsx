import React from "react";
import { LannagotchiProvider } from "./LannagotchiContext";
import { LoveProvider } from "./LoveContext";
import { WindowsProvider } from "./WindowsContext";

const Providers = ({ children }: { children: React.ReactNode }) => (
  <LannagotchiProvider>
    <WindowsProvider>
      <LoveProvider>{children}</LoveProvider>
    </WindowsProvider>
  </LannagotchiProvider>
);

export default Providers;
