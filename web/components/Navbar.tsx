import { motion } from "motion/react";

const Navbar = () => {
  const bc = "> building_club";
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex w-80 sm:w-96 md:w-[600px] lg:w-[700px] gap-2 px-3 sm:px-4 p-2 border-zinc-800 border-1 rounded-sm bg-white items-center mx-auto border-2"
    >
      <a
        href="#"
        className="flex-1 font-space-mono text-xs sm:text-sm [word-spacing:-0.3em]"
      >
        {bc}
      </a>
      <a
        className="font-space-mono text-gray-900 text-xs sm:text-sm [word-spacing:-0.3em]"
        href="#"
      >
        sobre nós
      </a>
      <a className="font-space-mono text-gray-900 text-xs sm:text-sm" href="#">
        contato
      </a>
    </motion.div>
  );
};

export default Navbar;
