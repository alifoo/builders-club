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
  const elementSize = useRef({ width: 0, height: 0 });

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    const elRect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - elRect.left,
      y: e.clientY - elRect.top,
    };
    elementSize.current = {
      width: elRect.width,
      height: elRect.height,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newPixelLeft = e.clientX - dragOffset.current.x;
    const newPixelTop = e.clientY - dragOffset.current.y;

    // Add back half the element width to account for translateX(-50%)
    const newX =
      ((newPixelLeft - rect.left + elementSize.current.width / 2) /
        rect.width) *
      100;
    const newY =
      ((newPixelTop - rect.top) / rect.height) * 100;
    onMove(id, newX, newY);
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <div
      className="absolute cursor-grab w-max h-max"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translateX(-50%)', ...style }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default DraggableElement;
