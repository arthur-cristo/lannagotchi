import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

const API = "https://dog.ceo/api";
const IMAGE_BASE = "https://images.dog.ceo/breeds/";
const STORAGE_KEY = "lannagotchi:puppy-paths";
const PAGE_SIZE = 6;
const LOAD_AHEAD_DISTANCE = 320;
const QUICK_BATCH = 50;
const CONCURRENCY = 8;

type ApiResponse<T> = { message: T; status: string };

const toPath = (url: string) =>
  url.startsWith(IMAGE_BASE) ? url.slice(IMAGE_BASE.length) : url;

const toUrl = (path: string) =>
  path.startsWith("http") ? path : IMAGE_BASE + path;

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getJson = async <T,>(url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Request failed");

  const data = (await response.json()) as ApiResponse<T>;
  if (data.status !== "success") throw new Error("API returned an error");

  return data.message;
};

const readPool = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
};

const writePool = (paths: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
  } catch {}
};

const fetchQuickBatch = async () =>
  (await getJson<string[]>(`${API}/breeds/image/random/${QUICK_BATCH}`)).map(
    toPath,
  );

const fetchAllPaths = async () => {
  const breeds = Object.keys(
    await getJson<Record<string, string[]>>(`${API}/breeds/list/all`),
  );
  const all: string[] = [];

  for (let i = 0; i < breeds.length; i += CONCURRENCY) {
    const results = await Promise.allSettled(
      breeds
        .slice(i, i + CONCURRENCY)
        .map((breed) => getJson<string[]>(`${API}/breed/${breed}/images`)),
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        all.push(...result.value.map(toPath));
      }
    }
  }

  return all;
};

const PuppiesApp = () => {
  const [initialPool] = useState(readPool);
  const poolRef = useRef(initialPool);

  const [queue, setQueue] = useState(() => shuffle(initialPool));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(initialPool.length === 0);
  const [error, setError] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  const mergeIntoPool = useCallback((paths: string[]) => {
    const known = new Set(poolRef.current);
    const fresh = [...new Set(paths)].filter((path) => !known.has(path));

    if (fresh.length > 0) {
      poolRef.current = [...poolRef.current, ...fresh];
      writePool(poolRef.current);
    }

    return fresh;
  }, []);

  useEffect(() => {
    if (initialPool.length > 0 || isSyncingRef.current) return;
    isSyncingRef.current = true;

    void (async () => {
      try {
        const quick = mergeIntoPool(await fetchQuickBatch());
        setQueue(shuffle(quick));
      } catch {
        setError("Could not fetch puppies right now.");
      } finally {
        setIsLoading(false);
      }

      try {
        const fresh = mergeIntoPool(await fetchAllPaths());
        setQueue((current) => [...current, ...shuffle(fresh)]);
        setError(null);
      } catch {
      } finally {
        isSyncingRef.current = false;
      }
    })();
  }, [initialPool, mergeIntoPool]);

  const refillQueue = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      mergeIntoPool(await fetchAllPaths());

      if (poolRef.current.length === 0) throw new Error("No puppies");

      setQueue((current) => [...current, ...shuffle(poolRef.current)]);
      setVisibleCount((count) => count + PAGE_SIZE);
    } catch {
      setError("Could not fetch puppies right now.");
    } finally {
      isSyncingRef.current = false;
      setIsLoading(false);
    }
  }, [mergeIntoPool]);

  const handleFeedScroll = () => {
    const feed = feedRef.current;
    if (!feed) return;

    const distanceToEnd =
      feed.scrollHeight - feed.scrollTop - feed.clientHeight;
    if (distanceToEnd > LOAD_AHEAD_DISTANCE) return;

    if (visibleCount < queue.length) {
      setVisibleCount((count) => Math.min(count + PAGE_SIZE, queue.length));
      return;
    }

    void refillQueue();
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
          {queue.slice(0, visibleCount).map((path, index) => (
            <Box
              key={`${index}-${path}`}
              flex="0 0 auto"
              scrollSnapAlign="start"
              bg="primary.950"
            >
              <Image
                display="block"
                w="100%"
                objectFit="cover"
                src={toUrl(path)}
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
