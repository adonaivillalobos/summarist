import { useEffect, useState } from "react";

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "--:--";
  }
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export default function useAudioDuration(src: string | undefined) {
  const [state, setState] = useState<{ src: string; duration: number } | null>(
    null,
  );

  useEffect(() => {
    if (!src) {
      return;
    }
    const audio = new Audio();
    audio.preload = "metadata";
    const onLoaded = () => setState({ src, duration: audio.duration });
    const onError = () => setState({ src, duration: NaN });
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
    audio.src = src;
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
      audio.src = "";
    };
  }, [src]);

  return src && state && state.src === src ? state.duration : null;
}