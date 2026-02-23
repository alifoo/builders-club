import { motion } from "motion/react";
import { useState } from "react";
import { SiWebassembly, SiJavascript } from "react-icons/si";

interface ToolbarProps {
  xPercent: number;
  yPx: number;
  width: number;
  type: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onGrayscale: () => void;
  onReset: () => void;
}

const Toolbar = ({ xPercent, yPx, width, type, onMouseDown, onGrayscale, onReset }: ToolbarProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
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
        {type === "IMG" && <>
          <button className={`${activeIndex === 0 ? "transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-103 bg-gray-100" : ""} rounded-lg p-2`} onMouseOver={() => setActiveIndex(0)} onClick={onGrayscale}>Grayscale <SiWebassembly className="inline text-indigo-600" /></button>
          <button className={`${activeIndex === 1 ? "transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-103 bg-gray-100" : ""} rounded-lg p-2`} onMouseOver={() => setActiveIndex(1)} onClick={onReset}>Color <SiJavascript className="inline text-yellow-400" /></button>
          <button className={`${activeIndex === 2 ? "transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-103 bg-gray-100" : ""} rounded-lg p-2`} onMouseOver={() => setActiveIndex(2)}>Sepia <SiWebassembly className="inline text-indigo-600" /></button>
          <button className={`${activeIndex === 3 ? "transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-103 bg-gray-100" : ""} rounded-lg p-2`} onMouseOver={() => setActiveIndex(3)}>Sepia <SiJavascript className="inline text-yellow-400" /></button>
        </>}
        {type === "TEXT" && <>
          <button className={`${activeIndex === 0 ? "transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-103 bg-gray-100" : ""} rounded-lg p-2`} onMouseOver={() => setActiveIndex(0)} onClick={onGrayscale}>Delete</button>
        </>}
      </motion.div>
    </div>
  );
}

export default Toolbar
