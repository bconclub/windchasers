"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  /** Public path to the video file, e.g. "/webinar/webinar-promo.mp4". */
  src: string;
  poster?: string;
  title?: string;
};

/**
 * Native <video> promo — autoplaying, muted, looping background clip with a
 * tap-to-unmute toggle. Replaces the Vimeo embed for a self-hosted MP4 (no
 * third-party player, no pillarboxing — the wrapper sets the aspect).
 */
export default function WebinarVideoEmbed({ src, poster, title = "Webinar preview video" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) {
      // Unmuting: make sure it's playing (autoplay policies pause unmuted starts).
      void v.play().catch(() => {});
    }
    setMuted(next);
  };

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm ring-1 ring-white/20 transition-colors hover:bg-black/75"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </>
  );
}
