const Navbar = () => {
  const bc = "> building_club"
  return (
    <div className="flex w-11/12 sm:w-4/5 md:w-3/5 my-2 sm:my-4 gap-2 px-3 sm:px-4 p-2 border-zinc-800 border-1 rounded-sm bg-white items-center mx-auto border-2">
      <a href="#" className="flex-1 font-space-mono text-xs sm:text-sm">{bc}</a>
      <a className="font-space-mono text-gray-900 text-xs sm:text-sm" href="#">contato</a>
    </div>
  );
};

export default Navbar;
