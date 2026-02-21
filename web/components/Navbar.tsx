const Navbar = () => {
  const bc = "> building_club"
  return (
    <div className="flex m-4 gap-2 px-4 p-2 border-gray-400 bg-white items-center justify-center mx-auto border-2">
      <a href="#" className="flex-1 font-space-mono text-sm">{bc}</a>
      <a className="font-space-mono text-gray-900 text-sm" href="#">contato</a>
    </div>
  );
};

export default Navbar;
