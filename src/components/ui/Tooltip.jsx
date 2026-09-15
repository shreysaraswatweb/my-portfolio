import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  isValidElement,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Isomorphic layout effect for SSR safety
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Utility to merge multiple refs (callback refs and RefObjects)
function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object" && "current" in ref) {
        ref.current = node;
      }
    });
  };
}

// Global state for rapid hover coordination (e.g. moving across button groups)
let globalActiveTooltipsCount = 0;
let lastTooltipClosedTimestamp = 0;

/**
 * Universal Design-System Speech-Bubble Tooltip
 * Supports:
 * 1. Simple compact tooltips (Theme toggle buttons: "Light", "Dark", "System")
 * 2. Detailed rich tooltips (Skills section: Title, Category pill, Description, Action link)
 * Uses React.cloneElement when children is a single React element to preserve
 * 100% of the child's design, flex hierarchy, classes, and styles.
 * Powered by fluid spring physics and micro-blur for ultra-smooth in & out transitions.
 */
export function Tooltip({
  children,
  title,
  content,
  tag,
  action,
  side = "top",
  enterDelay = 120,
  exitDelay = 80,
  className = "",
  arrow = true,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isDetailed = Boolean(tag || action || (title && content));

  const [coords, setCoords] = useState({
    top: null,
    bottom: null,
    left: 0,
    arrowOffset: 20,
    actualSide: side,
  });

  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const enterTimerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const rafRef = useRef(null);

  const ARROW_HEIGHT = isDetailed ? 8 : 6;
  const ARROW_WIDTH = isDetailed ? 18 : 14;
  const GAP = isDetailed ? 6 : 5;
  const VIEWPORT_PADDING = 12;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();

    let actualSide = side;
    // Auto flip to bottom if too close to viewport top (< 130px for detailed, < 50px for simple)
    const threshold = isDetailed ? 130 : 50;
    if (side === "top" && triggerRect.top < threshold) {
      actualSide = "bottom";
    } else if (
      side === "bottom" &&
      window.innerHeight - triggerRect.bottom < threshold
    ) {
      actualSide = "top";
    }

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;

    // Estimate or measure tooltip width
    let tooltipWidth = tooltipRef.current?.offsetWidth;
    if (!tooltipWidth) {
      if (isDetailed) {
        tooltipWidth = 270;
      } else {
        const text = String(content || title || "");
        tooltipWidth = Math.min(220, Math.max(64, text.length * 8 + 28));
      }
    }

    // Center horizontally on trigger, clamped to viewport bounds
    let left = triggerCenterX - tooltipWidth / 2;
    const minLeft = VIEWPORT_PADDING;
    const maxLeft = window.innerWidth - tooltipWidth - VIEWPORT_PADDING;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    // Arrow offset from left edge of tooltip
    const arrowOffset = Math.max(
      12,
      Math.min(tooltipWidth - 12, triggerCenterX - left)
    );

    if (actualSide === "top") {
      // Anchored to bottom edge: distance from bottom of viewport to top of trigger
      const bottom = window.innerHeight - triggerRect.top + GAP + ARROW_HEIGHT;
      setCoords({
        top: null,
        bottom: Math.round(bottom),
        left: Math.round(left),
        arrowOffset: Math.round(arrowOffset),
        actualSide: "top",
      });
    } else {
      // Anchored to top edge: distance from top of viewport to bottom of trigger
      const top = triggerRect.bottom + GAP + ARROW_HEIGHT;
      setCoords({
        top: Math.round(top),
        bottom: null,
        left: Math.round(left),
        arrowOffset: Math.round(arrowOffset),
        actualSide: "bottom",
      });
    }
  }, [side, isDetailed, content, title, GAP, ARROW_HEIGHT]);

  const handlePointerEnter = useCallback(() => {
    if (disabled) return;
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    updatePosition();

    // Check if another tooltip was active recently (group hopping)
    const isRecentlyActive =
      globalActiveTooltipsCount > 0 ||
      Date.now() - lastTooltipClosedTimestamp < 350;

    const delay = isRecentlyActive ? 25 : enterDelay;

    enterTimerRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, delay);
  }, [disabled, enterDelay, updatePosition]);

  const handlePointerLeave = useCallback(() => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    exitTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, exitDelay);
  }, [exitDelay]);

  // Global active tooltips counter for rapid group hopping
  useEffect(() => {
    if (isOpen) {
      globalActiveTooltipsCount++;
      return () => {
        globalActiveTooltipsCount = Math.max(0, globalActiveTooltipsCount - 1);
        lastTooltipClosedTimestamp = Date.now();
      };
    }
  }, [isOpen]);

  // Immediately synchronize position before paint when opening
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  // Continuously track trigger element while open
  useEffect(() => {
    if (!isOpen) return;

    const loop = () => {
      updatePosition();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const handleScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tooltipId =
    title || content
      ? `tooltip-${String(title || content).toLowerCase().replace(/\s+/g, "-")}`
      : undefined;

  // Render trigger: use cloneElement if single React element to preserve design and DOM hierarchy
  let triggerElement;
  if (isValidElement(children)) {
    const child = children;
    const childRef =
      child.props?.ref !== undefined ? child.props.ref : child.ref;

    triggerElement = cloneElement(child, {
      ref: mergeRefs(triggerRef, childRef),
      onPointerEnter: (e) => {
        child.props.onPointerEnter?.(e);
        handlePointerEnter(e);
      },
      onPointerLeave: (e) => {
        child.props.onPointerLeave?.(e);
        handlePointerLeave(e);
      },
      onFocus: (e) => {
        child.props.onFocus?.(e);
        handlePointerEnter(e);
      },
      onBlur: (e) => {
        child.props.onBlur?.(e);
        handlePointerLeave(e);
      },
      "aria-describedby": isOpen
        ? [child.props["aria-describedby"], tooltipId]
            .filter(Boolean)
            .join(" ")
        : child.props["aria-describedby"],
      // Suppress native OS tooltip so only our styled design-system tooltip renders
      title: undefined,
    });
  } else {
    triggerElement = (
      <span
        ref={triggerRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handlePointerEnter}
        onBlur={handlePointerLeave}
        aria-describedby={isOpen ? tooltipId : undefined}
        className="inline-flex"
      >
        {children}
      </span>
    );
  }

  return (
    <>
      {triggerElement}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id={tooltipId}
                role="tooltip"
                ref={tooltipRef}
                initial={{
                  opacity: 0,
                  y: coords.actualSide === "top" ? 5 : -5,
                  scale: 0.96,
                  filter: "blur(3px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    type: "spring",
                    stiffness: 340,
                    damping: 26,
                    mass: 0.5,
                    opacity: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                    filter: { duration: 0.18, ease: "easeOut" },
                  },
                }}
                exit={{
                  opacity: 0,
                  y: coords.actualSide === "top" ? 3 : -3,
                  scale: 0.97,
                  filter: "blur(2px)",
                  transition: {
                    duration: 0.16,
                    ease: [0.32, 0, 0.67, 0],
                    opacity: { duration: 0.14, ease: "easeIn" },
                  },
                }}
                style={{
                  ...(coords.top !== null ? { top: `${coords.top}px` } : {}),
                  ...(coords.bottom !== null
                    ? { bottom: `${coords.bottom}px` }
                    : {}),
                  left: `${coords.left}px`,
                  ...(isDetailed ? { width: "270px" } : {}),
                }}
                className={cn(
                  "fixed z-[9999] pointer-events-none select-none",
                  // Theme-matching elevated glassmorphic surface
                  "bg-surface-elevated/95 backdrop-blur-glass",
                  "border border-border-hairline dark:border-border-glass glass-edge",
                  "shadow-card",
                  isDetailed
                    ? "rounded-2xl p-3.5 sm:p-4"
                    : "rounded-xl px-2.5 py-1 w-max max-w-[240px] whitespace-nowrap flex items-center justify-center",
                  className
                )}
              >
                {/* Speech Bubble Arrow pointing directly to trigger element */}
                {arrow && (
                  <div
                    className={cn(
                      "absolute -translate-x-1/2 pointer-events-none",
                      coords.actualSide === "top"
                        ? isDetailed
                          ? "-bottom-[8px]"
                          : "-bottom-[6px]"
                        : isDetailed
                          ? "-top-[8px]"
                          : "-top-[6px]"
                    )}
                    style={{ left: `${coords.arrowOffset}px` }}
                    aria-hidden="true"
                  >
                    {coords.actualSide === "top" ? (
                      <svg
                        width={ARROW_WIDTH}
                        height={ARROW_HEIGHT}
                        viewBox={`0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`}
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                      >
                        <path
                          d={`M0 0 L${ARROW_WIDTH * 0.42} ${ARROW_HEIGHT * 0.85} C${ARROW_WIDTH * 0.46} ${ARROW_HEIGHT} ${ARROW_WIDTH * 0.54} ${ARROW_HEIGHT} ${ARROW_WIDTH * 0.58} ${ARROW_HEIGHT * 0.85} L${ARROW_WIDTH} 0 Z`}
                          style={{ fill: "rgb(var(--rgb-surface-elevated))" }}
                        />
                        <path
                          d={`M0 0 L${ARROW_WIDTH * 0.42} ${ARROW_HEIGHT * 0.85} C${ARROW_WIDTH * 0.46} ${ARROW_HEIGHT} ${ARROW_WIDTH * 0.54} ${ARROW_HEIGHT} ${ARROW_WIDTH * 0.58} ${ARROW_HEIGHT * 0.85} L${ARROW_WIDTH} 0`}
                          style={{ stroke: "var(--color-border-hairline)" }}
                          strokeWidth="1"
                          fill="none"
                        />
                      </svg>
                    ) : (
                      <svg
                        width={ARROW_WIDTH}
                        height={ARROW_HEIGHT}
                        viewBox={`0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`}
                        className="drop-shadow-[0_-2px_4px_rgba(0,0,0,0.15)]"
                      >
                        <path
                          d={`M0 ${ARROW_HEIGHT} L${ARROW_WIDTH * 0.42} ${ARROW_HEIGHT * 0.15} C${ARROW_WIDTH * 0.46} 0 ${ARROW_WIDTH * 0.54} 0 ${ARROW_WIDTH * 0.58} ${ARROW_HEIGHT * 0.15} L${ARROW_WIDTH} ${ARROW_HEIGHT} Z`}
                          style={{ fill: "rgb(var(--rgb-surface-elevated))" }}
                        />
                        <path
                          d={`M0 ${ARROW_HEIGHT} L${ARROW_WIDTH * 0.42} ${ARROW_HEIGHT * 0.15} C${ARROW_WIDTH * 0.46} 0 ${ARROW_WIDTH * 0.54} 0 ${ARROW_WIDTH * 0.58} ${ARROW_HEIGHT * 0.15} L${ARROW_WIDTH} ${ARROW_HEIGHT}`}
                          style={{ stroke: "var(--color-border-hairline)" }}
                          strokeWidth="1"
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                )}

                {/* Compact Simple Tooltip Mode (Theme buttons, icons, etc.) */}
                {!isDetailed ? (
                  <span className="font-display text-caption font-semibold text-text-primary tracking-tight">
                    {content || title}
                  </span>
                ) : (
                  /* Detailed Rich Tooltip Mode (Skills Showcase) */
                  <>
                    {/* Header: Title in Baloo 2 font-display + Category Pill */}
                    {title && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-bold text-text-primary tracking-tight">
                          {title}
                        </span>
                        {tag && (
                          <span className="shrink-0 rounded-full bg-surface-pill border border-border-hairline px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent-violet">
                            {tag}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content / Description */}
                    {content && (
                      <p className="mt-1 text-[11px] sm:text-xs text-text-secondary leading-relaxed font-normal">
                        {content}
                      </p>
                    )}

                    {/* Footer Action / Link matching portfolio accent design */}
                    {action && (
                      <div className="mt-2.5 pt-2 border-t border-border-hairline flex items-center justify-between">
                        <span className="text-[11px] font-medium text-accent-violet hover:text-accent-primary transition-colors flex items-center gap-1.5 cursor-pointer">
                          <span>{action}</span>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-3"
                            aria-hidden="true"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export default Tooltip;
