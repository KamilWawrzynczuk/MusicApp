import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react';
import ReactHowler from 'react-howler';
import { useEffect, useRef, useState } from 'react';
import { useStoreActions } from 'easy-peasy';
import {
  MdShuffle,
  MdPrevious,
  MdSkipNext,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
  MdSkipPrevious,
} from 'react-icons/md';
import { formatTime } from '../lib/formatters';

const Player = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(
    songs.findIndex((song) => song.id === activeSong.id)
  );
  const [seek, setSeek] = useState(0.0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const [isSeeking, setIsSeeking] = useState(false);
  const soundRef = useRef(null);
  const repeatRef = useRef(repeat);
  const changeActiveSong = useStoreActions(
    (state: any) => state.changeActiveSong
  );

  useEffect(() => {
    let timerId;

    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek());
        timerId = requestAnimationFrame(f);
      };

      timerId = requestAnimationFrame(f);
      return () => {
        cancelAnimationFrame(timerId);
      };
    }
    cancelAnimationFrame(timerId);
  }, [playing, isSeeking]);

  useEffect(() => {
    changeActiveSong(songs[index]);
  }, [index, changeActiveSong, songs]);

  useEffect(()=>{
    repeatRef.current = repeat;
  },[repeat])

  const setPlayState = (value) => {
    setPlaying(value);
  };
  const onShuffle = () => {
    setShuffle((state) => !state);
  };

  const onRepeat = () => {
    setRepeat((state) => !state);
  };

  const prevSong = () => {
    setIndex((state) => {
      return state ? state - 1 : songs.length - 1;
    });
  };

  const nextSong = () => {
    setIndex((state) => {
      if (shuffle) {
        const next = Math.floor(Math.random() * songs.length);
        if (next === state) {
          return nextSong();
        }
        return next;
      }
      return state === songs.length - 1 ? 0 : state + 1;
    });
  };

  const onEnd = () => {
   
    if (repeatRef.current) {
  
      setSeek(0);
      soundRef.current.seek(0);
    } else {
      nextSong();
    }
  };

  const onLoad = () => {
    const songDuration = soundRef.current.duration();
    setDuration(songDuration);
  };

  const onSeek = (event) => {
    setSeek(parseFloat(event[0]));
    soundRef.current.seek(event[0]);
  };

  return (
    <Box>
      <Box>
        <ReactHowler
          playing={playing}
          src={activeSong?.url}
          ref={soundRef}
          onLoad={onLoad}
          onEnd={onEnd}
        />
      </Box>
      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            aria-label="shuffle"
            fontSize="24px"
            icon={<MdShuffle />}
            outline="none"
            variant="link"
            color={shuffle ? 'white' : 'gray.600'}
            onClick={onShuffle}
          />
          <IconButton
            aria-label="skip"
            fontSize="24px"
            icon={<MdSkipPrevious />}
            outline="none"
            variant="link"
            onClick={prevSong}
          />
          {playing ? (
            <IconButton
              aria-label="pause"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePauseCircleFilled />}
              outline="none"
              variant="link"
              onClick={() => setPlayState(false)}
            />
          ) : (
            <IconButton
              aria-label="play"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePlayCircleFilled />}
              outline="none"
              variant="link"
              onClick={() => setPlayState(true)}
            />
          )}
          <IconButton
            aria-label="next"
            fontSize="24px"
            icon={<MdSkipNext />}
            outline="none"
            variant="link"
            onClick={nextSong}
          />
          <IconButton
            aria-label="repeat"
            fontSize="24px"
            icon={<MdOutlineRepeat />}
            outline="none"
            variant="link"
            color={repeat ? 'white' : 'gray.600'}
            onClick={onRepeat}
          />
        </ButtonGroup>
      </Center>
      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs" textAlign="left">
              {formatTime(seek)}
            </Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              aria-label={['min', 'max']}
              step={0.1}
              min={0}
              id="player-range-slider"
              max={duration ? duration.toFixed(2) : 0}
              onChange={onSeek}
              value={[seek]}
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="10%">
            <Text fontSize="xs" textAlign="right">
              {formatTime(duration)}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Player;
