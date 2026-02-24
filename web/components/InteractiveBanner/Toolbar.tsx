import { motion } from "motion/react";
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

const Toolbar = ({
  xPercent,
  yPx,
  width,
  type,
  onMouseDown,
  onGrayscaleWasm,
  onGrayscaleJS,
  onSepiaWasm,
  onSepiaJS,
  onInvertWasm,
  onInvertJS,
  onBlurWasm,
  onBlurJS,
  onReset,
}: ToolbarProps) => {
  const buttonClass =
    "cursor-pointer rounded-lg p-2 text-left block w-full transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-[1.03] hover:bg-gray-100";

  return (
    <div
      className="absolute bg-white rounded-lg z-50 shadow-lg"
      style={{
        left: `${xPercent}%`,
        top: `${yPx}px`,
        transform: `translateX(calc(${width}px / 2 + 15px))`,
      }}
      onMouseDown={onMouseDown}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col bg-white border-1 border-gray-200 p-1 rounded-lg text-[10px] font-space-mono gap-1"
      >
        {type === "IMG" && (
          <>
            <div>
              <button className={buttonClass} onClick={onGrayscaleWasm}>
                Grayscale{" "}
                <SiWebassembly className="inline text-indigo-600 ml-1" />
              </button>
              <button className={buttonClass} onClick={onGrayscaleJS}>
                Grayscale{" "}
                <SiJavascript className="inline text-yellow-400 ml-1" />
              </button>
            </div>

            <hr className="border-gray-100" />

            <div>
              <button className={buttonClass} onClick={onSepiaWasm}>
                Sepia <SiWebassembly className="inline text-indigo-600 ml-1" />
              </button>
              <button className={buttonClass} onClick={onSepiaJS}>
                Sepia <SiJavascript className="inline text-yellow-400 ml-1" />
              </button>
            </div>

            <hr className="border-gray-100" />

            <div>
              <button className={buttonClass} onClick={onInvertWasm}>
                Invert <SiWebassembly className="inline text-indigo-600 ml-1" />
              </button>
              <button className={buttonClass} onClick={onInvertJS}>
                Invert <SiJavascript className="inline text-yellow-400 ml-1" />
              </button>
            </div>

            <hr className="border-gray-100" />

            <div>
              <button className={buttonClass} onClick={onBlurWasm}>
                Blur <SiWebassembly className="inline text-indigo-600 ml-1" />
              </button>
              <button className={buttonClass} onClick={onBlurJS}>
                Blur <SiJavascript className="inline text-yellow-400 ml-1" />
              </button>
            </div>

            <hr className="border-gray-100" />

            <button className={buttonClass} onClick={onReset}>
              Default
            </button>
          </>
        )}

        {type === "TEXT" && <button className={buttonClass}>Delete</button>}
      </motion.div>
    </div>
  );
};

export default Toolbar;
