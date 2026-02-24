import { useMemo, useRef, useState } from "react";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import { defaultElements } from "./defaultElements";
import Toolbar from "./Toolbar";
import ContextMenu from "./ContextMenu";
import Typewriter from "typewriter-effect";
import { useImageFilter } from "./useImageFilter";
import clube from "../../assets/clube.jpg";
import BenchmarkPopup from "./BenchmarkPopup";

const CONTAINER_PADDING = 500;

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<
    Record<string, { xPercent: number; yPx: number }>
  >({
    [defaultElements[0]]: { xPercent: 50, yPx: 120 },
    [defaultElements[1]]: { xPercent: 50, yPx: 370 },
    [defaultElements[2]]: { xPercent: 50, yPx: 270 },
    [defaultElements[3]]: { xPercent: 50, yPx: 24 },
  });
  const [selected, setSelected] = useState<{
    id: string;
    width: number;
    type: string;
    contextMenu?: boolean;
  } | null>(null);
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentSrc,
    metrics,
    setMetrics,
    applyGrayscaleWasm,
    applyGrayscaleJS,
    applySepiaWasm,
    applySepiaJS,
    applyInvertWasm,
    applyInvertJS,
    applyBlurWasm,
    applyBlurJS,
    resetFilter,
    uploadImage,
  } = useImageFilter(clube);

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

  function handleSelect(id: string, width: number, type: string) {
    setSelected({ id, width, type });
  }

  function handleMouseDown() {
    setSelected(null);
  }

  function handleDelete() {
    if (selected) {
      setHiddenElements((prev) => new Set(prev).add(selected.id));
      setSelected(null);
    }
  }

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const imgEl = event.currentTarget as HTMLElement;
    const imgRect = imgEl.getBoundingClientRect();
    setSelected({
      id: defaultElements[1],
      width: imgRect.width,
      type: "IMG",
      contextMenu: true,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"
      onMouseDown={handleMouseDown}
      style={
        containerMinHeight
          ? { minHeight: `${containerMinHeight}px` }
          : undefined
      }
    >
      {!hiddenElements.has(defaultElements[0]) && (
        <DraggableElement
          id={defaultElements[0]}
          xPercent={positions[defaultElements[0]].xPercent}
          yPx={positions[defaultElements[0]].yPx}
          onMove={handleMove}
          containerRef={containerRef}
          isSelected={selected?.id === defaultElements[0]}
          onSelect={handleSelect}
          type="TEXT"
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl w-48 sm:w-80 md:w-150 lg:w-200 h-fit font-space-mono p-0 m-0 text-center">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("bem-vindo(a) ao <strong>Building Club</strong>")
                  .start();
              }}
              options={{
                delay: 90,
              }}
            />
          </h1>
        </DraggableElement>
      )}

      {!hiddenElements.has(defaultElements[2]) && (
        <DraggableElement
          id={defaultElements[2]}
          xPercent={positions[defaultElements[2]].xPercent}
          yPx={positions[defaultElements[2]].yPx}
          onMove={handleMove}
          containerRef={containerRef}
          isSelected={selected?.id === defaultElements[2]}
          onSelect={handleSelect}
          type="TEXT"
        >
          <p className="font-space-mono text-sm sm:text-base w-48 sm:w-64 md:w-96 lg:w-150 h-fit text-center">
            tudo nesta página é arrastável e editável. clique em algum elemento
            para testar!
          </p>
        </DraggableElement>
      )}
      {!hiddenElements.has(defaultElements[1]) && (
        <DraggableElement
          id={defaultElements[1]}
          xPercent={positions[defaultElements[1]].xPercent}
          yPx={positions[defaultElements[1]].yPx}
          onMove={handleMove}
          containerRef={containerRef}
          isSelected={selected?.id === defaultElements[1]}
          onSelect={handleSelect}
          type="IMG"
        >
          <img
            src={currentSrc}
            alt="8k image"
            className="w-64 sm:w-72 md:w-96 lg:w-150 rounded-md shadow-md"
            onContextMenu={handleRightClick}
          />
        </DraggableElement>
      )}
      {!hiddenElements.has(defaultElements[3]) && (
        <DraggableElement
          id={defaultElements[3]}
          xPercent={positions[defaultElements[3]].xPercent}
          yPx={positions[defaultElements[3]].yPx}
          onMove={handleMove}
          containerRef={containerRef}
          isSelected={selected?.id === defaultElements[3]}
          onSelect={handleSelect}
          type="COMPONENT"
        >
          <Navbar />
        </DraggableElement>
      )}
      {selected && !selected.contextMenu && (
        <Toolbar
          xPercent={positions[selected.id].xPercent}
          yPx={positions[selected.id].yPx}
          width={selected.width}
          type={selected.type}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
          onGrayscaleWasm={applyGrayscaleWasm}
          onGrayscaleJS={applyGrayscaleJS}
          onSepiaWasm={applySepiaWasm}
          onSepiaJS={applySepiaJS}
          onInvertWasm={applyInvertWasm}
          onInvertJS={applyInvertJS}
          onBlurWasm={applyBlurWasm}
          onBlurJS={applyBlurJS}
          onReset={resetFilter}
          onDelete={handleDelete}
        />
      )}
      {metrics && (
        <BenchmarkPopup
          label={metrics.label}
          filterTime={metrics.filterTime}
          totalTime={metrics.totalTime}
          onClose={() => setMetrics(null)}
        />
      )}
      {selected?.contextMenu && (
        <ContextMenu
          xPercent={positions[selected.id].xPercent}
          yPx={positions[selected.id].yPx}
          width={selected.width}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
          onUploadImage={(file) => {
            uploadImage(file);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};

export default InteractiveBanner;
