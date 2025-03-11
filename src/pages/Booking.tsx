import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { TimeSlot } from '../types';
import { Calendar, User, Phone } from 'lucide-react';

interface AvailableSlot {
    hora: string;
    disponivel: boolean;
}

const servicos: Record<string, string> = {
    "1": "Corte Masculino",
    "2": "Barba Simples",
    "3": "Corte Masculino + Barba Simples"
};

const Booking: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientName, setClientName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos/disponiveis?data=${selectedDate}`);
                const data: AvailableSlot[] = await response.json();
        
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendamento)
            });            

            if (response.ok) {
                setMessage('✅ Agendamento realizado com sucesso!');
                setSelectedTime(null);
                setClientName('');
                setPhone('');
            } else {
                setMessage('⛔ Horário já reservado ou erro ao agendar.');
            }
        } catch (error) {
            setMessage('⚠️ Erro de conexão com o servidor.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Agendar Horário</h1>
            
            <div className="mb-4">
                <label className="block font-semibold mb-1">Data:</label>
                <div className="flex items-center border p-2 rounded-md">
                    <Calendar className="mr-2" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full outline-none"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Horários Disponíveis:</label>
                <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                        <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-3 border rounded-md transition-all ${selectedTime === slot.time ? 'bg-blue-500 text-white' : 'bg-gray-200'} ${!slot.available ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-300'}`}
                        >
                            {slot.time}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Nome:</label>
                <div className="flex items-center border p-2 rounded-md">
                    <User className="mr-2" />
                    <input
                        type="text"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="w-full outline-none"
                        placeholder="Digite seu nome"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Telefone:</label>
                <div className="flex items-center border p-2 rounded-md">
                    <Phone className="mr-2" />
                    <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full outline-none"
                        placeholder="Digite seu telefone"
                    />
                </div>
            </div>

            <button
                onClick={handleBooking}
                className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-all"
            >
                Confirmar Agendamento
            </button>

            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
    );
};

export default Booking;