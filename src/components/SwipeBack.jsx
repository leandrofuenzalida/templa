import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MIN_WIDTH = 768;
const MIN_DISTANCE = 80;
const MAX_VERTICAL = 60;
const MAX_DURATION = 600;
const TEXT_TARGET = 'input, textarea, select, [contenteditable="true"]';

export function SwipeBack() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!window.matchMedia(`(min-width: ${MIN_WIDTH}px)`).matches) return;

    let start = null;

    function handleTouchStart(e) {
      if (e.touches.length !== 1 || e.target.closest(TEXT_TARGET)) {
        start = null;
        return;
      }
      const touch = e.touches[0];
      start = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    }

    function handleTouchEnd(e) {
      if (!start) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const elapsed = Date.now() - start.time;
      start = null;

      const isSwipeLeft = dx <= -MIN_DISTANCE;
      const isHorizontal = Math.abs(dy) <= MAX_VERTICAL;
      const isQuick = elapsed <= MAX_DURATION;
      const hasPreviousPage = location.key !== "default";

      if (isSwipeLeft && isHorizontal && isQuick && hasPreviousPage) {
        navigate(-1);
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate, location.key]);

  return null;
}
