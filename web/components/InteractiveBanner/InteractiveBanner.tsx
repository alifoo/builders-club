import { useRef, useState } from "react"
import type { BannerElement } from "./types";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import clube from "../../assets/clube.jpg";

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({
    'main-title': { x: 5, y: 15 },
    'image-1': { x: 50, y: 15 },
    'text-1': { x: 40, y: 55 },
  })

  const containerRef = useRef<HTMLDivElement>(null)

  function handleMove(id: string, x: number, y: number) {
    setPositions(prev => ({
      ...prev,
      [id]: { x, y }
    }))
  }

  return (
    <div ref={containerRef} className="relative h-150 bg-gray-100 overflow-hidden">
      <Navbar />
      <DraggableElement id="main-title" x={positions['main-title'].x} y={positions['main-title'].y} onMove={handleMove} containerRef={containerRef}>
        <h1 className="text-3xl md:text-5xl lg:text-7xl max-w-md">Bem-vindo ao <b>Building Club</b></h1>
      </DraggableElement>
      <DraggableElement id="image-1" x={positions['image-1'].x} y={positions['image-1'].y} onMove={handleMove} containerRef={containerRef}>
        <img src={clube} alt="Clube" className="size-3/12 rounded-md shadow-md" />
      </DraggableElement >
      <DraggableElement id="text-1" x={positions['text-1'].x} y={positions['text-1'].y} onMove={handleMove} containerRef={containerRef}>
        <p className="max-w-52">Tudo nessa página é arrastável e editável. Clique com o botão direito em algo para testar!</p>
      </DraggableElement >
    </div >
  )
}

export default InteractiveBanner
