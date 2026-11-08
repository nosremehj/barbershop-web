import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BarbershopService } from '../../core/services/barbershop.service';
import { AuthService } from '../../core/services/auth.service';
import { ServicoResponse } from '../../core/models/servico.model';
import { UsuarioResponse } from '../../core/models/usuario.model';
import { AgendamentoResponse } from '../../core/models/agendamento.model';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './agendamento.component.html'
})
export class AgendamentoComponent implements OnInit {
  private readonly barbershopService = inject(BarbershopService);
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  // Signals para reatividade pura do Angular 18
  servicos = signal<ServicoResponse[]>([]);
  barbeiros = signal<UsuarioResponse[]>([]);
  servicoSelecionado = signal<ServicoResponse | null>(null);
  barbeiroSelecionado = signal<UsuarioResponse | null>(null);
  dataSelecionada = signal<string>(new Date().toISOString().split('T')[0]);
  horarioSelecionado = signal<string | null>(null);
  agendamentoConcluido = signal<AgendamentoResponse | null>(null);
  submetendo = signal<boolean>(false);

  // Grade refinada de horários por turno
  horariosManha = signal<string[]>(['09:00', '09:40', '10:20', '11:00', '11:40']);
  horariosTarde = signal<string[]>(['13:30', '14:15', '15:00', '15:45', '16:30', '17:15']);
  horariosNoite = signal<string[]>(['18:00', '18:45', '19:30']);

  // Formulário do cliente
  formCliente = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
    observacao: ['']
  });

  // Computeds
  valorTotal = computed(() => this.servicoSelecionado()?.preco || 0);
  tempoTotal = computed(() => this.servicoSelecionado()?.duracaoMinutos || 0);
  apiOnline = this.barbershopService.apiOnline;
  apiStatus = this.barbershopService.apiStatus;

  ngOnInit(): void {
    // Verifica conexão em tempo real com o Spring Boot
    this.barbershopService.checkApiHealth().subscribe();

    // Carrega catálogo
    this.barbershopService.getServicos().subscribe(res => {
      this.servicos.set(res);
      if (res.length > 0) this.servicoSelecionado.set(res[0]); // Seleciona primeiro por conveniência
    });

    this.barbershopService.getBarbeiros().subscribe(res => {
      this.barbeiros.set(res);
      if (res.length > 0) this.barbeiroSelecionado.set(res[0]);
    });

    // Se o cliente estiver logado com JWT, auto-preenche o formulário!
    const user = this.authService.currentUser();
    if (user) {
      this.formCliente.patchValue({
        nome: user.nome,
        telefone: user.telefone
      });
    }
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
    this.horarioSelecionado.set(null);
    this.formCliente.reset();
  }
}
