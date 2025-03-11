import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-[#2c2c2c] text-gray-300 py-6 shadow-inner">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-200">
          <span className="text-xl font-bold">LM Barbearia</span>
        </Link>
        <div className="flex space-x-6">
          <Link 
            to="/" 
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Início
          </Link>
          <Link 
            to="/services" 
            className="hover:text-blue-400 transition-colors duration-200"
          >
            Serviços
          </Link>
        </div>
      </div>
    </nav>
  );
}
