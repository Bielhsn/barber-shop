import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-black text-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Scissors className="h-6 w-6" />
          <span className="text-xl font-bold">Elite Cuts</span>
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/services" className="hover:text-gray-300">Services</Link>
        </div>
      </div>
    </nav>
  );
}