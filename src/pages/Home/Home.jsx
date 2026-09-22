import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Sparkle } from "@phosphor-icons/react";
import PageTransition from "../../components/PageTransition/PageTransition";
import CustomArrow from "../../components/Icons/CustomArrow";
import CustomHeart from "../../components/Icons/CustomHeart";
import { homeData } from "../../components/data/homeData";
import "./Home.css";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo(
        ".hero-title-word",
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.5,
        },
      );

      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 1 },
      );

      // Parallax Images
      gsap.utils.toArray(".parallax-img").forEach((img) => {
        gsap.to(img, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Section Reveals
      gsap.utils.toArray(".reveal-section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          },
        );
      });

      // Floating Decorations Reveal
      gsap.fromTo(
        ".h-decor",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          stagger: 0.1,
          ease: "power2.out",
          delay: 1.2,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div className="home-container" ref={containerRef}>
        {/* FULL PAGE FLOATING DECORATIONS */}
        <div className="home-decorations" aria-hidden="true">
          {/* Hero Area */}
          <div className="h-decor hd-1">
            <CustomHeart />
          </div>
          <div className="h-decor hd-2">
            <Sparkle weight="fill" />
          </div>
          <div className="h-decor hd-3">
            <CustomHeart />
          </div>

          {/* Note Section Area */}
          <div className="h-decor hd-4">
            <Sparkle weight="fill" />
          </div>
          <div className="h-decor hd-5">
            <CustomHeart />
          </div>
          <div className="h-decor hd-6">
            <Sparkle weight="fill" />
          </div>

          {/* Directory Area */}
          <div className="h-decor hd-7">
            <CustomHeart />
          </div>
          <div className="h-decor hd-8">
            <Sparkle weight="fill" />
          </div>
          <div className="h-decor hd-9">
            <CustomHeart />
          </div>
        </div>

        {/* HERO SECTION */}
        <section className="home-hero">
          <div className="hero-content">
            <span className="hero-label font-script hero-fade">
              {homeData.hero.label}
            </span>
            <h1 className="text-hero font-serif hero-title">
              <span className="word-wrap">
                <span className="hero-title-word">HAPPY</span>
              </span>
              <br />
              <span className="word-wrap">
                <span className="hero-title-word">BIRTHDAY</span>
              </span>
            </h1>
            <div className="hero-subtext hero-fade">
              <h2 className="text-h2 font-serif">{homeData.hero.subtitle}</h2>
              <p className="text-body font-sans">{homeData.hero.description}</p>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="img-placeholder parallax-container">
              <img
                src="/assets/images/1.jpeg"
                alt="Hero landscape"
                className="parallax-img"
              />
            </div>
          </div>
        </section>

        {/* PERSONAL NOTE SECTION */}
        <section className="home-note reveal-section">
          <div className="note-grid">
            <div className="note-image">
              <div className="polaroid">
                <div className="polaroid-img-wrapper">
                  <img
                    src="/assets/images/2.jpeg"
                    alt="My happy place"
                    className="polaroid-img"
                  />
                </div>
                <div className="polaroid-caption font-script">
                  {homeData.polaroid.caption}{" "}
                  <CustomHeart className="heart-icon" />
                </div>
                <div className="polaroid-tape"></div>
              </div>
            </div>

            <div className="note-text">
              <span className="section-label font-sans">
                {homeData.note.label}
              </span>
              <h2 className="text-h1 font-serif">{homeData.note.heading}</h2>
              <p className="text-body font-sans note-body">
                {homeData.note.body}
              </p>
              <div className="note-signature">
                <span className="text-body font-sans">
                  {homeData.note.signoff}
                </span>
                <span className="signature-name font-script">
                  {homeData.note.signature}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* DIRECTORY SECTION */}
        <section className="home-directory reveal-section">
          <ul className="directory-list">
            {homeData.directory.map((item) => (
              <li key={item.id} className="directory-item-wrapper">
                <Link to={item.link} className="directory-item interactive">
                  <div className="dir-left">
                    <span className="dir-num font-sans">{item.id}</span>
                    <h3 className="dir-title font-serif">{item.title}</h3>
                  </div>
                  <div className="dir-right">
                    <span className="dir-sub font-sans">{item.subtitle}</span>
                    <div className="dir-icon-wrapper">
                      <CustomArrow />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageTransition>
  );
}
