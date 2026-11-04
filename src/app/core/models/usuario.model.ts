export type Role = 'ROLE_CLIENTE' | 'ROLE_BARBEIRO' | 'ROLE_ADMIN';

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  role: Role;
  ativo: boolean;
  criadoEm: string;
}
