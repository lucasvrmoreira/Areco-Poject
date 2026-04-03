import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LADO ESQUERDO: LOGO DISCRETO */}
        <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <img 
            src="/logo.png" 
            alt="Areco Logo" 
            className="h-6 w-auto grayscale" 
          />
          <span className="text-sm font-bold text-gray-600">
            Areco <span className="text-blue-600">IA</span>
          </span>
        </div>

        {/* CENTRO: COPYRIGHT */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} — Desafio Técnico: Interface de Inteligência de Dados
          </p>
        </div>

        {/* LADO DIREITO: SEU NOME */}
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            Desenvolvido por Lucas Moreira
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;