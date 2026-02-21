import { useRef, useState } from "react";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import clube from "../../assets/clube.jpg";
import { defaultElements } from "./defaultElements";

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({
    [defaultElements[0]]: { x: 5, y: 15 },
    [defaultElements[1]]: { x: 50, y: 15 },
    [defaultElements[2]]: { x: 40, y: 55 },
  });

  const [fonts, setFonts] = useState<Record<string, string>>({
    [defaultElements[0]]: "'Sedgwick', serif",
    [defaultElements[1]]: "'Gloock', serif",
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
      className="relative h-150 bg-gray-100 overflow-hidden inset-0 bg-white bg-[linear-gradient(to_right,#80808012_2px,transparent_2px),linear-gradient(to_bottom,#80808012_2px,transparent_2px)] bg-size-[24px_24px]"
    >
      <Navbar />
      <DraggableElement
        id={defaultElements[0]}
        x={positions[defaultElements[0]].x}
        y={positions[defaultElements[0]].y}
        onMove={handleMove}
        containerRef={containerRef}
      >
        <h1
          className="text-3xl md:text-5xl lg:text-7xl max-w-md"
          style={{ fontFamily: fonts[defaultElements[0]] }}
        >
          Bem-vindo ao <b>Building Club</b>
        </h1>
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
          className="size-3/12 rounded-md shadow-md"
        />
      </DraggableElement>
      <DraggableElement
        id={defaultElements[2]}
        x={positions[defaultElements[2]].x}
        y={positions[defaultElements[2]].y}
        onMove={handleMove}
        containerRef={containerRef}
      >
        <p className="max-w-52">
          Tudo nessa página é arrastável e editável. Clique com o botão direito
          em algo para testar!
        </p>
      </DraggableElement>
    </div>
  );
};

export default InteractiveBanner;
