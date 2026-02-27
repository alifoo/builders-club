import { useEffect, useMemo, useRef, useState } from "react";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import { defaultElements } from "./defaultElements";
import Toolbar from "./Toolbar";
import ContextMenu from "./ContextMenu";
import Typewriter from "typewriter-effect";
import { useImageFilter } from "./useImageFilter";
import clube from "../../assets/clube.jpg";
import BenchmarkPopup from "./BenchmarkPopup";
import { motion } from "motion/react";

const CONTAINER_PADDING = 500;

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<
    Record<string, { xPercent: number; yPx: number }>
  >({
    [defaultElements[0]]: { xPercent: 50, yPx: 120 },
    [defaultElements[1]]: { xPercent: 50, yPx: 360 },
    [defaultElements[2]]: { xPercent: 50, yPx: 270 },
    [defaultElements[3]]: { xPercent: 50, yPx: 24 },
    [defaultElements[4]]: { xPercent: 50, yPx: 700 },
    [defaultElements[5]]: { xPercent: 50, yPx: 970 },
  });
  const [selected, setSelected] = useState<{
    id: string;
    width: number;
    type: string;
    contextMenu?: boolean;
  } | null>(null);
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());
  const [isSmall, setIsSmall] = useState(false);
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    setIsSmall(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

  function handleTouchStart() {
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
      onTouchStart={handleTouchStart}
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
                  .typeString("bem-vindo(a) ao <strong>Builders Club</strong>")
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
          yPx={positions[defaultElements[2]].yPx - (isSmall ? 30 : 0)}
          onMove={handleMove}
          containerRef={containerRef}
          isSelected={selected?.id === defaultElements[2]}
          onSelect={handleSelect}
          type="TEXT"
        >
          <p className="font-space-mono text-sm sm:text-base w-48 sm:w-64 md:w-96 lg:w-150 h-fit text-center">
            o clube da pucpr sobre programação, design e produto.
          </p>
        </DraggableElement>
      )}
      {!hiddenElements.has(defaultElements[1]) && (
        <DraggableElement
          id={defaultElements[1]}
          xPercent={positions[defaultElements[1]].xPercent}
          yPx={positions[defaultElements[1]].yPx - (isSmall ? 20 : 0)}
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
      {!hiddenElements.has(defaultElements[4]) && (
        <DraggableElement
          id={defaultElements[4]}
          xPercent={positions[defaultElements[4]].xPercent}
          yPx={positions[defaultElements[4]].yPx - (isSmall ? 180 : 0)}
          onMove={handleMove}
          containerRef={containerRef}
          isSelected={selected?.id === defaultElements[4]}
          onSelect={handleSelect}
          type="TEXT"
        >
          <p className="font-space-mono text-sm sm:text-base w-48 sm:w-64 md:w-96 lg:w-150 h-fit text-center">
            temos encontros semanais onde falamos sobre programação (com foco em
            web dev), produto (com foco em startups), design e muito mais.
          </p>
          <br />
          <p className="font-space-mono text-sm sm:text-base w-48 sm:w-64 md:w-96 lg:w-150 h-fit text-center">
            além disso, realizamos workshops, hackathons e projetos open-source
            para colocar a mão na massa e aprender fazendo.
          </p>
          <br />
          <p className="font-space-mono text-sm sm:text-base w-48 sm:w-64 md:w-96 lg:w-150 h-fit text-center">
            seja você iniciante ou avançado, tem um lugar para você no nosso
            clube. junte-se a nós e faça parte dessa comunidade de builders da
            pucpr! 🔨
          </p>
        </DraggableElement>
      )}
      {!hiddenElements.has(defaultElements[5]) && (
        <DraggableElement
          id={defaultElements[5]}
          xPercent={positions[defaultElements[5]].xPercent}
          yPx={positions[defaultElements[5]].yPx + (isSmall ? 30 : 0)}
          onMove={handleMove}
          containerRef={containerRef}
          isSelected={selected?.id === defaultElements[5]}
          onSelect={handleSelect}
          type="TEXT"
        >
          <a href="https://wa.me/5541992488366?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20Builders%20Club%20da%20PUCPR!%0A%0AMeu%20nome%20%C3%A9%3A%20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-space-mono text-sm sm:text-base w-fit h-fit text-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-md cursor-pointer"
            >
              entrar no clube
            </motion.button>
          </a>
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
          onTouchStart={(e: React.TouchEvent) => e.stopPropagation()}
          onGrayscaleWasm={applyGrayscaleWasm}
          // onGrayscaleJS={applyGrayscaleJS}
          onSepiaWasm={applySepiaWasm}
          // onSepiaJS={applySepiaJS}
          onInvertWasm={applyInvertWasm}
          // onInvertJS={applyInvertJS}
          onBlurWasm={applyBlurWasm}
          // onBlurJS={applyBlurJS}
          onReset={resetFilter}
          onDelete={handleDelete}
        />
      )}
      {/* {metrics && ( */}
      {/*   <BenchmarkPopup */}
      {/*     label={metrics.label} */}
      {/*     filterTime={metrics.filterTime} */}
      {/*     totalTime={metrics.totalTime} */}
      {/*     onClose={() => setMetrics(null)} */}
      {/*   /> */}
      {/* )} */}
      {selected?.contextMenu && (
        <ContextMenu
          xPercent={positions[selected.id].xPercent}
          yPx={positions[selected.id].yPx}
          width={selected.width}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
          onTouchStart={(e: React.TouchEvent) => e.stopPropagation()}
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
