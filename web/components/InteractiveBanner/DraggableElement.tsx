import { useRef } from "react";

interface Props {
  id: string;
  x: number;
  y: number;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
}

const DraggableElement = ({
  id,
  x,
  y,
  onMove,
  children,
  containerRef,
  style
}: Props) => {
  const dragOffset = useRef({ x: 0, y: 0 });

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const elementPixelX = rect.left + (x / 100) * rect.width;
    const elementPixelY = rect.top + (y / 100) * rect.height;

    dragOffset.current = {
      x: e.clientX - elementPixelX,
      y: e.clientY - elementPixelY,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newX =
      ((e.clientX - dragOffset.current.x - rect.left) / rect.width) * 100;
    const newY =
      ((e.clientY - dragOffset.current.y - rect.top) / rect.height) * 100;
    onMove(id, newX, newY);
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div
      className="absolute cursor-grab w-max h-max"
      style={{ left: `${x}%`, top: `${y}%`, ...style }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default DraggableElement;
