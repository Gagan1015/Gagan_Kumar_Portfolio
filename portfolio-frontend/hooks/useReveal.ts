import { useEffect } from 'react';

/**
 * Global reveal system.
 *
 * One IntersectionObserver serves every `[data-reveal]` element on the page
 * instead of each component spinning up its own, and a MutationObserver picks
 * up nodes that appear later — lazy-loaded route chunks, React Query data
 * landing, filtered lists re-rendering — so components never have to register
 * anything themselves. Tagging markup with `data-reveal` is the whole API.
 *
 * Styling lives in styles/reveal.css.
 */

const REVEAL_SELECTOR = '[data-reveal]';

/** Fires once the element is ~12% into the viewport, so it animates on approach. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px -12% 0px',
  threshold: 0.01,
};

/** Longest transition in reveal.css (transform, 1000ms) plus a safety margin. */
const SETTLE_MS = 1120;

/** Default gap between staggered siblings. */
const DEFAULT_STAGGER_MS = 90;

/** Caps a stagger chain so long lists don't crawl in for several seconds. */
const MAX_STAGGER_STEPS = 8;

let observer: IntersectionObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let consumers = 0;

/** Elements already handed to the observer. WeakSet so detached nodes are collectable. */
const registered = new WeakSet<Element>();
const settleTimers = new WeakMap<Element, number>();

function getDelay(el: HTMLElement): number {
  const explicit = Number(el.dataset.revealDelay);
  return Number.isFinite(explicit) && explicit > 0 ? explicit : 0;
}

/**
 * Resolves the element's delay, either from its own `data-reveal-delay` or from
 * its position among the revealable children of a `data-reveal-stagger` parent.
 */
function applyDelay(el: HTMLElement): number {
  const explicit = getDelay(el);
  if (explicit > 0) {
    el.style.setProperty('--reveal-delay', `${explicit}ms`);
    return explicit;
  }

  const parent = el.parentElement;
  if (!parent || !parent.hasAttribute('data-reveal-stagger')) return 0;

  const step = Number(parent.dataset.revealStagger) || DEFAULT_STAGGER_MS;
  const siblings = Array.from(parent.children).filter((child) =>
    child.hasAttribute('data-reveal')
  );
  const index = siblings.indexOf(el);
  if (index <= 0) return 0;

  const delay = Math.min(index, MAX_STAGGER_STEPS) * step;
  el.style.setProperty('--reveal-delay', `${delay}ms`);
  return delay;
}

/**
 * Marks the reveal complete. This is what drops `filter` back to `none` so a
 * blur(0) doesn't linger as a containing block and compositing layer, and it
 * releases the element's `transition` back to its own CSS.
 *
 * Driven by a timer rather than `transitionend` because that event fires once
 * per property and never fires at all for an element that gets hidden or
 * unmounted mid-animation.
 */
function scheduleSettle(el: Element, delay: number) {
  const existing = settleTimers.get(el);
  if (existing) window.clearTimeout(existing);

  const timer = window.setTimeout(() => {
    el.classList.add('reveal-done');
    settleTimers.delete(el);
  }, delay + SETTLE_MS);

  settleTimers.set(el, timer);
}

function handleIntersect(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;

    const el = entry.target as HTMLElement;
    observer?.unobserve(el);

    const delay = applyDelay(el);
    el.classList.add('is-revealed');
    scheduleSettle(el, delay);
  }
}

function register(el: Element) {
  if (registered.has(el) || !observer) return;
  registered.add(el);
  observer.observe(el);
}

/** Registers `root` itself when it qualifies, plus any descendants. */
function scan(root: ParentNode | Element) {
  if (root instanceof Element && root.hasAttribute('data-reveal')) {
    register(root);
  }
  root.querySelectorAll?.(REVEAL_SELECTOR).forEach(register);
}

function start(): () => void {
  consumers += 1;

  if (observer) return stop;

  const root = document.documentElement;

  // Without IntersectionObserver there's nothing to trigger the reveal, so
  // clear the gate and leave everything in its final state.
  if (!('IntersectionObserver' in window)) {
    root.classList.remove('reveal-enabled');
    return stop;
  }

  observer = new IntersectionObserver(handleIntersect, OBSERVER_OPTIONS);
  scan(document.body);

  mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node as Element);
      }
    }
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Tells the failsafe in index.html that the system is live and it should
  // leave .reveal-enabled in place.
  root.classList.add('reveal-booted');

  return stop;
}

function stop() {
  consumers = Math.max(0, consumers - 1);
  if (consumers > 0) return;

  observer?.disconnect();
  mutationObserver?.disconnect();
  observer = null;
  mutationObserver = null;
  document.documentElement.classList.remove('reveal-booted');
}

/**
 * Mount once, near the root of the app, to enable reveals everywhere.
 */
export function useRevealSystem() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    return start();
  }, []);
}
