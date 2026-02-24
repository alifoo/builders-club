import { motion } from "motion/react";

interface BenchmarkPopupProps {
  label: string;
  filterTime: number;
  totalTime: number;
  onClose: () => void;
}

const BenchmarkPopup = ({
  label,
  filterTime,
  totalTime,
  onClose,
}: BenchmarkPopupProps) => {
  const wasmColors = "bg-gradient-to-br from-indigo-200 to-indigo-600";
  const jsColors = "bg-gradient-to-br from-yellow-200 to-yellow-400";

  const colors = label.includes("WASM") ? wasmColors : jsColors;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${colors} fixed bottom-4 left-4 border-2 border-gray-200 text-gray-900 rounded-lg shadow-lg p-4 z-50 min-w-56 font-space-mono`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          x
        </button>
        <p className="font-semibold text-sm mb-2">{label}</p>
        <p className="text-xs text-gray-600">
          Filter: {filterTime.toFixed(2)}ms
        </p>
        <p className="text-xs text-gray-600">Total: {totalTime.toFixed(2)}ms</p>
      </motion.div>
    </>
  );
};

export default BenchmarkPopup;
