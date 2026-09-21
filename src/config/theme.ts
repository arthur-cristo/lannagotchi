import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineSemanticTokens,
  defineTokens,
} from "@chakra-ui/react";

const tokens = defineTokens({
  colors: {
    primary: {
      50: { value: "#FAF5FF" },
      100: { value: "#F3E8FF" },
      200: { value: "#E9D5FF" },
      300: { value: "#D8B4FE" },
      400: { value: "#C084FC" },
      500: { value: "#A855F7" },
      600: { value: "#9333EA" },
      700: { value: "#7E22CE" },
      800: { value: "#6B21A8" },
      900: { value: "#581C87" },
      950: { value: "#3B0764" },
    },
  },
});

const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      DEFAULT: {
        value: { base: "{colors.primary.500}" },
      },
      subtle: {
        value: { base: "{colors.primary.50}" },
      },
      muted: {
        value: { base: "{colors.gray.50}" },
      },
    },

    fg: {
      DEFAULT: {
        value: { base: "{colors.gray.800}" },
      },
      muted: {
        value: { base: "{colors.gray.500}" },
      },
      subtle: {
        value: { base: "{colors.gray.400}" },
      },
      primary: {
        value: { base: "{colors.primary.700}" },
      },
    },

    border: {
      DEFAULT: {
        value: { base: "{colors.gray.200}" },
      },
      primary: {
        value: { base: "{colors.primary.200}" },
      },
    },

    accent: {
      DEFAULT: {
        value: { base: "{colors.primary.600}" },
      },
      hover: {
        value: { base: "{colors.primary.700}" },
      },
      active: {
        value: { base: "{colors.primary.800}" },
      },
      subtle: {
        value: { base: "{colors.primary.50}" },
      },
    },
  },
});

const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
  },
});

export const system = createSystem(defaultConfig, config);
