import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

type LayoutResult = {
  isMobile: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isTouchDeviceOrMobile: boolean;
};

export function useCalculateLayout(): LayoutResult {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  return {
    isMobile,
    isDesktop: !isMobile,
    isTouchDevice,
    isTouchDeviceOrMobile: isMobile || isTouchDevice,
  };
}
