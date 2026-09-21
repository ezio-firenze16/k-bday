import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Sparkle,
  MusicNotes,
} from "@phosphor-icons/react";
import PageTransition from "../../components/PageTransition/PageTransition";
import { playlistData } from "../../components/data/playlistData";
// 2. Import the CustomHeart we built earlier
import CustomHeart from "../../components/Icons/CustomHeart";
import "./Playlist.css";

gsap.registerPlugin(ScrollTrigger);

export default function Playlist() {
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [favorites, setFavorites] = useState(["01", "03"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".playlist-hero-content > *",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      gsap.fromTo(
        ".track-row",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tracklist-container", start: "top 85%" },
        },
      );

      // Animate decorations in softly
      gsap.fromTo(
        ".decor-item",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.5,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const togglePlay = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play prevented/missing file"));
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleSkip = (direction) => {
    if (!currentTrack) return;

    const currentIndex = playlistData.tracks.findIndex(
      (t) => t.id === currentTrack.id,
    );
    let newIndex = currentIndex + direction;

    if (newIndex >= playlistData.tracks.length) newIndex = 0;
    if (newIndex < 0) newIndex = playlistData.tracks.length - 1;

    setCurrentTrack(playlistData.tracks[newIndex]);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error(
          "Browser blocked playback or file missing:",
          error.message,
        );
      });
    }
  }, [currentTrack]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const current = audio.currentTime;
    const duration = audio.duration || 0;
    const progressPercent = duration > 0 ? (current / duration) * 100 : 0;

    setProgress(progressPercent);
    setCurrentTime(formatTime(current));
  };

  const handleScrub = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const scrubTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = scrubTime;
    setProgress(e.target.value);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleFavorite = (e, trackId) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId],
    );
  };

  return (
    <PageTransition>
      <div className="playlist-page" ref={containerRef}>
        <audio
          ref={audioRef}
          src={currentTrack?.src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => handleSkip(1)}
        />

        <header className="playlist-hero">
          <div className="playlist-hero-content">
            <span className="section-label font-sans">
              {playlistData.hero.subtitle}
            </span>
            <h1 className="text-hero font-serif">{playlistData.hero.title}</h1>
            <p className="text-body font-sans playlist-desc">
              {playlistData.hero.description}
            </p>
          </div>
        </header>

        {/* 3. NEW: Floating Pastel Decorations */}
        <div className="playlist-decorations" aria-hidden="true">
          <div className="decor-item decor-1">
            <CustomHeart />
          </div>
          <div className="decor-item decor-2">
            <Sparkle weight="fill" />
          </div>
          <div className="decor-item decor-3">
            <MusicNotes weight="fill" />
          </div>
          <div className="decor-item decor-4">
            <CustomHeart />
          </div>
          <div className="decor-item decor-5">
            <Sparkle weight="fill" />
          </div>
        </div>

        <section className="tracklist-section">
          <div className="tracklist-container">
            <div className="tracklist-header font-sans">
              <span className="th-num">#</span>
              <span className="th-title">Title</span>
              <span className="th-duration">Time</span>
              <span className="th-fav"></span>
            </div>

            <ul className="track-list">
              {playlistData.tracks.map((track) => {
                const isCurrentlyPlaying =
                  currentTrack?.id === track.id && isPlaying;
                const isFav = favorites.includes(track.id);

                return (
                  <li
                    key={track.id}
                    className={`track-row interactive ${currentTrack?.id === track.id ? "active" : ""}`}
                    onClick={() => togglePlay(track)}
                  >
                    <div className="track-num font-sans">
                      <span className="num-text">{track.id}</span>
                      <div className="num-icon">
                        {isCurrentlyPlaying ? (
                          <Pause weight="fill" />
                        ) : (
                          <Play weight="fill" />
                        )}
                      </div>
                    </div>

                    <div className="track-info">
                      <h3 className="track-title font-serif">{track.title}</h3>
                      <span className="track-artist font-sans">
                        {track.artist}
                      </span>
                    </div>

                    <div className="track-duration font-sans">
                      {track.duration}
                    </div>

                    <div className="track-fav">
                      <button
                        className={`fav-btn ${isFav ? "favorited" : ""} interactive`}
                        onClick={(e) => toggleFavorite(e, track.id)}
                      >
                        <Heart weight={isFav ? "fill" : "regular"} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      {createPortal(
        <div className={`custom-player ${currentTrack ? "visible" : ""}`}>
          <div className="player-controls-wrapper">
            <div className="player-now-playing">
              {currentTrack && (
                <>
                  <div className="np-title font-serif">
                    {currentTrack.title}
                  </div>
                  <div className="np-artist font-sans">
                    {currentTrack.artist}
                  </div>
                </>
              )}
            </div>

            <div className="player-main-controls">
              <button
                className="ctrl-btn interactive"
                onClick={() => handleSkip(-1)}
              >
                <SkipBack weight="fill" />
              </button>

              <button
                className="ctrl-btn play-pause interactive"
                onClick={() => currentTrack && togglePlay(currentTrack)}
              >
                {isPlaying ? (
                  <Pause size={24} weight="fill" />
                ) : (
                  <Play size={24} weight="fill" />
                )}
              </button>

              <button
                className="ctrl-btn interactive"
                onClick={() => handleSkip(1)}
              >
                <SkipForward weight="fill" />
              </button>
            </div>

            <div className="player-time font-sans">
              <span>{currentTime}</span> /{" "}
              <span>{currentTrack?.duration || "0:00"}</span>
            </div>
          </div>

          <div className="player-progress-container">
            <input
              type="range"
              className="player-progress-bar interactive"
              value={progress}
              onChange={handleScrub}
              min="0"
              max="100"
            />
            <div
              className="player-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>,
        document.body,
      )}
    </PageTransition>
  );
}
