import { Button, Checkbox, Flex, VStack, Text } from "@chakra-ui/react";
import { useLannagotchi } from "../../context/LannagotchiContext";
import useSound from "../../hooks/useSound";

const SettingsApp = () => {
  const { setHasStarted, creepyMode, setCreepyMode, mute, setMute } =
    useLannagotchi();
  const { playClickSound } = useSound();

  return (
    <VStack gap={4}>
      <Flex justify="space-between" gap={4}>
        <Checkbox.Root
          checked={creepyMode}
          onCheckedChange={(e) => {
            setCreepyMode(!!e.checked);
            playClickSound();
          }}
        >
          <Checkbox.Label>Creepy Mode</Checkbox.Label>
          <Checkbox.HiddenInput />
          <Checkbox.Control
            cursor="pointer"
            borderWidth={2}
            borderColor="primary.600"
            bg="primary.100"
            _hover={{ bg: "primary.200" }}
            p={2}
          >
            {creepyMode && (
              <Text fontWeight="bold" color="primary.600">
                X
              </Text>
            )}
          </Checkbox.Control>
        </Checkbox.Root>
      </Flex>
      <Flex justify="space-between" gap={4}>
        <Checkbox.Root
          checked={mute}
          onCheckedChange={(e) => {
            setMute(!!e.checked);
            playClickSound();
          }}
        >
          <Checkbox.Label>Silenciar</Checkbox.Label>
          <Checkbox.HiddenInput />
          <Checkbox.Control
            cursor="pointer"
            borderWidth={2}
            borderColor="primary.600"
            bg="primary.100"
            _hover={{ bg: "primary.200" }}
            p={2}
          >
            {mute && (
              <Text fontWeight="bold" color="primary.600">
                X
              </Text>
            )}
          </Checkbox.Control>
        </Checkbox.Root>
      </Flex>
      <Button
        type="button"
        width="100%"
        py={6}
        variant="outline"
        borderWidth={2}
        bg="primary.100"
        borderColor="primary.600"
        _hover={{ bg: "primary.200" }}
        onClick={() => setHasStarted(false)}
      >
        Sair
      </Button>
    </VStack>
  );
};

export default SettingsApp;
