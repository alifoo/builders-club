import { useRef } from "react";

interface Props {
  id: string;
  x: number;
  y: number;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

const DraggableElement = ({ id, x, y, onMove, children }: Props) => {
  const dragOffset = useRef({ x: 0, y: 0 })

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    const offsetX = e.clientX - x;
    const offsetY = e.clientY - y;
    dragOffset.current = { x: offsetX, y: offsetY };
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  function handleMouseMove(e: MouseEvent) {
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    onMove(id, newX, newY);
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className="absolute cursor-grab" style={{ left: x, top: y, width: 'max-content' }} onMouseDown={handleMouseDown}>
      {children}
    </div >
  )
}

export default DraggableElement
