import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { Clock, DollarSign } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={service.image} 
        alt={service.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        
        <div className="flex items-center text-gray-700 mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>{service.duration} min</span>
        </div>

        {/* Preços exibindo ambas opções */}
        <div className="text-gray-700 mb-4">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>R${service.priceWeek}</span>
          </div>
        </div>

        {/* <button
          onClick={() => navigate(`/booking/${service.id}`)}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-[#d9a371] transition-colors"
        >
          Agendar Agora
        </button> */}
      </div>
    </div>
  );
}
