import { motion } from "motion/react";
import { useState } from "react";
import { SiWebassembly, SiJavascript } from "react-icons/si";

interface ToolbarProps {
  xPercent: number;
  yPx: number;
  width: number;
  type: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onGrayscaleWasm: () => void;
  onGrayscaleJS: () => void;
  onSepiaWasm: () => void;
  onSepiaJS: () => void;
  onInvertWasm: () => void;
  onInvertJS: () => void;
  onBlurWasm: () => void;
  onBlurJS: () => void;
  onReset: () => void;
}

const Toolbar = ({ xPercent, yPx, width, type, onMouseDown, onGrayscaleWasm, onGrayscaleJS, onSepiaWasm, onSepiaJS, onInvertWasm, onInvertJS, onBlurWasm, onBlurJS, onReset }: ToolbarProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const imgButtons = [
    { label: "Grayscale", onClickWasm: onGrayscaleWasm, onClickJS: onGrayscaleJS },
    { label: "Sepia", onClickWasm: onSepiaWasm, onClickJS: onSepiaJS },
    { label: "Invert", onClickWasm: onInvertWasm, onClickJS: onInvertJS },
    { label: "Blur", onClickWasm: onBlurWasm, onClickJS: onBlurJS },
  ];

  const hoverClass = "transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-103 bg-gray-100";
  let buttonIndex = 0;

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
          {imgButtons.map(({ label, onClickWasm, onClickJS }) => {
            const wasmIdx = buttonIndex++;
            const jsIdx = buttonIndex++;
            return (
              <div key={label}>
                <button className={`${activeIndex === wasmIdx ? hoverClass : ""} rounded-lg p-2 text-left block`} onMouseOver={() => setActiveIndex(wasmIdx)} onClick={onClickWasm}>{label} <SiWebassembly className="inline text-indigo-600" /></button>
                <button className={`${activeIndex === jsIdx ? hoverClass : ""} rounded-lg p-2 text-left block`} onMouseOver={() => setActiveIndex(jsIdx)} onClick={onClickJS}>{label} <SiJavascript className="inline text-yellow-400" /></button>
              </div>
            );
          })}
          <button className={`${activeIndex === buttonIndex ? hoverClass : ""} rounded-lg p-2 text-left block`} onMouseOver={() => setActiveIndex(buttonIndex)} onClick={onReset}>Restore default</button>
        </>}
        {type === "TEXT" && <>
          <button className={`${activeIndex === 0 ? hoverClass : ""} rounded-lg p-2 text-left block`} onMouseOver={() => setActiveIndex(0)}>Delete</button>
        </>}
      </motion.div>
    </div>
  );
}

export default Toolbar

