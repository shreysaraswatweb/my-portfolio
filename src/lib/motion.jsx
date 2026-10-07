export const easeOut = [0.16, 1, 0.3, 1];

export const cardEntrance = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeOut },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

export const tileTap = {
  whileTap: { scale: 0.97 },
};

export const hoverLift = {
  whileHover: {
    y: -5,
    transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
  },
  whileTap: {
    scale: 0.98,
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
  transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
};

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: easeOut, delay },
});
