import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { TimeSlot } from '../types';
import { Calendar, User, Phone, Scissors, CreditCard, Clipboard } from 'lucide-react';

interface AvailableSlot {
    hora: string;
    disponivel: boolean;
}

const servicos: Record<string, { nome: string; preco: number }> = {
    "1": { nome: "Corte Masculino", preco: 40 },
    "2": { nome: "Barba Simples", preco: 40 },
    "3": { nome: "Corte Masculino + Barba Simples", preco: 60 }
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
    const [valorPix, setValorPix] = useState<number>(20); // 🔹 Valor de 50% do serviço
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [pixUrl, setPixUrl] = useState<string | null>(null);
    const [isPaid, setIsPaid] = useState(false); // 🔹 Estado do pagamento
    const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

    // Buscar horários disponíveis
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedBarber) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos/disponiveis?data=${selectedDate}&barbeiro=${selectedBarber}`);
                const data: AvailableSlot[] = await response.json();

                const slots = data.map(slot => ({
                    time: slot.hora,
                    available: slot.disponivel
                }));

                setTimeSlots(slots);
            } catch (error) {
                setMessage('Erro ao buscar horários disponíveis.');
            }
        };
        fetchAvailableSlots();
    }, [selectedDate, selectedBarber]);

    useEffect(() => {
        const verificarPagamento = async () => {
            if (!phone) return;
    
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos/verificar-pagamento?telefone=${phone}`);
                const data = await response.json();
    
                if (response.ok && data.pago) {
                    console.log("✅ Pagamento confirmado no banco.");
                    setIsPaid(true);
                    setMessage("✅ Pagamento confirmado! Agora você pode agendar.");
                } else {
                    console.log("🚨 Pagamento ainda não confirmado.");
                    setIsPaid(false);
                    setMessage("");
                }
            } catch (error) {
                console.error("Erro ao verificar pagamento:", error);
                setIsPaid(false);
                setMessage("");
            }
        };
    
        // 🔹 Verifica o pagamento a cada 10 segundos
        const interval = setInterval(verificarPagamento, 10000);
    
        return () => clearInterval(interval);
    }, [phone]);            

    // Função para gerar PIX via Mercado Pago
    const handlePixPayment = async () => {
        if (!selectedTime || !clientName || !phone || !selectedBarber) {
            setMessage('Preencha todos os campos antes de pagar.');
            return;
        }
    
        const servicoSelecionado = servicos[String(serviceId)];
        if (!servicoSelecionado) {
            setMessage('Erro ao identificar o serviço.');
            return;
        }
    
        const valorMetade = servicoSelecionado.preco / 2;
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gerar-pix`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor: valorMetade, telefone: phone })
            });
    
            const pixData = await response.json();
            setPixCode(pixData.qrImage);
            setPixUrl(pixData.qrCode);
            setMessage("Pagamento pendente. Escaneie o QR Code para pagar.");
        } catch (error) {
            setMessage('⚠️ Erro ao gerar PIX.');
        }
    };

    // Copiar código PIX
    const handleCopyPix = () => {
        if (pixCode) {
            navigator.clipboard.writeText(pixCode);
            setMessage("Código PIX copiado!");
        }
    };

    // Função para confirmar agendamento após o pagamento
    const handleBooking = async () => {
        if (!isPaid) {
            setMessage('⚠️ Você precisa pagar antes de confirmar o agendamento.');
            return;
        }
    
        if (!selectedBarber) {
            setMessage('⚠️ Escolha um barbeiro antes de confirmar o agendamento.');
            return;
        }
    
        const agendamento = {
            nome: clientName,
            telefone: phone,
            data: selectedDate,
            hora: selectedTime,
            servico: servicos[String(serviceId)].nome, // 🔹 Pegando apenas o nome do serviço
            barbeiro: selectedBarber, // 🔹 Garantindo que o barbeiro está sendo enviado
        };
    
        console.log("📨 Enviando agendamento:", agendamento); // 🔹 Debug
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/agendamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendamento),
            });
    
            if (response.ok) {
                setMessage('✅ Agendamento confirmado com sucesso!');
            } else {
                setMessage('⛔ Horário já reservado ou erro ao agendar.');
            }
        } catch (error) {
            setMessage('⚠️ Erro de conexão com o servidor.');
        }
    };       

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4 text-[#d9a371]">Agendar Horário</h1>

            {/* Seleção de barbeiro */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Escolha o barbeiro:</label>
                <div className="flex items-center border p-2 rounded-md">
                    <Scissors className="mr-2 text-[#d9a371]" />
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

            {/* Nome e telefone */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Nome:</label>
                <div className="flex items-center border p-2 rounded-md">
                    <User className="mr-2 text-[#d9a371]" />
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
                    <Phone className="mr-2 text-[#d9a371]" />
                    <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full outline-none"
                        placeholder="Digite seu telefone"
                    />
                </div>
            </div>

            {/* Seleção de data */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Data:</label>
                <div className="flex items-center border p-2 rounded-md">
                    <Calendar className="mr-2 text-[#d9a371]" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full outline-none"
                    />
                </div>
            </div>

            {/* Exibição dos horários disponíveis */}
            <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot, index) => (
                    <button
                        key={index}
                        className={`p-2 border rounded-md ${
                            slot.available
                                ? selectedTime === slot.time
                                    ? "bg-blue-400 text-white"
                                    : "bg-green-200 hover:bg-green-300"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>

            {/* QR Code e código PIX */}
            {pixCode && (
    <div className="flex flex-col items-center mt-4">
        <img src={`data:image/png;base64,${pixCode}`} alt="QR Code PIX" className="w-40 h-40" />
        <p className="mt-2">QR Code PIX</p>
    </div>
)}

{!isPaid ? (
    <button onClick={handlePixPayment} className="w-full bg-yellow-500 text-white py-3 mt-4 rounded-md font-semibold">
        Pagar 50% via PIX
    </button>
) : (
    <button onClick={handleBooking} className="w-full bg-green-500 text-white py-3 mt-4 rounded-md font-semibold">
        Confirmar Agendamento
    </button>
)}

{message && <p className="mt-4 text-center text-red-500">{message}</p>}

        </div>
    );
};

export default Booking;
