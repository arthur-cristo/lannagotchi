import React from "react";
import { LannagotchiProvider } from "./LannagotchiContext";
import { LoveProvider } from "./LoveContext";

const Providers = ({ children }: { children: React.ReactNode }) => (
  <LannagotchiProvider>
    <LoveProvider>{children}</LoveProvider>
  </LannagotchiProvider>
);

export default Providers;
