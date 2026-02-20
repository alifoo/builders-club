import { useState } from "react"
import type { BannerElement } from "./types";
import DraggableElement from "./DraggableElement";
import Navbar from "../Navbar";
import clube from "../../assets/clube.jpg";

const InteractiveBanner = () => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({
    'main-title': { x: 100, y: 100 },
    'image-1': { x: 600, y: 100 },
    'card-1': { x: 500, y: 300 },
  })

  function handleMove(id: string, x: number, y: number) {
    setPositions(prev => ({
      ...prev,
      [id]: { x, y }
    }))
  }

  return (
    <div className="relative h-150 bg-gray-100 overflow-hidden">
      <Navbar />
      <DraggableElement id="main-title" x={positions['main-title'].x} y={positions['main-title'].y} onMove={handleMove}>
        <h1 className="text-7xl max-w-md">Bem-vindo ao <b>Building Club!</b></h1>
      </DraggableElement>
      <DraggableElement id="image-1" x={positions['image-1'].x} y={positions['image-1'].y} onMove={handleMove} >
        <img src={clube} alt="Clube" className="size-3/12 rounded-md shadow-md" />
      </DraggableElement >
      <DraggableElement id="card-1" x={positions['card-1'].x} y={positions['card-1'].y} onMove={handleMove} >
        <button className="border-2 border-gray-600 rounded-lg p-4 bg-gray-100">
          Me arraste!
        </button>
      </DraggableElement >
    </div >
  )
}

export default InteractiveBanner
