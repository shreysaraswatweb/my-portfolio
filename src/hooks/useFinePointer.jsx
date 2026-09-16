import { useEffect, useState } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export default function useFinePointer() {
  const [isFinePointer, setIsFinePointer] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(FINE_POINTER_QUERY).matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const onChange = () => setIsFinePointer(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isFinePointer;
}
