import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

const PUPPY_API = "https://dog.ceo/api/breeds/image/random/6";
const SESSION_KEY = "lannagotchi:puppies";
const LOAD_AHEAD_DISTANCE = 320;

type PuppyResponse = {
  message: string[];
  status: string;
};

const getSavedPuppies = () => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
};

const PuppiesApp = () => {
  const [puppies, setPuppies] = useState<string[]>(getSavedPuppies);
  const [isLoading, setIsLoading] = useState(
    () => getSavedPuppies().length === 0,
  );
  const [error, setError] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadPuppies = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(PUPPY_API);
      if (!response.ok) throw new Error("Request failed");

      const data = (await response.json()) as PuppyResponse;
      if (data.status !== "success") throw new Error("API returned an error");

      setPuppies((current) => [...new Set([...current, ...data.message])]);
    } catch {
      setError("Could not fetch puppies right now.");
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (puppies.length === 0) void loadPuppies();
  }, [loadPuppies, puppies.length]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(puppies));
    } catch {
      // Session storage can be unavailable in private browsing contexts.
    }
  }, [puppies]);

  const handleFeedScroll = () => {
    const feed = feedRef.current;
    if (!feed || isLoadingRef.current) return;

    const distanceToEnd =
      feed.scrollHeight - feed.scrollTop - feed.clientHeight;
    if (distanceToEnd <= LOAD_AHEAD_DISTANCE) void loadPuppies();
  };

  return (
    <Flex direction="column" gap="8px" color="primary.950">
      <Box
        ref={feedRef}
        h="min(520px, 62vh)"
        overflowY="auto"
        overscrollBehavior="contain"
        scrollSnapType="y mandatory"
        onScroll={handleFeedScroll}
      >
        <Flex direction="column" gap="10px">
          {puppies.map((puppy) => (
            <Box
              key={puppy}
              flex="0 0 auto"
              scrollSnapAlign="start"
              bg="primary.950"
            >
              <Image
                display="block"
                w="100%"
                objectFit="cover"
                src={puppy}
                alt="Random puppy"
              />
            </Box>
          ))}
          {isLoading && (
            <Flex minH="80px" alignItems="center" justifyContent="center">
              <Spinner color="primary.600" />
            </Flex>
          )}
          {error && (
            <Box p="10px" border="2px solid" borderColor="primary.300">
              <Text m={0} fontSize="11px">
                {error}
              </Text>
            </Box>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default PuppiesApp;
