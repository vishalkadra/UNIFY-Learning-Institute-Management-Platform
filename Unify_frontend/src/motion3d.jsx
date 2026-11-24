import { useRef, useState, useEffect } from "react";

/**
 * Card wrapper. Kept under the old name so every page keeps working.
 * The heavy cursor-tracking 3D tilt was replaced by a light CSS hover lift
 * (see .tilt-3d in theme.css) – smoother, cheaper and accessible.
 * `maxTilt` is accepted but no longer used.
 */
// eslint-disable-next-line no-unused-vars
export function Tilt3D({ children, className = "", maxTilt = 10, style = {} }) {
  return (
    <div className={`tilt-3d ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Wraps a group of items; once scrolled into view, its children fade up (staggered). */
export function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-3d ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}
