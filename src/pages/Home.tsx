import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Users, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";
import barber1 from "../img/barbearia1.png";
import barber2 from "../img/barbearia2.png";
import barber3 from "../img/barbearia3.png";
import barber4 from "../img/barbearia4.png";
import barber5 from "../img/barbearia5.png";
import barber6 from "../img/barbearia6.png";

export default function Home() {

  const services = [
    {
      icon: <Scissors size={40} className="text-[#d9a371] mb-4" />,
      title: "Corte Masculino",
      description: "Cortes modernos e tradicionais para todos os estilos."
    },
    {
      icon: <Users size={40} className="text-[#d9a371] mb-4" />,
      title: "Barba",
      description: "Modelagem e alinhamento para uma barba impecável."
    },
    {
      icon: <Sparkles size={40} className="text-[#d9a371] mb-4" />,
      title: "Corte + Barba",
      description: "Pacote completo para um visual renovado e sofisticado."
    },
  ];

  const images = [barber1, barber2, barber3, barber4, barber5, barber6];

  return (
    <div>
      {/* Banner de Apresentação */}
      <div
        className="h-[600px] bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: 'url("/src/img/banner.jpg")' }} // Substitua pela URL correta
      >
        <div className="absolute inset-0 bg-black/50"></div> {/* Camada escura para contraste */}

        <div className="relative text-center text-white px-6">
          <h1 className="text-5xl font-bold mb-4 text-[#d9a371]">Barbearia Barcellona</h1>
          <p className="text-xl mb-6">
            Estilo e precisão para o seu melhor visual.
          </p>
          <Link
            to="/services"
            className="bg-white text-black px-8 py-3 rounded-md font-semibold text-lg 
      shadow-lg transition-transform transform hover:scale-105 hover:bg-[#d9a371]"
          >
            Agendar Agora
          </Link>
        </div>
      </div>


      {/* Seção Sobre a Barbearia */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Texto da seção */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-[#d9a371]">Sobre a Barbearia Barcellona</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nossa barbearia oferece uma experiência única e sofisticada, combinando tradição com as últimas tendências do mercado.
              Profissionais altamente qualificados garantem que você saia com o melhor corte e barba possíveis.
            </p>
            <a href="https://wa.me/5511966526732" target="_blank" rel="noreferrer">
              <button className="mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md 
        transition-transform transform hover:scale-105 hover:bg-[#d9a371]">
                Entre em Contato
              </button>
            </a>

          </motion.div>

          {/* Imagem com efeito */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/src/img/logo_barcellona_transparente.png"
              alt="Sobre a Barbearia"
              className="rounded-lg w-100 h-80 ml-60 mr-40 transform transition-transform hover:scale-105"
            />
          </motion.div>
        </div>
      </section>

      {/* Seção de Serviços */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform 
                hover:scale-105 hover:shadow-xl cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {service.icon}
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria de Fotos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Galeria</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {images.map((img, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden rounded-3xl shadow-md cursor-pointer flex items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={img}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-[550px] object-cover rounded-3xl"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Nosso Local</h2>
          <p className="text-gray-600 mb-8">Venha nos visitar! Estamos esperando por você.</p>
          <div className="w-full flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.1074883462907!2d-46.5997911236884!3d-23.492637578847184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef6014bc28aa7%3A0x9d0206786b3c6e4d!2sAv.%20J%C3%BAlio%20Buono%2C%20686%20-%20Vila%20Gustavo%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002201-000!5e0!3m2!1spt-BR!2sbr!4v1741708505354!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: "0", borderRadius: "15px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="shadow-lg max-w-4xl"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
