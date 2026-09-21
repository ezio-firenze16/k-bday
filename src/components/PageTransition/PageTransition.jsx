import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;

    gsap.fromTo(
      el,
      { opacity: 0, y: 15, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
      },
    );
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
