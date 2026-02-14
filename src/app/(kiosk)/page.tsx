"use client";

import { useRouter } from "next/navigation";
import { useRef, useCallback, useState, useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import { ChevronRight, Check, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_SWIPE_DISTANCE = 80;
const BUTTON_SIZE = 56;
const TAP_THRESHOLD = 5;

export default function KioskHomePage() {
  const router = useRouter();
  const { resolved } = useThemeStore();
  const isDark = resolved === "dark";
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const dragOffsetRef = useRef(0);
  const maxDragRef = useRef(240);
  const isTouchActive = useRef(false);
  const isMouseActive = useRef(false);
  const didDrag = useRef(false);

  const [dragOffset, setDragOffset] = useState(0);
  const [maxDrag, setMaxDrag] = useState(240);
  const [trackWidth, setTrackWidth] = useState(448);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const goToOrderType = useCallback(() => {
    router.push("/order-type");
  }, [router]);

  const handleTrackFocus = useCallback((e: React.FocusEvent) => {
    (e.target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const updateTrackSize = () => {
      const w = el.offsetWidth;
      const max = Math.max(0, w - BUTTON_SIZE - 32);
      setTrackWidth(w);
      setMaxDrag(max);
      maxDragRef.current = max;
    };
    updateTrackSize();
    const ro = new ResizeObserver(updateTrackSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    dragStartOffset.current = dragOffsetRef.current;
    isTouchActive.current = true;
    didDrag.current = false;
    setIsSwiping(true);
    setShowProgress(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isTouchActive.current) return;
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX.current;
      if (Math.abs(deltaX) > TAP_THRESHOLD) didDrag.current = true;
      const newOffset = Math.max(0, Math.min(maxDrag, dragStartOffset.current + deltaX));
      dragOffsetRef.current = newOffset;
      setDragOffset(newOffset);
    },
    [maxDrag]
  );

  const handleTouchEnd = useCallback(() => {
    isTouchActive.current = false;
    setIsSwiping(false);
    const currentOffset = dragOffsetRef.current;
    if (!didDrag.current) {
      setDragOffset(0);
      dragOffsetRef.current = 0;
      setShowProgress(false);
      setAttemptCount((c) => c + 1);
      goToOrderType();
      return;
    }
    if (currentOffset >= MIN_SWIPE_DISTANCE) {
      const full = maxDragRef.current;
      setDragOffset(full);
      dragOffsetRef.current = full;
      setIsComplete(true);
      setTimeout(() => {
        setShowProgress(false);
        goToOrderType();
      }, 500);
    } else {
      setDragOffset(0);
      dragOffsetRef.current = 0;
      setShowProgress(false);
      setAttemptCount((c) => c + 1);
    }
  }, [goToOrderType]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    touchStartX.current = e.clientX;
    dragStartOffset.current = dragOffsetRef.current;
    isMouseActive.current = true;
    didDrag.current = false;
    setIsSwiping(true);
    setShowProgress(true);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseActive.current) return;
      const deltaX = e.clientX - touchStartX.current;
      if (Math.abs(deltaX) > TAP_THRESHOLD) didDrag.current = true;
      const newOffset = Math.max(0, Math.min(maxDrag, dragStartOffset.current + deltaX));
      dragOffsetRef.current = newOffset;
      setDragOffset(newOffset);
    };
    const onMouseUp = () => {
      if (!isMouseActive.current) return;
      isMouseActive.current = false;
      setIsSwiping(false);
      const currentOffset = dragOffsetRef.current;
      if (!didDrag.current) {
        setDragOffset(0);
        dragOffsetRef.current = 0;
        setShowProgress(false);
        setAttemptCount((c) => c + 1);
        goToOrderType();
        return;
      }
      if (currentOffset >= MIN_SWIPE_DISTANCE) {
        const full = maxDragRef.current;
        setDragOffset(full);
        dragOffsetRef.current = full;
        setIsComplete(true);
        setTimeout(() => {
          setShowProgress(false);
          goToOrderType();
        }, 500);
      } else {
        setDragOffset(0);
        dragOffsetRef.current = 0;
        setShowProgress(false);
        setAttemptCount((c) => c + 1);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [maxDrag, goToOrderType]);

  const progressPercent = maxDrag > 0 ? Math.round((dragOffset / maxDrag) * 100) : 0;
  
  const swipeText = isComplete 
    ? "Order Confirmed! 🎉" 
    : isSwiping 
      ? `Release to Order (${progressPercent}%)`
      : "Swipe right to order";

  const BUTTON_LEFT = 8; // left-2 = 8px
  const fillWidth = isComplete ? trackWidth : BUTTON_LEFT + BUTTON_SIZE + dragOffset;
  const isNearComplete = dragOffset >= MIN_SWIPE_DISTANCE && isSwiping;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-7rem)] px-3 sm:px-4 pt-10 sm:pt-14 laptop:pt-16">
      <p className="text-lg sm:text-xl font-bold text-orange-500 mb-2 sm:mb-3">Eatry Cloud</p>
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
        <span className="text-xs sm:text-sm font-medium tracking-widest text-gray-500 dark:text-gray-400">
          FRESHLY MADE • EVERY DAY
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-2xl mb-2 sm:mb-4">
        Are you <span className="text-orange-500">Hungry?</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 text-center mb-8 sm:mb-10 md:mb-12">
        Freshly prepared, just how you like it.
      </p>

      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-2 sm:gap-3">
        {/* Hint text with conditional display */}
        {!isSwiping && !isComplete && (
          <div className="flex items-center gap-4 text-orange-500 text-sm sm:text-base font-medium mb-2 animate-slide-in-feedback">
            <Hand className="w-4 h-4 sm:w-5 sm:h-5 animate-swipe-arrow" />
            <span>Swipe to order</span>
          </div>
        )}

        {/* Track with draggable button */}
        <div
          ref={trackRef}
          role="button"
          tabIndex={0}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onFocus={handleTrackFocus}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToOrderType()}
          className={cn(
            "relative w-full h-14 sm:h-16 rounded-full overflow-hidden cursor-pointer select-none touch-none",
            "transition-all duration-300 ring-2 ring-offset-2",
            isDark 
              ? "bg-gradient-to-br from-zinc-700 to-zinc-800 ring-orange-500/30 ring-offset-black" 
              : "bg-gradient-to-br from-zinc-100 to-zinc-200 ring-orange-500/40 ring-offset-white",
            isNearComplete && "ring-orange-500 ring-offset-2 shadow-lg shadow-orange-500/30"
          )}
        >
          {/* Progress background glow */}
          {isSwiping && (
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400/20 via-orange-500/20 to-transparent animate-progress-glow"
              style={{ width: `${progressPercent}%` }}
            />
          )}

          {/* Gradient fill - grows to full track width when complete */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full z-0 transition-all",
              isComplete ? "rounded-full" : "rounded-l-full rounded-r-lg"
            )}
            style={{
              width: fillWidth,
              background: isComplete 
                ? "linear-gradient(90deg, rgb(34 197 94 / 0.5), rgb(22 163 74 / 0.7))"
                : "linear-gradient(90deg, rgb(249 115 22 / 0.3), rgb(234 88 12 / 0.5))",
              transition: isSwiping ? "none" : "width 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s",
            }}
          />

          {/* Draggable button - horizontal only */}
          <div
            className={cn(
              "absolute left-2 top-1/2 flex items-center justify-center rounded-full text-white transition-all z-10",
              isDark ? "shadow-lg shadow-black/50" : "shadow-md shadow-black/20",
              isComplete 
                ? "bg-green-500 cursor-default" 
                : "bg-orange-500 cursor-grab active:cursor-grabbing",
              !isComplete && !isSwiping && "animate-button-pulse"
            )}
            style={{
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              transform: `translate(${dragOffset}px, -50%) scale(${isComplete ? 1.1 : 1})`,
              transition: isSwiping ? "none" : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.25s",
            }}
          >
            {isComplete ? (
              <Check className="w-6 h-6 sm:w-8 sm:h-8 animate-success-check" strokeWidth={3} />
            ) : (
              <ChevronRight className={cn("w-6 h-6 sm:w-8 sm:h-8", !isSwiping && "animate-swipe-arrow")} />
            )}
          </div>

          {/* Progress indicator dots - shows swipe progress */}
          {showProgress && !isComplete && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 sm:h-2 rounded-full transition-all duration-200",
                    i * 20 <= progressPercent
                      ? "bg-orange-500 w-2 sm:w-2.5"
                      : isDark
                        ? "bg-zinc-600 w-1.5"
                        : "bg-zinc-400 w-1.5"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dynamic text below track - with Release / Order Placed animations */}
        <p
          className={cn(
            "w-full text-center text-base sm:text-lg md:text-xl font-semibold min-h-[2rem] transition-all duration-200",
            isDark ? "text-gray-200" : "text-gray-700",
            isSwiping && "animate-release-pulse text-orange-600 dark:text-orange-400",
            isComplete && "animate-order-placed text-green-900 dark:text-green-900"
          )}
        >
          {swipeText}
        </p>

        {/* Progress percentage text - shows while swiping */}
        {isSwiping && !isComplete && (
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400 animate-slide-in-feedback">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>{progressPercent}% complete</span>
          </div>
        )}
      </div>
    </div>
  );
}
