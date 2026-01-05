// Optimized Framer Motion animation variants for better performance
export const headContainerAnimation = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: {
    type: "spring",
    duration: 1.2, // Reduced from 1.8s
    delay: 0.3, // Reduced from 0.5s
    stiffness: 100,
    damping: 15,
  },
};

export const headTextAnimation = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: {
    type: "spring",
    duration: 1.4, // Reduced from 2s
    delay: 0.4, // Reduced from 0.7s
    stiffness: 100,
    damping: 15,
  },
};

export const headContentAnimation = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    type: "spring",
    duration: 1.2, // Reduced from 1.8s
    delay: 0.5, // Reduced from 0.8s
    stiffness: 100,
    damping: 15,
  },
};

export const slideAnimation = (direction) => {
  return {
    initial: {
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.5,
      },
    },
    exit: {
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
      transition: {
        type: "spring",
        duration: 1,
      },
    },
  };
};

export const fadeAnimation = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
