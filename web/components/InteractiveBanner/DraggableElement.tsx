import { useRef } from "react";
import type { BannerElement } from "./types"

interface Props {
  element: BannerElement;
  onMove: (id: string, x: number, y: number) => void
}

const DraggableElement = ({ element, onMove }: Props) => {
  const dragOffset = useRef({ x: 0, y: 0 })

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    const offsetX = e.clientX - element.x;
    const offsetY = e.clientY - element.y;
    dragOffset.current = { x: offsetX, y: offsetY };
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent) {
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    onMove(element.id, newX, newY);
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="absolute cursor-grab border-2 border-gray-600 rounded-md p-4 bg-gray-100" style={{ left: element.x, top: element.y }} onMouseDown={handleMouseDown}>
      {element.content}
    </div>
  )
}

export default DraggableElement
