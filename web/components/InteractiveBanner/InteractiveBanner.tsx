import { useState } from "react"
import type { BannerElement } from "./types";
import DraggableElement from "./DraggableElement";

const InteractiveBanner = () => {
  const [elements, setElements] = useState<BannerElement[]>([
    {
      id: 'text-1',
      type: 'text',
      x: 100,
      y: 200,
      width: 200,
      height: 40,
      content: 'Drag me!'
    },
    {
      id: 'text-2',
      type: 'text',
      x: 400,
      y: 300,
      width: 250,
      height: 40,
      content: 'Me too!'
    }
  ])

  function handleMove(id: string, x: number, y: number) {
    setElements(prev => prev.map(element => element.id === id ? { ...element, x, y } : element))
  }

  return (
    <div className="mx-auto max-w-[90vh] relative h-[600px] w-[1200px] bg-gray-400 overflow-hidden">
      {elements.map(element => (
        <DraggableElement key={element.id} element={element} onMove={handleMove} />
      ))}
    </div>
  )
}

export default InteractiveBanner
