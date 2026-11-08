import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  modo = signal<'login' | 'cadastro'>('login');
  carregando = signal<boolean>(false);
  mensagemErro = signal<string | null>(null);
  mensagemSucesso = signal<string | null>(null);

  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  formCadastro = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    role: this.fb.control<'ROLE_CLIENTE' | 'ROLE_BARBEIRO'>('ROLE_CLIENTE', { nonNullable: true, validators: Validators.required })
  });

  alternarModo(novoModo: 'login' | 'cadastro'): void {
    this.modo.set(novoModo);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);
  }

  submeterLogin(): void {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.mensagemErro.set(null);

    const { email, senha } = this.formLogin.value;
    this.authService.login({ email: email!, senha: senha! }).subscribe({
      next: (res) => {
        this.carregando.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.carregando.set(false);
        const detalhe = err.error?.detail || err.error?.message || 'E-mail ou senha incorretos.';
        this.mensagemErro.set(detalhe);
      }
    });
  }

  submeterCadastro(): void {
    if (this.formCadastro.invalid) {
      this.formCadastro.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.mensagemErro.set(null);

    const val = this.formCadastro.value;
    this.authService.cadastrar({
      nome: val.nome!,
      email: val.email!,
      telefone: val.telefone!,
      senha: val.senha!,
      role: val.role as any
    }).subscribe({
      next: (res) => {
        this.carregando.set(false);
        this.mensagemSucesso.set('Cadastro realizado com sucesso! Faça login para continuar.');
        this.formCadastro.reset({ role: 'ROLE_CLIENTE' });
        this.modo.set('login');
      },
      error: (err) => {
        this.carregando.set(false);
        const detalhe = err.error?.detail || err.error?.message || 'Falha ao realizar cadastro.';
        this.mensagemErro.set(detalhe);
      }
    });
  }
}
