import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import PageTransition from "../../components/PageTransition/PageTransition";
import CustomArrow from "../../components/Icons/CustomArrow";
import { thingsData } from "../../components/data/thingsData";
import "./FewThings.css";

gsap.registerPlugin(ScrollTrigger);

export default function FewThings() {
  const containerRef = useRef(null);

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
            {thingsData.items.map((item, index) => (
              <article key={item.id} className="thing-card interactive">
                <div className="thing-image-wrapper">
                  {/* The actual image tag will replace this div eventually */}
                  <div className="thing-image bg-placeholder"></div>
                </div>

                <div className="thing-content">
                  <div className="thing-header">
                    <span className="thing-number font-sans">{item.id}</span>
                    <h2 className="thing-title font-serif">{item.title}</h2>
                  </div>

                  <div className="thing-body">
                    <p className="thing-desc font-sans">{item.description}</p>
                    <div className="thing-arrow">
                      <CustomArrow />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
