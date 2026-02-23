import { motion } from "motion/react";

interface ToolbarProps {
  xPercent: number;
  yPx: number;
  width: number;
  onMouseDown: (e: React.MouseEvent) => void;
}

const Toolbar = ({ xPercent, yPx, width, onMouseDown }: ToolbarProps) => {
  return (
    <div
      className="absolute bg-white rounded-lg z-50"
      style={{ left: `${xPercent}%`, top: `${yPx}px`, transform: `translateX(calc(${width}px / 2 + 15px))` }}
      onMouseDown={onMouseDown}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col bg-white border-1 border-gray-200 p-1 rounded-xl text-[10px] font-space-mono"
      >
        <button className="hover:bg-gray-100 rounded-lg p-2">Color</button>
        <button className="hover:bg-gray-100 rounded-lg p-2">Grayscale</button>
      </motion.div>
    </div>
  );
}

export default Toolbar
