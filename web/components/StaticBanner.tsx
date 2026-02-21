const StaticBanner = () => {
  return (
    <div className="flex flex-col items-start justify-start p-4 py-8 gap-8 min-h-[85vh]">
      <h1 className="text-7xl max-w-md">Bem-vindo ao Building Club.</h1>
      <button className="p-2 border-gray-300 border-2 rounded-lg">
        Entrar no modo de edição
      </button>
    </div>
  );
};

export default StaticBanner;
