import { motion } from "motion/react";
import { useRef } from "react";

interface Props {
  id: string;
  x: number;
  y: number;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const DraggableElement = ({
  id,
  x,
  y,
  onMove,
  children,
  containerRef,
  isSelected,
  onSelect,
}: Props) => {
  const dragOffset = useRef({ x: 0, y: 0 });
  const elementSize = useRef({ width: 0, height: 0 });

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    onSelect?.(id);

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

    const newX =
      ((newPixelLeft - rect.left + elementSize.current.width / 2) /
        rect.width) *
      100;
    const newY = ((newPixelTop - rect.top) / rect.height) * 100;
    onMove(id, newX, newY);
  }

  function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  return (
    <motion.div
      className="absolute cursor-grab w-max h-max"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translateX(-50%)" }}
      animate={
        isSelected
          ? { boxShadow: "0 0 0 2px #3b82f6, 0 0 0 3px rgba(59,130,246,0.2)" }
          : { boxShadow: "0 0 0 0px #3b82f6, 0 0 0 0px rgba(59,130,246,0.0)" }
      }
      transition={{ duration: 0.10, ease: "easeInOut" }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </motion.div>
  );
};

export default DraggableElement;
