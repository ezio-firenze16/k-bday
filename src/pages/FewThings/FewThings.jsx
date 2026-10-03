import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { X } from "@phosphor-icons/react";
import PageTransition from "../../components/PageTransition/PageTransition";
import CustomArrow from "../../components/Icons/CustomArrow";
import { thingsData } from "../../components/data/thingsData";
import "./FewThings.css";

gsap.registerPlugin(ScrollTrigger);

export default function FewThings() {
  const containerRef = useRef(null);

  // State to track which card is currently clicked open
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo(
        ".things-hero-content > *",
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

      // Editorial Grid Reveal
      gsap.utils.toArray(".thing-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
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

  // Lock body scroll when modal is open
  // Lock body & html scroll when modal is open (Fixes mobile Safari/Chrome bug)
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedItem]);

  return (
    <PageTransition>
      <div className="things-page" ref={containerRef}>
        <header className="things-hero">
          <div className="things-hero-content">
            <span className="section-label font-sans">
              {thingsData.hero.subtitle}
            </span>
            <h1 className="text-hero font-serif">{thingsData.hero.title}</h1>
            <p className="text-body font-sans things-desc">
              {thingsData.hero.description}
            </p>
          </div>
        </header>

        <section className="things-grid-section">
          <div className="things-editorial-grid">
            {thingsData.items.map((item) => (
              <article
                key={item.id}
                className="thing-card interactive"
                onClick={() => setSelectedItem(item)}
              >
                <div className="thing-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="thing-image"
                  />
                </div>

                <div className="thing-content">
                  <div className="thing-header">
                    <span className="thing-number font-sans">{item.id}</span>
                    <h2 className="thing-title font-serif">{item.title}</h2>
                  </div>

                  <div className="thing-body">
                    {/* Text is now truncated via CSS */}
                    <p className="thing-desc font-sans">{item.description}</p>

                    <div className="thing-action-row">
                      <span className="click-text font-script">
                        Click to open
                      </span>
                      <div className="thing-arrow">
                        <CustomArrow />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* POPUP MODAL */}
      {createPortal(
        <div className={`thing-modal ${selectedItem ? "open" : ""}`}>
          <div
            className="thing-modal-overlay"
            onClick={() => setSelectedItem(null)}
          ></div>

          <div className="thing-modal-content">
            <button
              className="close-modal-btn interactive"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} weight="bold" />
            </button>

            {selectedItem && (
              <div className="modal-inner">
                <div className="modal-image-wrapper">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.imageAlt}
                    className="modal-image"
                  />
                </div>
                <div className="modal-text-wrapper">
                  <span className="thing-number font-sans">
                    {selectedItem.id}
                  </span>
                  <h2 className="modal-title font-serif">
                    {selectedItem.title}
                  </h2>
                  <p className="modal-desc font-sans">
                    {selectedItem.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </PageTransition>
  );
}
