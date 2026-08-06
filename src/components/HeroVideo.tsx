"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { mediaByCategory, mediaUrl } from "@/lib/media";

// First listing video in the manifest — follows wherever the media lives.
const hero = mediaByCategory("landscape").find((item) => item.type === "video");
const VIDEO_SRC = hero ? mediaUrl(hero.src) : null;
const POSTER_SRC = "/media/listings/listing-01.png";

export default function HeroVideo() {
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setVideoReady(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Poster image — visible until video plays */}
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-1000 ${
          videoReady ? "opacity-0" : "opacity-100"
        } scale-[1.03] animate-[heroZoom_24s_ease-in-out_infinite]`}
        aria-hidden
      />

      {/* Background video */}
      {videoReady && VIDEO_SRC && (
        <video
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover scale-[1.03] animate-[heroZoom_24s_ease-in-out_infinite]"
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
