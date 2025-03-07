import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <div 
        className="h-[600px] bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&q=80&w=2000')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex justify-center mb-4">
              <Scissors className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Elite Cuts</h1>
            <p className="text-xl mb-8">Experience the art of premium grooming</p>
            <Link
              to="/services"
              className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Elite Cuts?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Expert Barbers</h3>
              <p className="text-gray-600">Our skilled professionals bring years of experience to every cut</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Premium Service</h3>
              <p className="text-gray-600">Enjoy a luxurious experience in our modern facility</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book your appointment online with just a few clicks</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}