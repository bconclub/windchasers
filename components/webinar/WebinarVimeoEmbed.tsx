"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  vimeoId: string;
  title?: string;
};

export default function WebinarVimeoEmbed({
  vimeoId,
  title = "Webinar preview video",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const id = parseInt(vimeoId.replace(/\D/g, ""), 10);
    if (Number.isNaN(id)) return;

    const player = new Player(el, {
      id,
      /* We size the wrapper to 9:16; responsive mode assumes 16:9 and adds pillarboxing. */
      responsive: false,
      background: true,
      autoplay: true,
      muted: true,
      loop: true,
      controls: false,
      title: false,
      byline: false,
      portrait: false,
      vimeo_logo: false,
      unmute_button: false,
      autopause: false,
      dnt: true,
    });

    playerRef.current = player;

    const onVolumeChange = (data: { muted: boolean }) => {
      setMuted(data.muted);
    };

    player.on("volumechange", onVolumeChange);

    player
      .ready()
      .then(() => player.setMuted(true))
      .then(() => player.play())
      .catch(() => {})
      .finally(() => {
        setReady(true);
        player.getMuted().then(setMuted).catch(() => {});
      });

    return () => {
      player.off("volumechange", onVolumeChange);
      void player.destroy();
      playerRef.current = null;
    };
  }, [vimeoId]);

  const toggleMute = useCallback(async () => {
    const player = playerRef.current;
    if (!player || !ready) return;
    const current = await player.getMuted();
    await player.setMuted(!current);
    setMuted(!current);
  }, [ready]);

  return (
    <div className="relative h-full w-full min-h-0">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:pointer-events-none [&_iframe]:border-0"
        aria-label={title}
      />
      <button
        type="button"
        onClick={toggleMute}
        disabled={!ready}
        className="absolute bottom-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75 disabled:opacity-50"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? (
          <VolumeX className="h-5 w-5" aria-hidden />
        ) : (
          <Volume2 className="h-5 w-5" aria-hidden />
        )}
      </button>
    </div>
  );
}
