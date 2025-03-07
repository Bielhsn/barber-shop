// Tipo para cada horário
export interface TimeSlot {
  time: string;
  available: boolean;
}

// Tipo para o agendamento completo
export interface Agendamento {
  nome: string;
  telefone: string;
  data: string;  // formato: 'YYYY-MM-DD'
  hora: string;   // formato: 'HH:mm'
  servico: string;
}
