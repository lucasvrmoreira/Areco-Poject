import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        
        {/* LADO ESQUERDO: LOGO E NOME */}
        <div className="flex items-center gap-3">
          {/* Aqui chamamos o seu logo que já está na pasta public */}
          <img 
            src="/logo.png" 
            alt="Areco Logo" 
            className="h-9 w-auto object-contain" 
          />
          <span className="text-xl font-semibold text-gray-800">
            Areco <span className="text-blue-600">IA</span>
          </span>
        </div>

        {/* LADO DIREITO: STATUS */}
        <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-2 border border-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Sistema Ativo
        </div>

      </div>
    </nav>
  );
};

export default Navbar;