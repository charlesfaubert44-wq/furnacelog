/**
 * Animation utilities for Territorial Homestead design system
 * Organic, warm, purposeful animations
 */

export const fadeSlideUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleInVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideDownVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Easing curves for warm, organic motion
export const easings = {
  smooth: [0.16, 1, 0.3, 1], // cubic-bezier for smooth, organic motion
  bounce: [0.34, 1.56, 0.64, 1], // subtle bounce for playful interactions
  springy: [0.68, -0.55, 0.265, 1.55], // spring-like motion
  easeOut: [0.4, 0, 0.2, 1], // standard ease-out
};

// Transition configurations
export const transitions = {
  fast: { duration: 0.2, ease: easings.easeOut },
  normal: { duration: 0.3, ease: easings.smooth },
  slow: { duration: 0.6, ease: easings.smooth },
  bounce: { duration: 0.4, ease: easings.bounce },
};

// Stagger configurations for list animations
export const staggerConfig = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  item: fadeSlideUpVariants,
};

// Page transition variants
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
};

// Modal/Dialog variants
export const modalVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: easings.smooth,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: easings.easeOut,
      },
    },
  },
};

// Dropdown menu variants
export const dropdownVariants = {
  container: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: easings.smooth,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: easings.easeOut,
      },
    },
  },
  item: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  },
};

// Helper to get stagger delay class
export const getStaggerDelay = (index: number): string => {
  const delayMs = index * 100;
  if (delayMs > 600) return 'animate-delay-600';
  return `animate-delay-${delayMs}`;
};

// Helper for conditional animations based on reduced motion preference
export const getAnimationClass = (animationClass: string): string => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return '';
  }
  return animationClass;
};
