import { Box, Button, Flex, Image, Slider, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { LuPause, LuPlay, LuSkipBack, LuSkipForward } from "react-icons/lu";
import { SONGS, type Song } from "../../consts";

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
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const song: Song | undefined = SONGS[songIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    audio.pause();
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [song]);

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
    <Flex direction="column" gap="14px" color="primary.950">
      <Image
        alignSelf="center"
        boxSize="140px"
        objectFit="cover"
        src={song.coverPath}
        alt={`${song.name} cover`}
        imageRendering="pixelated"
        onError={(event) => {
          event.currentTarget.src = "/sprites/icons/spotify2.png";
        }}
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
      <Flex justifyContent="center" gap="10px">
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
      </Flex>
      {/* <Flex direction="column" gap="4px">
        {SONGS.map((item, index) => (
          <Button
            key={`${item.name}-${item.mp3Path}`}
            justifyContent="flex-start"
            variant={index === songIndex ? "solid" : "outline"}
            onClick={() => selectSong(index)}
          >
            {item.name}
          </Button>
        ))}
      </Flex> */}
    </Flex>
  );
};

export default MusicApp;
