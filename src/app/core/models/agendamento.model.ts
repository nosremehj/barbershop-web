export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

export interface AgendamentoRequest {
  barbeiroId: number;
  servicoId: number;
  dataHoraInicio: string; // ISO string
  observacao?: string;
  clienteNome: string;
  clienteTelefone: string;
}

export interface AgendamentoResponse {
  id: number;
  clienteId: number;
  clienteNome: string;
  barbeiroId: number;
  barbeiroNome: string;
  servicoId: number;
  servicoNome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: StatusAgendamento;
  observacao?: string;
  criadoEm: string;
}
