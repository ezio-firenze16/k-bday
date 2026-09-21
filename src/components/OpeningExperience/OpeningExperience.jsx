import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./OpeningExperience.css";

export default function OpeningExperience({ onComplete }) {
  const containerRef = useRef(null);
  const lightRef = useRef(null);
  const lineRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      },
    });

    // Initial state setup
    gsap.set(titleRef.current, { opacity: 0, y: 30, filter: "blur(10px)" });
    gsap.set(subtitleRef.current, {
      opacity: 0,
      y: 10,
      clipPath: "inset(0 100% 0 0)",
    });
    gsap.set(lightRef.current, { opacity: 0, scale: 0.8 });
    gsap.set(lineRef.current, { strokeDasharray: 200, strokeDashoffset: 200 });

    tl.to(
      lightRef.current,
      {
        opacity: 0.15,
        scale: 1,
        duration: 3,
        ease: "power2.out",
      },
      0.5,
    )

      .to(
        lineRef.current,
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power3.inOut",
        },
        1.5,
      )

      .to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 2,
          ease: "power3.out",
        },
        2,
      )

      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "power2.out",
        },
        3,
      )

      // Hold the composition
      .to({}, { duration: 2 })

      // Gentle fade out sequence before unmounting
      .to(
        [
          subtitleRef.current,
          titleRef.current,
          lineRef.current,
          lightRef.current,
        ],
        {
          opacity: 0,
          y: -15,
          filter: "blur(5px)",
          stagger: 0.1,
          duration: 1.2,
          ease: "power2.inOut",
        },
      );

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="opening-container" ref={containerRef}>
      <div className="opening-light" ref={lightRef}></div>

      <div className="opening-content">
        <svg
          className="opening-line"
          width="120"
          height="40"
          viewBox="0 0 120 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={lineRef}
            d="M5 35 C 30 5, 80 5, 115 35"
            stroke="var(--accent-soft)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <h1 className="opening-title font-serif" ref={titleRef}>
          For you.
        </h1>
        <p className="opening-subtitle font-serif" ref={subtitleRef}>
          just a little something.
        </p>
      </div>
    </div>
  );
}
