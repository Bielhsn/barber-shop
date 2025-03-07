import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { TimeSlot } from '../types';

// Tipo para os dados retornados da API
interface AvailableSlot {
    hora: string;
    disponivel: boolean;
}

const servicos: Record<string, string> = {
  "1": "Classic Haircut",
  "2": "Beard Trim",
  "3": "Complete Package"
}


const Booking: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientName, setClientName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    // Buscar horários disponíveis sempre que a data mudar
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`http://localhost:8080/agendamentos/disponiveis?data=${selectedDate}`);
                const data: AvailableSlot[] = await response.json();
                
                // Adaptar para o formato do componente
                const slots = data.map(slot => ({
                    time: slot.hora,
                    available: slot.disponivel
                }));

                setTimeSlots(slots);
            } catch (error) {
                console.error('Erro ao buscar horários:', error);
                setMessage('Erro ao buscar horários disponíveis.');
            }
        };

        fetchAvailableSlots();
    }, [selectedDate]);

    // Função para enviar o agendamento ao backend
    const handleBooking = async () => {
        if (!selectedTime || !clientName || !phone) {
            setMessage('Preencha todos os campos.');
            return;
        }

        const agendamento = {
          nome: clientName,
          telefone: phone,
          data: selectedDate,
          hora: selectedTime,
          servico: servicos[String(serviceId)]
      };
      

        try {
            const response = await fetch('http://localhost:8080/agendamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendamento)
            });

            if (response.ok) {
                setMessage('Agendamento realizado com sucesso!');
                setSelectedTime(null);
                setClientName('');
                setPhone('');
            } else {
                setMessage('Horário já reservado ou erro ao agendar.');
            }
        } catch (error) {
            setMessage('Erro de conexão com o servidor.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Agendar Horário</h1>

            <label>Data:</label>
            <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="border p-2 w-full mb-4"
            />

            <label>Horários Disponíveis:</label>
            <div className="flex flex-wrap gap-2 mb-4">
                {timeSlots.map(slot => (
                    <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 border ${selectedTime === slot.time ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>

            <label>Nome:</label>
            <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="border p-2 w-full mb-4"
            />

            <label>Telefone:</label>
            <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="border p-2 w-full mb-4"
            />

            <button
                onClick={handleBooking}
                className="bg-green-500 text-white p-2 w-full"
            >
                Confirmar Agendamento
            </button>

            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default Booking;