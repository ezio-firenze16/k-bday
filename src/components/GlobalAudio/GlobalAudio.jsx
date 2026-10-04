import { useEffect, useRef, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import gsap from "gsap";
import "./GlobalAudio.css";

export default function GlobalAudio({ playTrigger }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasUnlocked = useRef(false);

  // 1. SILENT UNLOCK: Outsmart the browser's autoplay blocker
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current && !hasUnlocked.current) {
        // Start playing the exact moment she clicks anywhere, but keep it silent!
        audioRef.current.volume = 0;
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              hasUnlocked.current = true;
            })
            .catch(() => {
              // Ignore error if it fails
            });
        }
      }
      // Remove listeners so this only happens once
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  // 2. THE REVEAL: Fade the volume up when the Opening Experience ends!
  useEffect(() => {
    if (playTrigger && audioRef.current) {
      if (hasUnlocked.current) {
        // The music is already playing silently, so we just fade it in beautifully
        gsap.to(audioRef.current, {
          volume: 0.4,
          duration: 2.5, // 2.5-second cinematic fade-in
          ease: "power2.inOut",
        });
        setIsPlaying(true);
      } else {
        // Fallback just in case she didn't click
        audioRef.current.volume = 0.4;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Audio blocked:", err));
      }
    }
  }, [playTrigger]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // Kill the GSAP fade-in just in case she clicks pause while it's still fading up
        gsap.killTweensOf(audioRef.current);
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.volume = 0.4;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="global-audio-wrapper">
      <audio ref={audioRef} src="/assets/audio/bg-music.mp3" loop />

      <button
        className="global-audio-btn interactive"
        onClick={togglePlay}
        aria-label="Toggle background music"
      >
        {isPlaying ? (
          <SpeakerHigh size={22} weight="fill" />
        ) : (
          <SpeakerSlash size={22} weight="fill" />
        )}
      </button>
    </div>
  );
}
