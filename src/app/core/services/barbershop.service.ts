import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { ServicoResponse } from '../models/servico.model';
import { UsuarioResponse } from '../models/usuario.model';
import { ApiStatus } from '../models/api-status.model';
import { AgendamentoRequest, AgendamentoResponse } from '../models/agendamento.model';

@Injectable({
  providedIn: 'root'
})
export class BarbershopService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  // Signals para estado reativo moderno no Angular 18
  apiStatus = signal<ApiStatus | null>(null);
  apiOnline = signal<boolean>(false);
  loadingStatus = signal<boolean>(false);

  checkApiHealth(): Observable<ApiStatus | null> {
    this.loadingStatus.set(true);
    return this.http.get<ApiStatus>(`${this.baseUrl}/status`).pipe(
      tap((status) => {
        this.apiStatus.set(status);
        this.apiOnline.set(true);
        this.loadingStatus.set(false);
      }),
      catchError((error) => {
        console.warn('API offline ou inacessível no momento:', error.message);
        this.apiStatus.set(null);
        this.apiOnline.set(false);
        this.loadingStatus.set(false);
        return of(null);
      })
    );
  }

  // Dados mockados elegantes caso a API ainda não tenha os dados populados
  getServicos(): Observable<ServicoResponse[]> {
    return of([
      { id: 1, nome: 'Corte Clássico Masculino', descricao: 'Degradê na tesoura ou máquina, acabamento refinado com navalha e lavagem.', preco: 45.00, duracaoMinutos: 35, ativo: true },
      { id: 2, nome: 'Barba Terapia Completa', descricao: 'Toalha quente, óleos essenciais, massagem facial e alinhamento impecável.', preco: 40.00, duracaoMinutos: 30, ativo: true },
      { id: 3, nome: 'Combo Supremo (Corte + Barba)', descricao: 'O pacote completo para renovar o visual com direito a toalha quente e pós-barba.', preco: 75.00, duracaoMinutos: 60, ativo: true },
      { id: 4, nome: 'Acabamento & Pezinho', descricao: 'Alinhamento rápido dos contornos e nuca para manter o corte em dia.', preco: 25.00, duracaoMinutos: 20, ativo: true }
    ]);
  }

  getBarbeiros(): Observable<UsuarioResponse[]> {
    return of([
      { id: 1, nome: 'Carlos "Mão de Tesoura"', email: 'carlos@barbershop.com', telefone: '11988887777', role: 'ROLE_BARBEIRO', ativo: true, criadoEm: '2026-01-10T10:00:00Z' },
      { id: 2, nome: 'Felipe "Fade Master"', email: 'felipe@barbershop.com', telefone: '11977776666', role: 'ROLE_BARBEIRO', ativo: true, criadoEm: '2026-02-15T10:00:00Z' },
      { id: 3, nome: 'Lucas "Navalha de Ouro"', email: 'lucas@barbershop.com', telefone: '11966665555', role: 'ROLE_BARBEIRO', ativo: true, criadoEm: '2026-03-01T10:00:00Z' }
    ]);
  }

  criarAgendamento(request: AgendamentoRequest): Observable<AgendamentoResponse> {
    // Retorno reativo simulando a resposta do endpoint do Spring Boot
    const response: AgendamentoResponse = {
      id: Math.floor(Math.random() * 1000) + 1,
      clienteId: 99,
      clienteNome: request.clienteNome,
      barbeiroId: request.barbeiroId,
      barbeiroNome: 'Barbeiro Selecionado',
      servicoId: request.servicoId,
      servicoNome: 'Serviço Selecionado',
      dataHoraInicio: request.dataHoraInicio,
      dataHoraFim: request.dataHoraInicio,
      status: 'PENDENTE',
      observacao: request.observacao,
      criadoEm: new Date().toISOString()
    };
    return of(response);
  }
}
