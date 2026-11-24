import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Gift,
  Heart,
  Mail,
  Menu,
  Music2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const photos = [
  { src: "/images/photo-1.jpg", caption: "Your brightest smile" },
  { src: "/images/photo-2.jpg", caption: "A day to celebrate" },
  { src: "/images/photo-3.jpg", caption: "Blooming with joy" },
  { src: "/images/photo-4.jpg", caption: "Grace in every moment" },
  { src: "/images/photo-5.jpg", caption: "Always shining" },
  { src: "/images/photo-6.jpg", caption: "Warmth and love" },
  { src: "/images/photo-7.jpg", caption: "Festive memories" },
  { src: "/images/photo-8.jpg", caption: "Keep sparkling, Usha" },
];

const tracks = [
  { title: "Tamil Birthday Song 1", file: "/music/tamil-birthday-1.wav" },
  { title: "Tamil Birthday Song 2", file: "/music/tamil-birthday-2.wav" },
  { title: "Your Favourite Melody", file: "/music/favourite-melody.wav" },
];

const navItems = [
  { id: "home", label: "Home" },
  { id: "gallery", label: "Gallery" },
  { id: "wishes", label: "Wishes" },
  { id: "songs", label: "Songs" },
];

const thumbCards = [
  { id: "home", title: "Celebration", subtitle: "Main slider", kind: "hero" },
  { id: "gallery", title: "Photo Slideshow", subtitle: "Memories", kind: "photos" },
  { id: "wishes", title: "Birthday Wishes", subtitle: "From the heart", kind: "wishes" },
  { id: "songs", title: "Birthday Songs", subtitle: "Playlist", kind: "songs" },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function launchConfetti() {
  const end = Date.now() + 2000;
  const colors = ["#ff4fd8", "#ff9ad8", "#ffd98e", "#ffffff", "#c99bff"];
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 65, origin: { x: 0 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 160, spread: 100, startVelocity: 42, origin: { y: 0.62 }, colors });
}

function FloatingDecor() {
  return (
    <div className="decor-layer" aria-hidden="true">
      <span className="fairy-lights" />
      <span className="firework fw-a" />
      <span className="firework fw-b" />
      <span className="firework fw-c" />
      <span className="balloon balloon-a"><i /></span>
      <span className="balloon balloon-b"><i /></span>
      <span className="balloon balloon-c"><i /></span>
      <span className="balloon balloon-d"><i /></span>
      <span className="confetti c1" />
      <span className="confetti c2" />
      <span className="confetti c3" />
      <span className="confetti c4" />
      <span className="confetti c5" />
      <span className="bokeh b1" />
      <span className="bokeh b2" />
      <span className="bokeh b3" />
    </div>
  );
}

function CakeDecor() {
  return (
    <div className="cake-decor" aria-hidden="true">
      <div className="cake">
        <div className="candles"><span /><span /><span /></div>
        <div className="tier top" />
        <div className="tier mid" />
        <div className="tier base" />
        <div className="plate" />
      </div>
    </div>
  );
}

function GiftStack() {
  return (
    <div className="gift-stack" aria-hidden="true">
      <div className="gift gift-lg" />
      <div className="gift gift-sm" />
    </div>
  );
}

function App() {
  const [activeNav, setActiveNav] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.78);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(true);
  const [letterOpen, setLetterOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [needsGesture, setNeedsGesture] = useState(false);
  const audioRef = useRef(null);
  const sliderPausedRef = useRef(false);

  const currentTrack = tracks[trackIndex];
  const currentPhoto = photos[photoIndex];

  const tryPlay = async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      await audio.play();
      setIsPlaying(true);
      setNeedsGesture(false);
      return true;
    } catch {
      setIsPlaying(false);
      setNeedsGesture(true);
      return false;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [isMuted, volume]);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      const ok = await tryPlay();
      if (!ok && !cancelled) setNeedsGesture(true);
    };
    boot();
    const unlock = () => {
      tryPlay();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setNeedsGesture(true);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, trackIndex]);

  useEffect(() => {
    const id = setInterval(() => {
      if (sliderPausedRef.current) return;
      setPhotoIndex((current) => (current + 1) % photos.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGalleryIndex((current) => (current + 1) % photos.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const y = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const el = sections[i];
        if (el && el.offsetTop <= y) {
          setActiveNav(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeTrack = (direction) => {
    setTrackIndex((current) => {
      if (shuffle) {
        let next = current;
        while (next === current && tracks.length > 1) {
          next = Math.floor(Math.random() * tracks.length);
        }
        return next;
      }
      return (current + direction + tracks.length) % tracks.length;
    });
    setIsPlaying(true);
  };

  const nextPhoto = (direction) => {
    setPhotoIndex((current) => (current + direction + photos.length) % photos.length);
  };

  const openLetter = () => {
    setLetterOpen(true);
    launchConfetti();
  };

  const goSection = (id) => {
    setActiveNav(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="page-shell">
      <FloatingDecor />
      <audio
        ref={audioRef}
        src={currentTrack.file}
        preload="auto"
        loop={repeat}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => {
          if (repeat && tracks.length === 1) return;
          changeTrack(1);
        }}
      />

      {needsGesture && (
        <button className="gesture-unlock" onClick={() => tryPlay()} type="button">
          <Music2 size={18} /> Tap to start celebration music
        </button>
      )}

      <header className="topbar">
        <a className="brand" href="#home" onClick={() => goSection("home")}>
          <Gift size={18} />
          <span>Birthday Celebrations</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`} aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeNav === item.id ? "nav-link active" : "nav-link"}
              onClick={(event) => {
                event.preventDefault();
                goSection(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="top-actions">
          <button
            className="play-music-btn"
            onClick={() => (isPlaying ? setIsPlaying(false) : tryPlay())}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? "Pause Music" : "Play Music"}
          </button>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <section
        className="hero"
        id="home"
        onMouseEnter={() => { sliderPausedRef.current = true; }}
        onMouseLeave={() => { sliderPausedRef.current = false; }}
      >
        <button className="slider-arrow left" aria-label="Previous photo" onClick={() => nextPhoto(-1)}>
          <ChevronLeft size={22} />
        </button>

        <div className="hero-grid">
          <div className="polaroid-wrap">
            <div className="polaroid" key={currentPhoto.src}>
              <div className="ribbon" aria-hidden="true" />
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                onError={(event) => {
                  event.currentTarget.src = "/images/photo-placeholder.svg";
                }}
              />
              <p>{currentPhoto.caption}</p>
            </div>
            <GiftStack />
          </div>

          <div className="hero-copy">
            <div className="crown" aria-hidden="true"><Crown size={26} /></div>
            <h1>
              <span className="line-happy">Happy Birthday</span>
              <span className="name-badge">Usha Chandru</span>
            </h1>
            <p className="wish-line">
              May your life be filled with endless happiness, love, success and
              beautiful memories always!
            </p>
            <button className="primary-button" onClick={openLetter}>
              <Mail size={16} /> Open Birthday Wishes
            </button>
            <CakeDecor />
          </div>
        </div>

        <button className="slider-arrow right" aria-label="Next photo" onClick={() => nextPhoto(1)}>
          <ChevronRight size={22} />
        </button>

        <div className="hero-dots">
          {photos.slice(0, 8).map((photo, index) => (
            <button
              key={photo.src}
              aria-label={`Show photo ${index + 1}`}
              className={index === photoIndex ? "dot active" : "dot"}
              onClick={() => setPhotoIndex(index)}
            />
          ))}
        </div>
      </section>

      <section className="thumb-gallery" aria-label="Site sections">
        {thumbCards.map((card) => (
          <button
            key={card.id}
            className={`thumb-card thumb-${card.kind}`}
            onClick={() => goSection(card.id)}
          >
            <div className="thumb-visual">
              {card.kind === "hero" && (
                <img src={photos[0].src} alt="" />
              )}
              {card.kind === "photos" && (
                <div className="mini-polaroids">
                  <img src={photos[1].src} alt="" />
                  <img src={photos[2].src} alt="" />
                </div>
              )}
              {card.kind === "wishes" && (
                <div className="wish-icon"><Mail size={28} /><Heart size={14} fill="currentColor" /></div>
              )}
              {card.kind === "songs" && (
                <div className="song-icon"><Music2 size={28} /><span className="wave" /></div>
              )}
            </div>
            <strong>{card.title}</strong>
            <span>{card.subtitle}</span>
          </button>
        ))}
      </section>

      <section className="gallery-section section-wrap" id="gallery">
        <div className="section-heading">
          <span className="kicker">PHOTO SLIDESHOW</span>
          <h2>Beautiful moments</h2>
          <p>Swipe through memories made just for this celebration.</p>
        </div>
        <div className="gallery-slider">
          <button aria-label="Previous" onClick={() => setGalleryIndex((i) => (i - 1 + photos.length) % photos.length)}>
            <ChevronLeft />
          </button>
          <div className="gallery-frame">
            <img
              key={photos[galleryIndex].src}
              src={photos[galleryIndex].src}
              alt={photos[galleryIndex].caption}
            />
            <span>{photos[galleryIndex].caption}</span>
          </div>
          <button aria-label="Next" onClick={() => setGalleryIndex((i) => (i + 1) % photos.length)}>
            <ChevronRight />
          </button>
        </div>
        <div className="gallery-strip">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              className={index === galleryIndex ? "strip-item active" : "strip-item"}
              onClick={() => setGalleryIndex(index)}
            >
              <img src={photo.src} alt="" />
            </button>
          ))}
        </div>
      </section>

      <section className="wishes-section section-wrap" id="wishes">
        <div className="letter-card">
          <div className="envelope"><Mail size={34} /><Heart size={16} fill="currentColor" /></div>
          <span className="kicker">BIRTHDAY WISHES</span>
          <h2>A note from the heart</h2>
          <p>
            Dear Usha Chandru — may every candle bring a new dream true.
            Thank you for filling our world with warmth and joy.
          </p>
          <button className="primary-button" onClick={openLetter}>
            Read full wishes
          </button>
          <button className="outline-button" onClick={launchConfetti}>
            Celebrate with fireworks
          </button>
        </div>
      </section>

      <section className="songs-section section-wrap" id="songs">
        <div className="section-heading">
          <span className="kicker">BIRTHDAY SONGS</span>
          <h2>Celebration playlist</h2>
          <p>Tamil birthday melodies for your special day.</p>
        </div>
        <div className="songs-card">
          <div className="now-playing">
            <div className="vinyl"><Music2 size={28} /></div>
            <div>
              <strong>{currentTrack.title}</strong>
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
          </div>
          <div className="song-controls">
            <button className={shuffle ? "on" : ""} aria-label="Shuffle" onClick={() => setShuffle((v) => !v)}>
              <Shuffle size={16} />
            </button>
            <button aria-label="Previous track" onClick={() => changeTrack(-1)}><ChevronLeft size={20} /></button>
            <button
              className="play-main"
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={() => (isPlaying ? setIsPlaying(false) : tryPlay())}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button aria-label="Next track" onClick={() => changeTrack(1)}><ChevronRight size={20} /></button>
            <button className={repeat ? "on" : ""} aria-label="Repeat" onClick={() => setRepeat((v) => !v)}>
              <Repeat size={16} />
            </button>
            <button aria-label="Toggle mute" onClick={() => setIsMuted((v) => !v)}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              className="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(event) => {
                const value = Number(event.target.value);
                setVolume(value);
                setIsMuted(value === 0);
              }}
              aria-label="Volume"
            />
          </div>
          <div className="track-list">
            {tracks.map((track, index) => (
              <button
                key={track.file}
                className={index === trackIndex ? "track active" : "track"}
                onClick={() => {
                  setTrackIndex(index);
                  setIsPlaying(true);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {track.title}
                {index === trackIndex && isPlaying && <span className="bars">•••</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Made with love for <strong>Usha Chandru</strong></p>
        <span>Happy Birthday — celebrate every beautiful moment.</span>
      </footer>

      {letterOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setLetterOpen(false)}>
          <article
            className="letter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setLetterOpen(false)} aria-label="Close">×</button>
            <div className="letter-seal"><Heart size={28} fill="currentColor" /></div>
            <span className="kicker">WITH LOVE</span>
            <h2 id="letter-title">Dear Usha Chandru,</h2>
            <p>
              On your special day, may every little thing bring you joy. May your smile grow brighter,
              your dreams grow bigger, and your heart always find reasons to be happy.
            </p>
            <p>
              Thank you for being wonderfully you. Wishing you a beautiful birthday and a year filled
              with love, peace, good health and unforgettable memories.
            </p>
            <div className="letter-signoff">With lots of love</div>
            <button className="primary-button" onClick={() => setLetterOpen(false)}>Close with a smile</button>
          </article>
        </div>
      )}
    </main>
  );
}

export default App;
