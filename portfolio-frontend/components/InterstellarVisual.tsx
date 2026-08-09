import React, { useState, useEffect, useRef } from 'react';

export const InterstellarVisual: React.FC = () => {
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const animFrameRef = useRef<number>(0);

  // Smooth continuous rotation
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setRotationDeg(prev => (prev + delta * 18) % 360);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none overflow-visible"
      aria-label="Interstellar Endurance Spacecraft"
    >
      <img
        src="/interstellar.png"
        alt="Interstellar Endurance Spacecraft"
        className="w-full h-full object-contain pointer-events-none"
        style={{
          transform: `rotate(${rotationDeg}deg) scale(2.2)`,
          willChange: 'transform',
          filter: 'drop-shadow(0 0 30px rgba(150,180,255,0.15))',
        }}
        draggable={false}
      />
    </div>
  );
};
