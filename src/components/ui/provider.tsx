"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "../../config/theme";
import { LannagotchiProvider } from "../../context/LannagotchiContext";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <LannagotchiProvider>
        <ColorModeProvider {...props} forcedTheme="light" />
      </LannagotchiProvider>
    </ChakraProvider>
  );
}
