import React from 'react';

export type RevealVariant = 'up' | 'fade' | 'left' | 'right' | 'scale' | 'line';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to a div. */
  as?: React.ElementType;
  /** Entrance style. See styles/reveal.css. */
  variant?: RevealVariant;
  /** Delay in ms before this element animates. */
  delay?: number;
  /**
   * Staggers direct children that carry `data-reveal`. Pass a number to set the
   * gap in ms, or `true` for the 90ms default.
   */
  stagger?: number | boolean;
  children?: React.ReactNode;
}

/**
 * Declarative wrapper for the global reveal system.
 *
 * Equivalent to putting `data-reveal` on an element directly — the shared
 * observer in hooks/useReveal.ts picks up either form. Use this when it reads
 * better than a bare attribute, and the attribute when you'd otherwise add a
 * wrapper element just to hold it.
 *
 * Keep it off interactive elements and off ancestors of anything
 * `position: fixed` or `sticky`; reveal.css explains why.
 */
export const Reveal: React.FC<RevealProps> = ({
  as: Tag = 'div',
  variant = 'up',
  delay,
  stagger,
  children,
  ...rest
}) => (
  <Tag
    data-reveal={variant}
    data-reveal-delay={delay}
    data-reveal-stagger={
      stagger === true ? 90 : typeof stagger === 'number' ? stagger : undefined
    }
    {...rest}
  >
    {children}
  </Tag>
);
