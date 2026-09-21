import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";

// Global Components
import CustomCursor from "./components/CustomCursor/CustomCursor";
import FilmGrain from "./components/FilmGrain/FilmGrain";
import OpeningExperience from "./components/OpeningExperience/OpeningExperience";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";
import Navigation from "./components/Navigation/Navigation";

// Pages
import Home from "./pages/Home/Home";
import Letters from "./pages/Letters/Letters";
import Memories from "./pages/Memories/Memories";
import FewThings from "./pages/FewThings/FewThings";
import Playlist from "./pages/Playlist/Playlist";
import JustForYou from "./pages/JustForYou/JustForYou";

function App() {
  // Initialize state to false so the intro plays on every single reload
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    // Only update React state, remove the sessionStorage entirely
    setIntroComplete(true);
  };

  return (
    <ThemeProvider>
      <CustomCursor />
      <FilmGrain />

      {!introComplete && <OpeningExperience onComplete={handleIntroComplete} />}

      {introComplete && (
        <Router>
          <SmoothScroll>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/letters" element={<Letters />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/a-few-things" element={<FewThings />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/just-for-you" element={<JustForYou />} />
            </Routes>
          </SmoothScroll>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
