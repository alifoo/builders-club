import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuCircleHelp } from "react-icons/lu";

const Navbar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const bc = "> building_club";

  return (
    <div className="flex w-70 xs:w-96 sm:w-120 md:w-120 lg:w-170 gap-2 px-3 sm:px-4 p-2 border-gray-200 border-1 rounded-sm bg-white items-center mx-auto border-2">
      <a href="#" className="flex-1 font-space-mono text-xs [word-spacing:-0.3em]">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-fit bg-black text-white text-xs p-2 rounded-sm font-space-mono transition-colors delay-150 duration-200 ease-in-out hover:bg-zinc-900 border-b-6 border-x-2 border-transparent hover:border-zinc-800"
        >
          {bc}
        </motion.div>
      </a>

      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <LuCircleHelp className="text-gray-500 text-lg cursor-pointer hover:text-gray-700 transition-colors duration-200" />

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 z-50"
            >
              <div className="absolute -top-1 right-2 w-2 h-2 bg-white border-t border-l border-gray-200 rotate-45" />

              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48 font-space-mono text-[10px] text-gray-600 leading-relaxed">
                <p className="font-bold text-gray-800 mb-1">o que é isso?</p>
                <p>
                  um playground para experimentar com React e WASM. estamos na demo do React CWB!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
