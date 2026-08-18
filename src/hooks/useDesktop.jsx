import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(DESKTOP_QUERY).matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
