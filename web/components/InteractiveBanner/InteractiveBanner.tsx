import { useMemo, useRef, useState } from "react";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import clube from "../../assets/clube.jpg";
import { defaultElements } from "./defaultElements";
import Toolbar from "./Toolbar";
import Typewriter from "typewriter-effect";

const CONTAINER_PADDING = 500;

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<
    Record<string, { xPercent: number; yPx: number }>
  >({
    [defaultElements[0]]: { xPercent: 50, yPx: 120 },
    [defaultElements[1]]: { xPercent: 50, yPx: 340 },
    [defaultElements[2]]: { xPercent: 50, yPx: 260 },
    [defaultElements[3]]: { xPercent: 50, yPx: 24 },
  });
  const [selected, setSelected] = useState<{ id: string; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerMinHeight = useMemo(() => {
    if (!positions) return undefined;
    const maxY = Math.max(...Object.values(positions).map((p) => p.yPx));
    return maxY + CONTAINER_PADDING;
  }, [positions]);

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
      className="relative min-h-screen w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"
      onMouseDown={handleMouseDown}
      style={containerMinHeight ? { minHeight: `${containerMinHeight}px` } : undefined}
    >
      <DraggableElement
        id={defaultElements[0]}
        xPercent={positions[defaultElements[0]].xPercent}
        yPx={positions[defaultElements[0]].yPx}
        onMove={handleMove}
        containerRef={containerRef}
        isSelected={selected?.id === defaultElements[0]}
        onSelect={handleSelect}
      >
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl w-64 sm:w-80 md:w-150 lg:w-200 h-fit font-space-mono p-0 m-0 text-center">
          <Typewriter
            onInit={(typewriter) => {
              typewriter.typeString('Bem-vindo(a) ao <strong>Building Club</strong>').start();
            }}
            options={{
              delay: 90,
            }}
          />
        </h1>
      </DraggableElement>

      <DraggableElement
        id={defaultElements[2]}
        xPercent={positions[defaultElements[2]].xPercent}
        yPx={positions[defaultElements[2]].yPx}
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
        xPercent={positions[defaultElements[1]].xPercent}
        yPx={positions[defaultElements[1]].yPx}
        onMove={handleMove}
        containerRef={containerRef}
        isSelected={selected?.id === defaultElements[1]}
        onSelect={handleSelect}
      >
        <img
          src={clube}
          alt="Clube"
          className="w-64 sm:w-72 md:w-96 lg:w-150 rounded-md shadow-md"
        />
      </DraggableElement>
      <DraggableElement
        id={defaultElements[3]}
        xPercent={positions[defaultElements[3]].xPercent}
        yPx={positions[defaultElements[3]].yPx}
        onMove={handleMove}
        containerRef={containerRef}
        isSelected={selected?.id === defaultElements[3]}
        onSelect={handleSelect}
      >
        <Navbar />
      </DraggableElement>
      {selected && (
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
