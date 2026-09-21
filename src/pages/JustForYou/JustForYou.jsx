import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerSlash,
  CornersOut,
  Sparkle,
} from "@phosphor-icons/react";
import PageTransition from "../../components/PageTransition/PageTransition";
import CustomHeart from "../../components/Icons/CustomHeart";
import { justForYouData } from "../../components/data/justForYouData";
import "./JustForYou.css";

gsap.registerPlugin(ScrollTrigger);

export default function JustForYou() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  let hideControlsTimeout = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo(
        ".jfy-hero-content > *",
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

      // Video & Note Reveal
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      // Floating Decorations Reveal
      gsap.fromTo(
        ".jfy-decor",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.8,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Video Handlers
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setProgress((current / duration) * 100);
  };

  const handleScrub = (e) => {
    e.stopPropagation();
    const scrubTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = scrubTime;
    setProgress(e.target.value);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimeout.current);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  return (
    <PageTransition>
      <div className="jfy-page" ref={containerRef}>
        {/* FULL PAGE FLOATING DECORATIONS */}
        <div className="jfy-decorations" aria-hidden="true">
          <div className="jfy-decor jd-1">
            <CustomHeart />
          </div>
          <div className="jfy-decor jd-2">
            <Sparkle weight="fill" />
          </div>
          <div className="jfy-decor jd-3">
            <CustomHeart />
          </div>
          <div className="jfy-decor jd-4">
            <Sparkle weight="fill" />
          </div>
          <div className="jfy-decor jd-5">
            <CustomHeart />
          </div>
        </div>

        <header className="jfy-hero">
          <div className="jfy-hero-content">
            <span className="section-label font-sans">
              {justForYouData.hero.subtitle}
            </span>
            <h1 className="text-hero font-serif">
              {justForYouData.hero.title}
            </h1>
            <p className="text-body font-sans jfy-desc">
              {justForYouData.hero.description}
            </p>
          </div>
        </header>

        <section className="jfy-video-section reveal-up">
          <div
            className="video-player-container interactive"
            ref={playerContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              className="custom-video"
              src={justForYouData.video.src}
              poster={justForYouData.video.poster}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              playsInline
            />

            <div
              className={`video-controls-overlay ${showControls || !isPlaying ? "visible" : ""}`}
            >
              {!isPlaying && (
                <div className="center-play-btn">
                  <Play weight="fill" />
                </div>
              )}

              <div
                className="bottom-controls-bar"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="v-btn interactive" onClick={togglePlay}>
                  {isPlaying ? <Pause weight="fill" /> : <Play weight="fill" />}
                </button>

                <div className="v-progress-container">
                  <input
                    type="range"
                    className="v-progress-bar interactive"
                    value={progress}
                    onChange={handleScrub}
                  />
                  <div
                    className="v-progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <button className="v-btn interactive" onClick={toggleMute}>
                  {isMuted ? (
                    <SpeakerSlash weight="fill" />
                  ) : (
                    <SpeakerHigh weight="fill" />
                  )}
                </button>
                <button
                  className="v-btn interactive"
                  onClick={toggleFullscreen}
                >
                  <CornersOut weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="jfy-note-section reveal-up">
          <div className="jfy-note-card interactive">
            <h2 className="text-h1 font-serif note-heading">
              {justForYouData.message.heading}
            </h2>
            <div className="note-body font-sans">
              {justForYouData.message.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="note-signature">
              <span className="font-script">Love,</span>
              <span className="signature-name font-script">
                {justForYouData.message.signature}
              </span>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
