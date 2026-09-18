import { useCallback, useLayoutEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

function NumberItem({
  value,
  index,
  total,
  className,
  getHeight,
  isInView,
}) {
  const numberRef = useRef(null);
  const isInitialRef = useRef(true);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 260 - Math.min(index * 3, 20),
    damping: 22,
    mass: 0.6,
  });

  const isDigit = !isNaN(Number(value)) && value !== " " && value !== "";

  useLayoutEffect(() => {
    if (!isInView || !isDigit) return;

    const height = getHeight();
    if (!height) return;

    const target = -height * parseInt(value, 10);

    if (isInitialRef.current) {
      isInitialRef.current = false;
      motionValue.jump(target);
    } else {
      motionValue.set(target);
    }
  }, [value, isDigit, isInView, motionValue, getHeight]);

  if (!isDigit) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center px-[2px] font-bold text-text-tertiary select-none leading-none opacity-80",
          className,
        )}
      >
        {value}
      </span>
    );
  }

  if (!isInView) {
    return <span className={className}>{value}</span>;
  }

  const itemHeight = getHeight();

  return (
    <motion.div
      ref={numberRef}
      style={{
        translateY: springValue,
      }}
      className="inline-flex flex-col select-none"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          className={cn("flex items-center justify-center leading-none", className)}
          style={{ height: itemHeight > 0 ? itemHeight : undefined }}
          key={i}
        >
          {i}
        </div>
      ))}
    </motion.div>
  );
}

export default function Ticker({
  value,
  className,
  numberClassName,
}) {
  const parts = String(value).split("");
  const measureRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });
  const getHeight = useCallback(
    () => measureRef.current?.getBoundingClientRect().height ?? 0,
    [],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex overflow-hidden whitespace-pre tabular-nums leading-none select-none",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-start justify-center min-w-fit">
        {parts.map((part, index) => (
          <NumberItem
            getHeight={getHeight}
            index={index}
            key={`${index}-${part === ":" ? "colon" : "num"}`}
            value={part}
            total={parts.length}
            className={numberClassName}
            isInView={isInView}
          />
        ))}
      </div>
      <div
        ref={measureRef}
        aria-hidden="true"
        className={cn(
          "invisible min-w-fit select-none pointer-events-none opacity-0 leading-none",
          numberClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}
