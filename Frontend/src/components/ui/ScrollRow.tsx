"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ScrollRowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Horizontally scrolling row with snap points and hover arrows on desktop.
 * Children should be `shrink-0 snap-start` items with a fixed width.
 */
export function ScrollRow({ children, className }: ScrollRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrowClasses =
    "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-pop transition-opacity hover:bg-surface-muted md:grid opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100";

  return (
    <div className="group/row relative">
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className={cn("no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1", className)}
      >
        {children}
      </div>
      {!atStart && (
        <button type="button" aria-label="Scroll left" onClick={() => scrollByPage(-1)} className={cn(arrowClasses, "-left-4")}>
          <ChevronLeft size={20} aria-hidden />
        </button>
      )}
      {!atEnd && (
        <button type="button" aria-label="Scroll right" onClick={() => scrollByPage(1)} className={cn(arrowClasses, "-right-4")}>
          <ChevronRight size={20} aria-hidden />
        </button>
      )}
    </div>
  );
}
