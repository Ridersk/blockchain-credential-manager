import { useEffect, useRef } from "react";
import type { Location } from "history";

export const usePrev = (value: Location) => {
  const ref = useRef<Location>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
