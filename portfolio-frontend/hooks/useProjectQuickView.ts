import { useEffect, useRef, useState } from 'react';
import { Project } from '../types';

export type QuickViewPhase = 'closed' | 'measuring' | 'opening' | 'open' | 'closing';

interface RectSnapshot {
  left: number;
  top: number;
  width: number;
  height: number;
}

const OPEN_DURATION_MS = 440;
const CLOSE_DURATION_MS = 320;
const DEFAULT_TRANSFORM = 'translate3d(0, 0, 0) scale(1, 1)';

const readRect = (element: Element | null): RectSnapshot | null => {
  if (!element) return null;

  const rect = element.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
};

const calculateTransform = (source: RectSnapshot, target: RectSnapshot) => {
  const sourceCenterX = source.left + source.width / 2;
  const sourceCenterY = source.top + source.height / 2;
  const targetCenterX = target.left + target.width / 2;
  const targetCenterY = target.top + target.height / 2;

  const translateX = sourceCenterX - targetCenterX;
  const translateY = sourceCenterY - targetCenterY;
  const scaleX = Math.max(source.width / target.width, 0.08);
  const scaleY = Math.max(source.height / target.height, 0.08);

  return `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
};

export const useProjectQuickView = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [phase, setPhase] = useState<QuickViewPhase>('closed');
  const [transform, setTransform] = useState(DEFAULT_TRANSFORM);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [sourceRect, setSourceRect] = useState<RectSnapshot | null>(null);
  const [useSharedTransform, setUseSharedTransform] = useState(false);

  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const sourceElementRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearScheduledWork = () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const finishClose = () => {
    clearScheduledWork();
    setActiveProject(null);
    setPhase('closed');
    setTransform(DEFAULT_TRANSFORM);
    setSourceRect(null);
    sourceElementRef.current = null;

    const restoreTarget = restoreFocusRef.current;
    restoreFocusRef.current = null;
    restoreTarget?.focus();
  };

  const openQuickView = (project: Project, sourceElement: HTMLElement) => {
    clearScheduledWork();
    restoreFocusRef.current = sourceElement;
    sourceElementRef.current = sourceElement;
    setSourceRect(readRect(sourceElement));
    setActiveProject(project);
    setTransform(DEFAULT_TRANSFORM);
    setPhase(prefersReducedMotion || !useSharedTransform ? 'open' : 'measuring');
  };

  const closeQuickView = () => {
    if (!activeProject) return;

    if (prefersReducedMotion || !useSharedTransform || phase === 'measuring') {
      finishClose();
      return;
    }

    const nextSourceRect = readRect(sourceElementRef.current) ?? sourceRect;
    const targetRect = readRect(modalCardRef.current);

    if (!nextSourceRect || !targetRect) {
      finishClose();
      return;
    }

    setTransform(calculateTransform(nextSourceRect, targetRect));
    setPhase('closing');
    closeTimerRef.current = window.setTimeout(finishClose, CLOSE_DURATION_MS);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);

    return () => mediaQuery.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncSharedTransform = () => setUseSharedTransform(mediaQuery.matches);

    syncSharedTransform();
    mediaQuery.addEventListener('change', syncSharedTransform);

    return () => mediaQuery.removeEventListener('change', syncSharedTransform);
  }, []);

  useEffect(() => {
    if (phase !== 'measuring' || !modalCardRef.current) return;

    const nextSourceRect = readRect(sourceElementRef.current) ?? sourceRect;
    const targetRect = readRect(modalCardRef.current);

    if (!nextSourceRect || !targetRect) {
      setPhase('open');
      return;
    }

    setTransform(calculateTransform(nextSourceRect, targetRect));
    animationFrameRef.current = window.requestAnimationFrame(() => {
      setPhase('opening');
    });

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [phase, sourceRect]);

  useEffect(() => {
    if (phase !== 'opening') return;

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setPhase('open');
      });
    });

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [phase]);

  useEffect(() => {
    if (!activeProject) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [activeProject]);

  useEffect(() => {
    if (phase !== 'open') return;

    closeButtonRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (!activeProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeQuickView();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject, phase, prefersReducedMotion, sourceRect]);

  useEffect(() => {
    return () => {
      clearScheduledWork();
    };
  }, []);

  return {
    activeProject,
    closeButtonRef,
    closeQuickView,
    modalCardRef,
    openQuickView,
    phase,
    prefersReducedMotion,
    transform,
    useSharedTransform,
  };
};
