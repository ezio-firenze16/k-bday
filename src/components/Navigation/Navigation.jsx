import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "@phosphor-icons/react";
import gsap from "gsap";
import { useTheme } from "../../hooks/useTheme";
import "./Navigation.css";

export default function Navigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Mobile Menu State
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuOverlayRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const timelineRef = useRef(null);

  const links = [
    { path: "/", label: "Home" },
    { path: "/letters", label: "Letters" },
    { path: "/memories", label: "Memories" },
    { path: "/a-few-things", label: "A Few Things" },
    { path: "/playlist", label: "Playlist" },
    { path: "/just-for-you", label: "Just For You" },
  ];

  // Initialize GSAP Timeline for the mobile menu overlay
  useEffect(() => {
    timelineRef.current = gsap.timeline({ paused: true });

    timelineRef.current
      .to(menuOverlayRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
      })
      .fromTo(
        mobileLinksRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      );

    return () => timelineRef.current.kill();
  }, []);

  // Play/Reverse animation based on state
  useEffect(() => {
    if (isMobileOpen) {
      timelineRef.current.play();
      // Prevent scrolling on the body while menu is open
      document.body.style.overflow = "hidden";
    } else {
      timelineRef.current.reverse();
      document.body.style.overflow = "";
    }
  }, [isMobileOpen]);

  // Close mobile menu automatically when a link is clicked / route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="global-nav">
        <div className="nav-container">
          {/* Theme Toggle Left */}
          <div className="nav-theme-toggle">
            <button
              className="theme-btn interactive"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={20} weight="light" />
              ) : (
                <Moon size={20} weight="light" />
              )}
            </button>
          </div>

          {/* Desktop Links (Hidden on Mobile) */}
          <ul className="nav-list desktop-only">
            {links.map((link) => (
              <li key={link.path} className="nav-item">
                <Link
                  to={link.path}
                  className={`nav-link font-sans ${location.pathname === link.path ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Custom Toggle Button (Hidden on Desktop) */}
          <button
            className="mobile-menu-toggle interactive mobile-only"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`menu-line ${isMobileOpen ? "open" : ""}`}></div>
            <div className={`menu-line ${isMobileOpen ? "open" : ""}`}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className="mobile-menu-overlay" ref={menuOverlayRef}>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-list">
            {links.map((link, i) => (
              <li
                key={link.path}
                className="mobile-nav-item"
                ref={(el) => (mobileLinksRef.current[i] = el)}
              >
                <Link
                  to={link.path}
                  className={`mobile-nav-link font-serif ${location.pathname === link.path ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
