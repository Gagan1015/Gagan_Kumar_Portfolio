import React, { useState, useEffect, useCallback, useRef } from 'react';

const GREETINGS = [
  { text: 'Hello', lang: 'English' },
  { text: 'Bonjour', lang: 'French' },
  { text: 'Hola', lang: 'Spanish' },
  { text: 'नमस्ते', lang: 'Hindi' },
  { text: 'こんにちは', lang: 'Japanese' },
  { text: '안녕하세요', lang: 'Korean' },
  { text: 'Ciao', lang: 'Italian' },
  { text: 'Olá', lang: 'Portuguese' },
  { text: 'Hallo', lang: 'German' },
  { text: 'مرحبا', lang: 'Arabic' },
  { text: 'สวัสดี', lang: 'Thai' },
  { text: 'Welcome', lang: '' },
];

const GREETING_DURATION = 320; // ms per greeting
const FINAL_HOLD = 600; // ms to hold the last word
const EXIT_DURATION = 900; // ms for the slide-up exit

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'greeting' | 'exit' | 'done'>('greeting');
  const mountedRef = useRef(true);

  // Track mount state to guard against StrictMode double-mount timer leaks
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const startExit = useCallback(() => {
    if (!mountedRef.current) return;
    setPhase('exit');
    setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase('done');
      onComplete();
    }, EXIT_DURATION);
  }, [onComplete]);

  // Cycle through greetings
  useEffect(() => {
    if (phase !== 'greeting') return;

    if (currentIndex >= GREETINGS.length - 1) {
      // Hold the last word, then exit
      const holdTimer = setTimeout(() => {
        if (mountedRef.current) startExit();
      }, FINAL_HOLD);
      return () => clearTimeout(holdTimer);
    }

    // Move to next word
    const nextTimer = setTimeout(() => {
      if (mountedRef.current) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, GREETING_DURATION);

    return () => {
      clearTimeout(nextTimer);
    };
  }, [currentIndex, phase, startExit]);

  // Lock scroll during preloader
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'done') return null;

  const greeting = GREETINGS[currentIndex];
  const isLast = currentIndex === GREETINGS.length - 1;
  const progress = ((currentIndex + 1) / GREETINGS.length) * 100;

  return (
    <div
      className={`preloader-overlay ${phase === 'exit' ? 'preloader-exit' : ''}`}
      aria-live="polite"
      aria-label="Loading"
      role="status"
    >
      {/* Subtle grain texture overlay */}
      <div className="preloader-grain" />

      {/* Progress line at top */}
      <div className="preloader-progress-track">
        <div
          className="preloader-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Center greeting — key forces DOM remount to re-trigger CSS animation */}
      <div className="preloader-content">
        <div key={currentIndex} className="preloader-greeting-wrapper">
          <span
            className={`preloader-greeting ${isLast ? 'preloader-greeting-final' : ''}`}
          >
            {greeting.text}
          </span>

          {/* Language label */}
          {greeting.lang && (
            <span className="preloader-lang">
              {greeting.lang}
            </span>
          )}
        </div>
      </div>

      {/* Bottom counter */}
      <div className="preloader-counter">
        <span className="preloader-counter-current">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <span className="preloader-counter-separator">/</span>
        <span className="preloader-counter-total">
          {String(GREETINGS.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
