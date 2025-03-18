import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/services';

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#d9a371]">Agende conosco!</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}