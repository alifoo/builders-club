import { useRef, useState } from "react";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import clube from "../../assets/clube.jpg";
import { defaultElements } from "./defaultElements";

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({
    [defaultElements[0]]: { x: 50, y: 10 },
    [defaultElements[1]]: { x: 50, y: 45 },
    [defaultElements[2]]: { x: 50, y: 30 },
    [defaultElements[3]]: { x: 50, y: 1 },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  function handleMove(id: string, x: number, y: number) {
    setPositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen h-300 w-full bg-gray-100 overflow-hidden bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"
    >
      <DraggableElement
        id={defaultElements[0]}
        x={positions[defaultElements[0]].x}
        y={positions[defaultElements[0]].y}
        onMove={handleMove}
        containerRef={containerRef}
      >
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl w-64 sm:w-80 md:w-150 lg:w-200 h-fit font-space-mono p-0 m-0 text-center">
          Bem-vindo(a) ao <b>Building Club</b>
        </h1>
      </DraggableElement>

      <DraggableElement
        id={defaultElements[2]}
        x={positions[defaultElements[2]].x}
        y={positions[defaultElements[2]].y}
        onMove={handleMove}
        containerRef={containerRef}
      >
        <p className="font-space-mono text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md text-center">
          Tudo nesta página é arrastável e editável. Clique em algum elemento
          para testar!
        </p>
      </DraggableElement>
      <DraggableElement
        id={defaultElements[1]}
        x={positions[defaultElements[1]].x}
        y={positions[defaultElements[1]].y}
        onMove={handleMove}
        containerRef={containerRef}
      >
        <img
          src={clube}
          alt="Clube"
          className="w-48 sm:w-64 md:w-96 lg:w-150 rounded-md shadow-md"
        />
      </DraggableElement>
      <DraggableElement
        id={defaultElements[3]}
        x={positions[defaultElements[3]].x}
        y={positions[defaultElements[3]].y}
        onMove={handleMove}
        containerRef={containerRef}
      >
        <Navbar />
      </DraggableElement>
    </div>
  );
};

export default InteractiveBanner;
