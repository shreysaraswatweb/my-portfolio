import { useEffect, useRef, useState } from "react";

/**
 * DeferredSection:
 * Mounts children when nearing the viewport (or on idle fallback),
 * keeping initial main-thread blocking time minimal while preserving
 * seamless scrolling and all motions/animations.
 */
export default function DeferredSection({
  children,
  minHeight = "160px",
  rootMargin = "400px",
  className = "",
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (shouldRender) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return;
    }

    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [shouldRender, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={!shouldRender ? { minHeight } : undefined}
    >
      {shouldRender ? children : null}
    </div>
  );
}
