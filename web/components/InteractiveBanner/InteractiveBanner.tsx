import { useLayoutEffect, useMemo, useRef, useState } from "react";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import clube from "../../assets/clube.jpg";
import { defaultElements } from "./defaultElements";
import Toolbar from "./Toolbar";

// Tailwind classes for initial positioning.
// X: left-1/2 -translate-x-1/2 centers horizontally (measured as ~50%, stays centered on resize).
// Y: mobile uses fixed pixel values (top-X), desktop uses percentage (md:top-[Y%]).
//    After measurement, Y is locked to pixels so elements don't spread apart on small screens.
const initialClasses: Record<string, string> = {
  [defaultElements[0]]: "left-1/2 -translate-x-1/2 top-16 md:top-[20%]", // main-title
  [defaultElements[1]]: "left-1/2 -translate-x-1/2 top-56 md:top-[80%]", // img-1 (image)
  [defaultElements[2]]: "left-1/2 -translate-x-1/2 top-48 md:top-[60%]", // text-1  (paragraph)
  [defaultElements[3]]: "left-1/2 -translate-x-1/2 top-3 md:top-[2%]",   // navbar
};

// Extra space (px) below the lowest element so there's always room to drag further down
const CONTAINER_PADDING = 500;

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<Record<
    string,
    { xPercent: number; yPx: number }
  > | null>(null);
  const [selected, setSelected] = useState<{
    id: string;
    width: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically grow the container so elements can be dragged downward infinitely.
  // Always keeps CONTAINER_PADDING px of space below the lowest element.
  const containerMinHeight = useMemo(() => {
    if (!positions) return undefined;
    const maxY = Math.max(...Object.values(positions).map((p) => p.yPx));
    return maxY + CONTAINER_PADDING;
  }, [positions]);

  // Measure actual rendered positions (after Tailwind/CSS resolves) and
  // convert to hybrid coordinates (X%, Ypx) before the first paint.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const measured: Record<string, { xPercent: number; yPx: number }> = {};

    for (const id of defaultElements) {
      const el = container.querySelector(
        `[data-draggable-id="${id}"]`
      ) as HTMLElement | null;
      if (!el) continue;

      const elRect = el.getBoundingClientRect();
      measured[id] = {
        // Center X as percentage of container width
        xPercent:
          ((elRect.left - containerRect.left + elRect.width / 2) /
            containerRect.width) *
          100,
        // Top Y in pixels relative to container
        yPx: elRect.top - containerRect.top,
      };
    }

    setPositions(measured);
  }, []);

  function handleMove(id: string, xPercent: number, yPx: number) {
    setPositions((prev) => ({
      ...prev,
      [id]: { xPercent, yPx },
    }));
  }

  function handleSelect(id: string, width: number) {
    setSelected({ id, width });
  }

  function handleMouseDown() {
    setSelected(null);
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-x-hidden bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"
      style={containerMinHeight ? { minHeight: `${containerMinHeight}px` } : undefined}
      onMouseDown={handleMouseDown}
    >
      <DraggableElement
        id={defaultElements[0]}
        xPercent={positions?.[defaultElements[0]]?.xPercent ?? null}
        yPx={positions?.[defaultElements[0]]?.yPx ?? null}
        initialClassName={initialClasses[defaultElements[0]]}
        onMove={handleMove}
        containerRef={containerRef}
        isSelected={selected?.id === defaultElements[0]}
        onSelect={handleSelect}
      >
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl w-64 sm:w-80 md:w-150 lg:w-200 h-fit font-space-mono p-0 m-0 text-center">
          Bem-vindo(a) ao <b>Building Club</b>
        </h1>
      </DraggableElement>

      <DraggableElement
        id={defaultElements[2]}
        xPercent={positions?.[defaultElements[2]]?.xPercent ?? null}
        yPx={positions?.[defaultElements[2]]?.yPx ?? null}
        initialClassName={initialClasses[defaultElements[2]]}
        onMove={handleMove}
        containerRef={containerRef}
        isSelected={selected?.id === defaultElements[2]}
        onSelect={handleSelect}
      >
        <p className="font-space-mono text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md text-center">
          Tudo nesta página é arrastável e editável. Clique em algum elemento
          para testar!
        </p>
      </DraggableElement>
      <DraggableElement
        id={defaultElements[1]}
        xPercent={positions?.[defaultElements[1]]?.xPercent ?? null}
        yPx={positions?.[defaultElements[1]]?.yPx ?? null}
        initialClassName={initialClasses[defaultElements[1]]}
        onMove={handleMove}
        containerRef={containerRef}
        isSelected={selected?.id === defaultElements[1]}
        onSelect={handleSelect}
      >
        <img
          src={clube}
          alt="Clube"
          className="w-48 sm:w-64 md:w-96 lg:w-150 rounded-md shadow-md"
        />
      </DraggableElement>
      <DraggableElement
        id={defaultElements[3]}
        xPercent={positions?.[defaultElements[3]]?.xPercent ?? null}
        yPx={positions?.[defaultElements[3]]?.yPx ?? null}
        initialClassName={initialClasses[defaultElements[3]]}
        onMove={handleMove}
        containerRef={containerRef}
        isSelected={selected?.id === defaultElements[3]}
        onSelect={handleSelect}
      >
        <Navbar />
      </DraggableElement>
      {selected && positions?.[selected.id] && (
        <Toolbar
          xPercent={positions[selected.id].xPercent}
          yPx={positions[selected.id].yPx}
          width={selected.width}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
        />
      )}
    </div>
  );
};

export default InteractiveBanner;
