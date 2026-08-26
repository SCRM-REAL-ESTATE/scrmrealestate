"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { mediaByCategory, mediaUrl } from "@/lib/media";

/*
 * Two sources, picked by shape of screen. A phone hero is a tall portrait
 * box: filling it with the 16:9 listing video throws away most of the frame
 * and blows the rest up well past its real resolution, which is what made it
 * look soft. The vertical highlight is already the right shape, so on a phone
 * it plays close to one-to-one. Wide screens keep the landscape cut.
 */
const wide = mediaByCategory("landscape").find((item) => item.type === "video");
const tall = mediaByCategory("vertical").find((item) => item.type === "video");

const source = (item?: typeof wide) =>
  item ? { src: mediaUrl(item.src), poster: item.poster ? mediaUrl(item.poster) : undefined } : null;

const WIDE = source(wide);
const TALL = source(tall);
const POSTER_SRC = "/media/listings/listing-01.png";

export default function HeroVideo() {
  const [mounted, setMounted] = useState(false);
  const [portrait, setPortrait] = useState<boolean | null>(null);
  /**
   * Only true once the video has actually put a frame on screen. The still
   * used to be faded out on mount, so a video that was slow, stalled or
   * failed left the hero empty and then filled back in, which read as the
   * page flickering. Latched, so a moment of buffering mid playback doesn't
   * pulse the still back in.
   */
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setPortrait(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const clip = portrait === null ? null : (portrait ? TALL : WIDE) ?? WIDE;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Still frame. Holds the hero until the video is genuinely running. */}
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`hero-media object-cover transition-opacity duration-1000 ${
          playing ? "opacity-0" : "opacity-100"
        } scale-[1.03] animate-[heroZoom_24s_ease-in-out_infinite]`}
        aria-hidden
      />

      {/* Background video */}
      {mounted && clip && (
        <video
          key={clip.src}
          src={clip.src}
          poster={clip.poster ?? POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
          className={`hero-media absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            playing ? "opacity-100" : "opacity-0"
          } scale-[1.03] animate-[heroZoom_24s_ease-in-out_infinite]`}
          aria-hidden
        />
      )}

      {/* Editorial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-re-ink/35 via-re-ink/55 to-re-ink/90" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}
