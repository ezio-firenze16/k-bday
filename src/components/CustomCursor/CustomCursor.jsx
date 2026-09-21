import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./CustomCursor.css";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // Only run on devices with a fine pointer (desktop)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const xToCursor = gsap.quickTo(cursor, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const yToCursor = gsap.quickTo(cursor, "y", {
      duration: 0.1,
      ease: "power3",
    });

    const xToFollower = gsap.quickTo(follower, "x", {
      duration: 0.6,
      ease: "power3",
    });
    const yToFollower = gsap.quickTo(follower, "y", {
      duration: 0.6,
      ease: "power3",
    });

    const onMouseMove = (e) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    const onMouseEnter = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.3 });
      gsap.to(follower, { scale: 1.5, opacity: 0.1, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, opacity: 0.3, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Attach hover effects to interactive elements dynamically
    const interactiveElements = document.querySelectorAll(
      "a, button, .interactive",
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="custom-cursor-follower" ref={followerRef}></div>
      <div className="custom-cursor-dot" ref={cursorRef}></div>
    </>
  );
}
