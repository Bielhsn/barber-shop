import { Service } from '../types';

export const services: Service[] = [
  {
    id: '1',
    name: 'Corte Masculino',
    description: 'Corte tradicional masculino com tesoura e máquina',
    duration: 30,
    priceWeek: 35, // Preço de terça a quinta
    priceWeekend: 40, // Preço de sexta a domingo
    image: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Barba Simples',
    description: 'Modelagem e corte profissional de barba',
    duration: 20,
    priceWeek: 40,
    priceWeekend: 40,
    image: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: '3',
    name: 'Corte Masculino + Barba Simples',
    description: 'Corte tradicional masculino + Modelagem de barba simples',
    duration: 45,
    priceWeek: 60,
    priceWeekend: 60,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800'
  }
];
