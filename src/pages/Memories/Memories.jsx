import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Sparkle } from "@phosphor-icons/react";
import PageTransition from "../../components/PageTransition/PageTransition";
import CustomHeart from "../../components/Icons/CustomHeart";
import { memoriesData } from "../../components/data/memoriesData";
import "./Memories.css";

gsap.registerPlugin(ScrollTrigger);

export default function Memories() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo(
        ".memories-hero-content > *",
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

      // Timeline Line Drawing
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 50%",
            end: "bottom 80%",
            scrub: true,
          },
        },
      );

      // Memory Cards Reveal
      gsap.utils.toArray(".memory-item").forEach((item, index) => {
        const isLeft = index % 2 === 0;
        const xOffset = isLeft ? -50 : 50;

        gsap.fromTo(
          item,
          { opacity: 0, x: xOffset, y: 50 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
            },
          },
        );

        const img = item.querySelector(".memory-img");
        if (img) {
          gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      // Floating Decorations Reveal
      gsap.fromTo(
        ".m-decor",
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

  return (
    <PageTransition>
      <div className="memories-page" ref={containerRef}>
        {/* FULL PAGE FLOATING DECORATIONS */}
        <div className="memories-decorations" aria-hidden="true">
          <div className="m-decor md-1">
            <CustomHeart />
          </div>
          <div className="m-decor md-2">
            <Sparkle weight="fill" />
          </div>
          <div className="m-decor md-3">
            <CustomHeart />
          </div>
          <div className="m-decor md-4">
            <Sparkle weight="fill" />
          </div>
          <div className="m-decor md-5">
            <CustomHeart />
          </div>
          <div className="m-decor md-6">
            <Sparkle weight="fill" />
          </div>
        </div>

        <header className="memories-hero">
          <div className="memories-hero-content">
            <span className="section-label font-sans">
              {memoriesData.hero.subtitle}
            </span>
            <h1 className="text-hero font-serif">{memoriesData.hero.title}</h1>
            <p className="text-body font-sans memories-desc">
              {memoriesData.hero.description}
            </p>
          </div>
        </header>

        <section className="timeline-section">
          <div className="timeline-container">
            <div className="timeline-line-bg"></div>
            <div className="timeline-line-active" ref={lineRef}></div>

            {memoriesData.timeline.map((memory, index) => (
              <div
                key={memory.id}
                className={`memory-item interactive ${index % 2 === 0 ? "left" : "right"}`}
              >
                <div className="timeline-dot"></div>

                <div className="memory-content">
                  {/* Note: Passing rotation as a CSS variable allows us to override it on hover elegantly */}
                  <div
                    className="memory-polaroid"
                    style={{ "--base-rot": `${memory.rotation}deg` }}
                  >
                    <div className="memory-tape"></div>
                    <div className="memory-img-wrapper parallax-container">
                      <div className="memory-img img-placeholder"></div>
                    </div>
                    <div className="memory-caption font-script">
                      {memory.date}
                    </div>
                  </div>

                  <div className="memory-text">
                    <h3 className="memory-title font-serif">{memory.title}</h3>
                    <p className="memory-desc font-sans">
                      {memory.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
