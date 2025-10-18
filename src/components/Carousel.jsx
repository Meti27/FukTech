import { useEffect, useRef, useState } from "react";

export default function Carousel({ slides = [], interval = 5000, full = false }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const count = Array.isArray(slides) ? slides.length : 0;

  // Clamp index if slides change
  useEffect(() => {
    if (count === 0) setIndex(0);
    else if (index > count - 1) setIndex(0);
  }, [count, index]);

  // Autoplay
  useEffect(() => {
    if (count <= 1) return; // no autoplay if 0/1 slide
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count, interval]);

  function start() {
    stop();
    if (count <= 1) return;
    timer.current = setTimeout(() => setIndex((i) => (i + 1) % count), interval);
  }
  function stop() {
    if (timer.current) clearTimeout(timer.current);
  }

  // Pause when tab hidden (saves battery, avoids weird jumps)
  useEffect(() => {
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, interval]);

  // Touch swipe (doesn't block vertical scroll)
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    stop();
  }
  function onTouchMove(e) {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }
  function onTouchEnd() {
    const SWIPE = 50;
    if (touchDeltaX.current > SWIPE) prev();
    else if (touchDeltaX.current < -SWIPE) next();
    start();
  }

  function prev() {
    if (count === 0) return;
    setIndex((i) => (i - 1 + count) % count);
  }
  function next() {
    if (count === 0) return;
    setIndex((i) => (i + 1) % count);
  }

  // Responsive height:
  // - Phones: ~60% svh, min 280px (safe thumb-reach)
  // - md+: viewport minus navbar (64px), with max 820px
  const heightClass = full
    ? "h-[60svh] min-h-[280px] md:h-[calc(100vh-64px)] md:min-h-[420px] md:max-h-[820px]"
    : "h-[320px] sm:h-[360px] md:h-[460px]";

  if (count === 0) {
    // Graceful empty state (keeps layout from collapsing)
    return (
      <div className={`relative w-full overflow-hidden ${full ? "" : "rounded-2xl border"} ${heightClass}`}>
        <div className="grid place-items-center w-full h-full text-gray-500 text-sm">No slides</div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${full ? "" : "rounded-2xl border"}`}
      onMouseEnter={stop}
      onMouseLeave={start}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      // Allow vertical scroll while enabling horizontal pan for swipe
      className2="touch-pan-y" // (kept for clarity; Tailwind: add `touch-pan-y` below)
      aria-roledescription="carousel"
      aria-label="Image carousel"
      // Keyboard navigation
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
    >
      <div
        className={`flex transition-transform duration-700 ease-out ${heightClass} touch-pan-y`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="relative w-full shrink-0">
            <div className={`relative w-full ${heightClass}`}>
              <img
                src={s.src}
                alt={s.alt || s.title || `Slide ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              {(s.title || s.text) && (
                <div className="absolute bottom-6 left-6 right-6 md:left-12 md:max-w-xl text-white drop-shadow">
                  {s.title && (
                    <h3 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
                      {s.title}
                    </h3>
                  )}
                  {s.text && (
                    <p className="mt-2 text-sm sm:text-base md:text-lg opacity-95">{s.text}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* controls */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            ›
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
