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

  // Consome endpoint real do Spring Boot com fallback caso a API esteja offline
  getServicos(): Observable<ServicoResponse[]> {
    return this.http.get<ServicoResponse[]>(`${this.baseUrl}/servicos`).pipe(
      catchError(() => {
        console.info('Usando catálogo local de contingência');
        return of([
          { id: 1, nome: 'Corte Clássico Masculino', descricao: 'Degradê na tesoura ou máquina, acabamento refinado com navalha e lavagem com shampoo premium.', preco: 45.00, duracaoMinutos: 35, ativo: true },
          { id: 2, nome: 'Barba Terapia Completa', descricao: 'Toalha quente com óleos essenciais, massagem facial revigorante e alinhamento impecável com navalha.', preco: 40.00, duracaoMinutos: 30, ativo: true },
          { id: 3, nome: 'Combo Supremo (Corte + Barba)', descricao: 'O pacote completo para renovar o visual com direito a toalha quente, alinhamento total e pós-barba importado.', preco: 75.00, duracaoMinutos: 60, ativo: true },
          { id: 4, nome: 'Acabamento & Pezinho', descricao: 'Alinhamento rápido dos contornos, nuca e costeletas na navalha para manter o corte em dia.', preco: 25.00, duracaoMinutos: 20, ativo: true }
        ]);
      })
    );
  }

  // Consome endpoint real do Spring Boot com fallback caso a API esteja offline
  getBarbeiros(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.baseUrl}/usuarios/barbeiros`).pipe(
      catchError(() => {
        console.info('Usando equipe local de contingência');
        const fallback: UsuarioResponse[] = [
          { id: 1, nome: 'Carlos "Mão de Tesoura"', email: 'carlos@barbershop.com', telefone: '11988887777', role: 'ROLE_BARBEIRO', ativo: true, criadoEm: '2026-01-10T10:00:00Z' },
          { id: 2, nome: 'Felipe "Fade Master"', email: 'felipe@barbershop.com', telefone: '11977776666', role: 'ROLE_BARBEIRO', ativo: true, criadoEm: '2026-02-15T10:00:00Z' },
          { id: 3, nome: 'Lucas "Navalha de Ouro"', email: 'lucas@barbershop.com', telefone: '11966665555', role: 'ROLE_BARBEIRO', ativo: true, criadoEm: '2026-03-01T10:00:00Z' }
        ];
        return of(fallback);
      })
    );
  }

  criarAgendamento(request: AgendamentoRequest): Observable<AgendamentoResponse> {
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
