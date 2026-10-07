"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { MdForward10, MdReplay10 } from "react-icons/md";
import { formatDuration } from "@/hooks/useAudioDuration";
import type { Book } from "@/types";

interface AudioPlayerProps {
  book: Book;
  onEnded: () => void;
}

export default function AudioPlayer({ book, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const max = duration || audio.duration || 0;
    const next = Math.min(Math.max(audio.currentTime + seconds, 0), max);
    audio.currentTime = next;
    setCurrentTime(next);
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.currentTime = value;
    setCurrentTime(value);
  }

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src={book.audioLink}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          onEnded();
        }}
      />

      <div className="player__info">
        <img className="player__img" src={book.imageLink} alt={book.title} />
        <div className="player__text">
          <div className="player__title">{book.title}</div>
          <div className="player__author">{book.author}</div>
        </div>
      </div>

      <div className="player__controls">
        <button
          className="player__btn"
          onClick={() => skip(-10)}
          aria-label="Back 10 seconds"
        >
          <MdReplay10 />
        </button>
        <button
          className="player__btn player__btn--play"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <BsFillPauseFill /> : <BsFillPlayFill />}
        </button>
        <button
          className="player__btn"
          onClick={() => skip(10)}
          aria-label="Forward 10 seconds"
        >
          <MdForward10 />
        </button>
      </div>

      <div className="player__progress">
        <span className="player__time">{formatDuration(currentTime)}</span>
        <input
          className="player__range"
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          disabled={duration === 0}
          onChange={(event) => seek(Number(event.target.value))}
          style={{
            background: `linear-gradient(to right, #2bd97c ${percent}%, #bac8ce ${percent}%)`,
          }}
        />
        <span className="player__time">
          {duration > 0 ? formatDuration(duration) : "--:--"}
        </span>
      </div>
    </div>
  );
}