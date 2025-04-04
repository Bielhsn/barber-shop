import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { TimeSlot } from '../types';
import { Calendar, User, Phone, Scissors } from 'lucide-react';
import leandroPix from '../../public/img/leandro-pix.png';
import vitorPix from '../../public/img/vitor-pix.png';
import leandroPix30 from '../../public/img/leandro-pix-30.png';
import vitorPix30 from '../../public/img/vitor-pix-30.png';

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
    const [loading, setLoading] = useState(true); // 🔹 Bloqueia o botão no início
    const [pixCode, setPixCode] = useState<string | null>(null);

    // **🔹 Obtém o código PIX estático**
    const pixCodigos: Record<string, string> = {
        "leandro-20": "00020126360014BR.GOV.BCB.PIX0114+5511966526732520400005303986540520.005802BR5907Leandro6009Sao paulo62170513PAGAMENTO123D6304FA9F",
        "leandro-30": "00020126360014BR.GOV.BCB.PIX0114+5511966526732520400005303986540530.005802BR5907Leandro6009Sao paulo62170513PAGAMENTO123D630441D0",
        "vitor-20": "00020126360014BR.GOV.BCB.PIX0114+5583998017216520400005303986540520.005802BR5905Vitor6009Sao paulo62170513PAGAMENTO123D63040C14",
        "vitor-30": "00020126350014BR.GOV.BCB.PIX0113+558398017216520400005303986540530.005802BR5905Vitor6009Sao paulo62170513PAGAMENTO123D63044BB4"
    };

    const getPixImage = () => {
        if (!selectedBarber || !serviceId) return null;

        const servicoSelecionado = servicos[String(serviceId)];
        if (!servicoSelecionado) return null;

        const valorMetade = servicoSelecionado.preco / 2;
        return selectedBarber === "Leandro" ? (valorMetade === 20 ? leandroPix : leandroPix30) : (valorMetade === 20 ? vitorPix : vitorPix30);
    };

    const getPixCodigo = () => {
        if (!selectedBarber || !serviceId) return null;
        const servicoSelecionado = servicos[String(serviceId)];
        if (!servicoSelecionado) return null;

        const valorMetade = servicoSelecionado.preco / 2;
        const chave = `${selectedBarber.toLowerCase()}-${valorMetade}`;
        return pixCodigos[chave] || null;
    };

    const handleCopyPixCodigo = () => {
        const codigo = getPixCodigo();
        if (codigo) {
            navigator.clipboard.writeText(codigo);
            setMessage("✅ Código PIX copiado com sucesso!");
        } else {
            setMessage("⚠️ Nenhum código PIX disponível.");
        }
    };

    // **🔹 Inicia a contagem de 20 segundos ao selecionar um barbeiro**
    useEffect(() => {
        if (selectedBarber) {
            console.log("⏳ Iniciando contagem de 20 segundos...");
            setLoading(true);

            const timer = setTimeout(() => {
                console.log("✅ Tempo expirado! Liberando botão.");
                setLoading(false); // 🔹 Libera o botão automaticamente após 20s
            }, 20000);

            return () => clearTimeout(timer); // 🔹 Evita bugs se o usuário mudar de página
        }
    }, [selectedBarber]); // 🔹 O efeito roda sempre que um barbeiro for selecionado

    // **🔹 Buscar horários disponíveis**
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

    const confirmarAgendamento = async () => {
        if (!clientName || !phone || !selectedBarber || !selectedTime || !selectedDate) {
            setMessage("⚠️ Preencha todos os campos antes de confirmar.");
            return;
        }
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/confirmar-agendamento`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: clientName,
                    telefone: phone,
                    data: selectedDate,
                    hora: selectedTime,
                    servico: servicos[String(serviceId)]?.nome || "Serviço desconhecido",
                    barbeiro: selectedBarber,
                    pago: false
                })
            });
    
            if (response.ok) {
                setMessage("✅ Agendamento salvo com sucesso!");
            } else {
                setMessage("❌ Erro ao confirmar agendamento.");
            }
        } catch (error) {
            console.error("❌ Erro ao conectar com o backend:", error);
            setMessage("❌ Erro de conexão com o servidor.");
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
                        className={`p-2 border rounded-md ${slot.available
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

            {/* QR Code PIX e código dentro do card */}
            {selectedBarber && serviceId && (
                <div className="flex flex-col items-center mt-4 bg-gray-100 p-4 rounded-lg shadow-md w-full">
                    <img src={getPixImage()} alt="QR Code Pix" className="w-40 h-40" />
                    <p className="mt-2 text-gray-700 font-semibold">Escaneie para pagar</p>

                    {/* Código Pix dentro do card */}
                    <div className="w-full bg-gray-200 p-3 rounded-md mt-2 text-center text-gray-800 font-mono text-sm break-words">
                        {getPixCodigo()}
                    </div>

                    {/* Botão para copiar código Pix */}
                    <button
                        onClick={handleCopyPixCodigo}
                        className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-md font-semibold hover:bg-blue-600 w-full"
                    >
                        Copiar Código PIX
                    </button>
                </div>
            )}

            {/* Botão de confirmar agendamento */}
            <button
                onClick={confirmarAgendamento}
                className={`w-full py-3 mt-4 rounded-md font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                disabled={loading} // 🔹 Fica bloqueado por 20 segundos
            >
                Confirmar Agendamento
            </button>

            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
    );
};

export default Booking;