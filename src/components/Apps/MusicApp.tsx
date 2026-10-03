import { Box, Button, Flex, Image, Slider, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import {
  LuPause,
  LuPlay,
  LuSkipBack,
  LuSkipForward,
  LuVolume2,
} from "react-icons/lu";
import { SONGS, type Song } from "../../consts";
import shuffle from "../../utils/shufle";
import { useLannagotchi } from "../../context/LannagotchiContext";

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const MusicApp = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const [songs] = useState(shuffle(SONGS));
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const song: Song | undefined = songs[songIndex];
  const { mute } = useLannagotchi();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    audio.pause();
    audio.volume = mute ? 0 : volume;
    audio.load();
    setCurrentTime(0);
    setDuration(0);

    void audio.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false),
    );
  }, [song]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = mute ? 0 : volume;
    }
  }, [volume, mute]);

  useEffect(() => {
    if (!isVolumeOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!volumeControlRef.current?.contains(event.target as Node)) {
        setIsVolumeOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isVolumeOpen]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const selectSong = (index: number) => {
    setSongIndex(index);
    setIsPlaying(false);
  };

  const selectPreviousSong = () => {
    selectSong((songIndex - 1 + SONGS.length) % SONGS.length);
  };

  const selectNextSong = () => {
    selectSong((songIndex + 1) % SONGS.length);
  };

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLAudioElement>) => {
    setDuration(event.currentTarget.duration);
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(event.currentTarget.currentTime);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  if (!song) {
    return <Text color="primary.800">Add songs to SONGS in src/consts.</Text>;
  }

  return (
    <Flex
      h="100%"
      minH={0}
      direction="column"
      gap="14px"
      color="primary.950"
      overflow="hidden"
    >
      <Image
        alignSelf="center"
        boxSize="140px"
        objectFit="cover"
        src={song.coverPath}
        alt={`${song.name} cover`}
        imageRendering="pixelated"
      />
      <Box>
        <Text m={0} fontSize="14px" fontWeight="bold">
          {song.name}
        </Text>
      </Box>
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={selectNextSong}
      >
        <source src={song.mp3Path} type="audio/mpeg" />
      </audio>
      <Slider.Root
        min={0}
        max={duration || 1}
        value={[Math.min(currentTime, duration || 1)]}
        onValueChange={(details) => seek(details.value[0] ?? 0)}
        aria-label={["Song progress"]}
      >
        <Slider.Control>
          <Slider.Track bg="primary.200">
            <Slider.Range bg="primary.600" />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
      <Flex justifyContent="space-between" color="primary.700" fontSize="10px">
        <Text m={0}>{formatTime(currentTime)}</Text>
        <Text m={0}>{formatTime(duration)}</Text>
      </Flex>
      <Flex justifyContent="center" gap="10px" position="relative">
        <Button
          aria-label="Previous song"
          onClick={selectPreviousSong}
          bg="primary.600"
        >
          <LuSkipBack />
        </Button>
        <Button
          aria-label={isPlaying ? "Pause song" : "Play song"}
          onClick={togglePlayback}
          bg="primary.600"
        >
          {isPlaying ? <LuPause /> : <LuPlay />}
        </Button>
        <Button
          aria-label="Next song"
          onClick={selectNextSong}
          bg="primary.600"
        >
          <LuSkipForward />
        </Button>
        <Box ref={volumeControlRef} position="absolute" right={1}>
          <Button
            aria-label="Adjust volume"
            onClick={() => setIsVolumeOpen((isOpen) => !isOpen)}
            color="primary.600"
            bg="transparent"
          >
            <LuVolume2 />
          </Button>
          {isVolumeOpen && (
            <Box
              position="absolute"
              right={0}
              bottom="calc(100% + 8px)"
              width="120px"
              padding="10px"
              bg="primary.100"
              border="1px solid"
              borderColor="primary.300"
              borderRadius="4px"
              zIndex={1}
            >
              <Slider.Root
                min={0}
                max={100}
                value={[volume * 100]}
                onValueChange={(details) =>
                  setVolume((details.value[0] ?? 50) / 100)
                }
                aria-label={["Volume"]}
              >
                <Slider.Control>
                  <Slider.Track bg="primary.200">
                    <Slider.Range bg="primary.600" />
                  </Slider.Track>
                  <Slider.Thumbs />
                </Slider.Control>
              </Slider.Root>
            </Box>
          )}
        </Box>
      </Flex>
      <Box flex={1} minH={0} overflowY="auto">
        <Flex direction="column" gap="4px">
          {songs.map((item, index) => (
            <Button
              key={`${item.name}-${item.mp3Path}`}
              justifyContent="flex-start"
              variant={index === songIndex ? "solid" : "outline"}
              color={index === songIndex ? "white" : "primary.600"}
              bg={index === songIndex ? "primary.600" : "transparent"}
              borderColor={index === songIndex ? "primary.600" : "primary.100"}
              onClick={() => selectSong(index)}
              px={2}
            >
              <Text
                width="2ch"
                fontSize="xs"
                flexShrink={0}
                textAlign="right"
                color={index === songIndex ? "primary.300" : "primary.400"}
              >
                {index + 1}
              </Text>

              <Image
                boxSize="24px"
                flexShrink={0}
                objectFit="cover"
                src={item.coverPath}
                alt={`${item.name} cover`}
                imageRendering="pixelated"
              />

              <Text
                flex={1}
                minWidth={0}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                textAlign="left"
              >
                {item.name}
              </Text>
            </Button>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default MusicApp;
