import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { TimeSlot } from '../types';
import { Calendar, User, Phone, Scissors } from 'lucide-react';

interface AvailableSlot {
    hora: string;
    disponivel: boolean;
}

const servicos: Record<string, string> = {
    "1": "Corte Masculino",
    "2": "Barba Simples",
    "3": "Corte Masculino + Barba Simples"
};

// Opções fixas de barbeiros
const barbeiros = ["Leandro", "Vitor"];

const Booking: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [clientName, setClientName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [valorPix, setValorPix] = useState<number | null>(null);
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [pixUrl, setPixUrl] = useState<string | null>(null);

    // Função para calcular o preço do serviço considerando a data selecionada
    const calcularPrecoServico = (servico: string, data: string) => {
        const dayOfWeek = new Date(data).getDay();
        if (servico === "Corte Masculino") {
            return dayOfWeek >= 2 && dayOfWeek <= 4 ? 35 : 40;
        } else if (servico === "Barba Simples") {
            return 40;
        } else if (servico === "Corte Masculino + Barba Simples") {
            return 60;
        }
        return 0;
    };

    // Calcula automaticamente 50% do valor do serviço para o Pix
    useEffect(() => {
        if (serviceId) {
            const servicoNome = servicos[String(serviceId)];
            const precoMetade = calcularPrecoServico(servicoNome, selectedDate) / 2;
            setValorPix(precoMetade);
        }
    }, [selectedDate, serviceId]);

    // Buscar horários disponíveis
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedBarber) return; // Se o barbeiro não for escolhido, não faz nada

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos/disponiveis?data=${selectedDate}&barbeiro=${selectedBarber}`);
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
    }, [selectedDate, selectedBarber]); // Agora também depende do barbeiro selecionado


    // Função para confirmar agendamento e gerar QR Code do Pix
    const handleBooking = async () => {
        if (!selectedTime || !clientName || !phone || !selectedBarber) {
            setMessage('Preencha todos os campos.');
            return;
        }

        const agendamento = {
            nome: clientName,
            telefone: phone,
            data: selectedDate,
            hora: selectedTime,
            servico: servicos[String(serviceId)],
            barbeiro: selectedBarber // 🔹 Enviando o barbeiro escolhido
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendamento)
            });

            if (response.ok) {
                const precoMetade = valorPix;

                const pixResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/gerar-pix`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ valor: precoMetade })
                });

                const pixData = await pixResponse.json();
                setPixCode(pixData.qrCode);
                setIsPaying(true);
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
                <label className="block font-semibold mb-1">Escolha o barbeiro:</label>
                <div className="flex items-center border p-2 rounded-md">
                    <Scissors className="mr-2" />
                    <select
                        value={selectedBarber || ""}
                        onChange={e => setSelectedBarber(e.target.value)}
                        className="w-full p-2 border rounded-md outline-none"
                    >
                        <option value="">Selecione um barbeiro</option>
                        {barbeiros.map(barbeiro => (
                            <option key={barbeiro} value={barbeiro}>
                                {barbeiro}
                            </option>
                        ))}
                    </select>
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