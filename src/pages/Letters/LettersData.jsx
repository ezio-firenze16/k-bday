import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { X } from "@phosphor-icons/react";
import PageTransition from "../../components/PageTransition/PageTransition";
import { lettersData } from "../../components/data/lettersData";
import "./Letters.css";

gsap.registerPlugin(ScrollTrigger);

export default function Letters() {
  const containerRef = useRef(null);
  const [activeLetter, setActiveLetter] = useState(null);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Initial Page Entrance & Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.fromTo(
        ".letters-hero-content > *",
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

      // Card Scroll Reveal
      gsap.utils.toArray(".letter-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle Opening a Letter
  const openLetter = (letter) => {
    setActiveLetter(letter);

    // Slight delay to allow React to render the modal DOM elements
    setTimeout(() => {
      // Sweep in the background overlay
      gsap.fromTo(
        modalRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.inOut" },
      );

      // Fade and slide up the text content
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0, filter: "blur(5px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          delay: 0.6,
          ease: "power3.out",
        },
      );
    }, 50);
  };

  // Handle Closing a Letter
  const closeLetter = () => {
    // Fade out text first
    gsap.to(contentRef.current, {
      y: -20,
      opacity: 0,
      filter: "blur(5px)",
      duration: 0.4,
    });

    // Sweep out the background
    gsap.to(modalRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.8,
      ease: "expo.inOut",
      delay: 0.2,
      onComplete: () => setActiveLetter(null),
    });
  };

  return (
    <PageTransition>
      <div className="letters-page" ref={containerRef}>
        <header className="letters-hero">
          <div className="letters-hero-content">
            <span className="section-label font-sans">
              {lettersData.hero.subtitle}
            </span>
            <h1 className="text-hero font-serif">{lettersData.hero.title}</h1>
            <p className="text-body font-sans letters-desc">
              {lettersData.hero.description}
            </p>
          </div>
        </header>

        <section className="letters-grid-section">
          <div className="letters-grid">
            {lettersData.collection.map((letter) => (
              <article
                key={letter.id}
                className="letter-card interactive"
                onClick={() => openLetter(letter)}
              >
                <div className="card-header">
                  <span className="card-date font-sans">{letter.date}</span>
                  <span className="card-category font-script">
                    {letter.category}
                  </span>
                </div>
                <h3 className="card-title font-serif">{letter.title}</h3>
                <p className="card-excerpt font-sans">{letter.excerpt}</p>
                <div className="card-footer">
                  <span className="read-more font-sans">Read full letter</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* READING MODAL */}
        {activeLetter && (
          <div
            className="letter-reader-modal"
            ref={modalRef}
            data-lenis-prevent="true" /* Prevents Lenis from scrolling the body behind the modal */
          >
            <button
              className="close-modal-btn interactive"
              onClick={closeLetter}
            >
              <X size={28} weight="light" />
            </button>

            <div className="reader-content-wrapper" ref={contentRef}>
              <div className="reader-header">
                <span className="reader-date font-sans">
                  {activeLetter.date}
                </span>
                <h2 className="reader-title font-serif">
                  {activeLetter.title}
                </h2>
              </div>

              <div className="reader-body font-serif">
                {activeLetter.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="reader-signature">
                <span className="font-script">Love,</span>
                <span className="font-script signature-name">Kunal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
