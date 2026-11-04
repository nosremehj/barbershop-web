import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BarbershopService } from '../../core/services/barbershop.service';
import { ServicoResponse } from '../../core/models/servico.model';
import { UsuarioResponse } from '../../core/models/usuario.model';
import { AgendamentoResponse } from '../../core/models/agendamento.model';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendamento.component.html'
})
export class AgendamentoComponent implements OnInit {
  private readonly barbershopService = inject(BarbershopService);
  private readonly fb = inject(FormBuilder);

  // Signals para reatividade
  servicos = signal<ServicoResponse[]>([]);
  barbeiros = signal<UsuarioResponse[]>([]);
  servicoSelecionado = signal<ServicoResponse | null>(null);
  barbeiroSelecionado = signal<UsuarioResponse | null>(null);
  dataSelecionada = signal<string>(new Date().toISOString().split('T')[0]);
  horarioSelecionado = signal<string | null>(null);
  agendamentoConcluido = signal<AgendamentoResponse | null>(null);
  submetendo = signal<boolean>(false);

  // Slots de horários dinâmicos
  horariosDisponiveis = signal<string[]>([
    '09:00', '09:40', '10:20', '11:00',
    '13:30', '14:15', '15:00', '16:00',
    '17:00', '17:45', '18:30', '19:15'
  ]);

  // Form reativo para identificação do cliente
  formCliente = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
    observacao: ['']
  });

  // Totalizador computado
  valorTotal = computed(() => this.servicoSelecionado()?.preco || 0);

  // Status da API
  apiOnline = this.barbershopService.apiOnline;
  apiStatus = this.barbershopService.apiStatus;

  ngOnInit(): void {
    // Verifica conexão com o back-end Spring Boot
    this.barbershopService.checkApiHealth().subscribe();

    // Carrega serviços e barbeiros
    this.barbershopService.getServicos().subscribe(res => this.servicos.set(res));
    this.barbershopService.getBarbeiros().subscribe(res => this.barbeiros.set(res));
  }

  selecionarServico(servico: ServicoResponse): void {
    this.servicoSelecionado.set(servico);
  }

  selecionarBarbeiro(barbeiro: UsuarioResponse): void {
    this.barbeiroSelecionado.set(barbeiro);
  }

  selecionarHorario(horario: string): void {
    this.horarioSelecionado.set(horario);
  }

  finalizarAgendamento(): void {
    if (this.formCliente.invalid || !this.servicoSelecionado() || !this.barbeiroSelecionado() || !this.horarioSelecionado()) {
      this.formCliente.markAllAsTouched();
      return;
    }

    this.submetendo.set(true);

    const dados = this.formCliente.value;
    const request = {
      clienteNome: dados.nome!,
      clienteTelefone: dados.telefone!,
      barbeiroId: this.barbeiroSelecionado()!.id,
      servicoId: this.servicoSelecionado()!.id,
      dataHoraInicio: `${this.dataSelecionada()}T${this.horarioSelecionado()}:00`,
      observacao: dados.observacao || ''
    };

    this.barbershopService.criarAgendamento(request).subscribe({
      next: (resposta) => {
        this.agendamentoConcluido.set(resposta);
        this.submetendo.set(false);
      },
      error: (err) => {
        console.error('Erro ao agendar:', err);
        this.submetendo.set(false);
      }
    });
  }

  novoAgendamento(): void {
    this.agendamentoConcluido.set(null);
    this.servicoSelecionado.set(null);
    this.barbeiroSelecionado.set(null);
    this.horarioSelecionado.set(null);
    this.formCliente.reset();
  }
}
