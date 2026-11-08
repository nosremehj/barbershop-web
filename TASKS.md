# 📋 Quadro de Tarefas & Requisitos (BarberShop System)

Este documento centraliza todos os **Requisitos Funcionais (RF)**, **Requisitos Não-Funcionais (RNF)** e o **Quadro de Tarefas** do sistema.
> 📌 **Regra do Projeto:** Sempre que uma funcionalidade for concluída, o checklist correspondente deve ser marcado como `[x]` e associado ao commit semântico realizado.

---

## 📌 1. Requisitos Funcionais (RF)

| ID | Descrição | Status | Detalhes Técnicos |
| :--- | :--- | :---: | :--- |
| **RF-01** | Cadastro de Usuários (Cliente, Barbeiro, Admin) | ✅ Concluído | Entidade, DTOs, AuthService e endpoint `/api/auth/register` implementados |
| **RF-02** | Autenticação Stateless via JWT (Login / Logout) | ✅ Concluído | `JwtService`, `JwtAuthenticationFilter`, `AuthService` e `/api/auth/login` |
| **RF-03** | Gestão de Serviços (CRUD, preços e tempo em minutos) | 🟡 Em Progresso | Entidade e Repository criados; falta Service e Controller |
| **RF-04** | Grade de Disponibilidade do Barbeiro (dias, horas, almoço) | 🟡 Em Progresso | Entidade criada; falta Service e Controller |
| **RF-05** | Cálculo Dinâmico de Horários Livres (Slots de Agenda) | ⏳ Pendente | Algoritmo que cruza grade, agendamentos e tempo do serviço |
| **RF-06** | Solicitação de Agendamento pelo Cliente | 🟡 Em Progresso | Front-end mobile mockado; falta integração com endpoint real |
| **RF-07** | Aprovação e Recusa de Agendamentos pelo Barbeiro | ⏳ Pendente | Endpoints `/aprovar` e `/recusar` + atualização de status |
| **RF-08** | Notificações Automáticas no WhatsApp | ⏳ Pendente | Disparo assíncrono para barbeiro e cliente |
| **RF-09** | Pagamento via Pix com Confirmação por Webhook | ⏳ Pendente | Integração com Mercado Pago / Asaas |
| **RF-10** | Sistema de Avaliações e Feedback (1 a 5 estrelas) | 🟡 Em Progresso | Entidade e DTOs criados; falta Service e Controller |
| **RF-11** | Painel do Barbeiro (Agenda diária no Front-end) | ⏳ Pendente | Tela em Angular com filtros por data e botões de ação |
| **RF-12** | Painel do Administrador (Gestão de equipe e serviços) | ⏳ Pendente | Telas administrativas com permissão `ROLE_ADMIN` |

---

## ⚙️ 2. Requisitos Não-Funcionais (RNF)

| ID | Descrição | Status | Implementação |
| :--- | :--- | :---: | :--- |
| **RNF-01** | Arquitetura Desacoplada (API RESTful + SPA) | ✅ Concluído | Spring Boot 3 + Angular 18 em repositórios separados |
| **RNF-02** | Prevenção de Concorrência (*Anti Double-Booking*) | ✅ Concluído | `@Lock(LockModeType.PESSIMISTIC_WRITE)` + `UNIQUE CONSTRAINT` |
| **RNF-03** | Versionamento de Banco de Dados via Migrations | ✅ Concluído | Flyway (`V1__create_initial_schema.sql`) |
| **RNF-04** | DTOs Imutáveis com Validação Declarativa | ✅ Concluído | Java Records + Bean Validation (`@NotNull`, `@Future`, etc.) |
| **RNF-05** | Tratamento Global de Erros Padronizado | ✅ Concluído | `@RestControllerAdvice` usando RFC 7807 (`ProblemDetail`) |
| **RNF-06** | Documentação Viva da API | ✅ Concluído | OpenAPI 3 / Swagger UI (`/swagger-ui.html`) |
| **RNF-07** | Frontend Reativo com Angular Moderno | ✅ Concluído | Standalone Components + Angular Signals (`signal`, `computed`) |
| **RNF-08** | Design Mobile-First Responsivo | ✅ Concluído | Tailwind CSS customizado com tema *Dark & Gold* |
| **RNF-09** | Segurança Stateless e Criptografia | ✅ Concluído | Spring Security 6 + JJWT + BCrypt + JwtAuthenticationFilter |
| **RNF-10** | Testes Automatizados (Unitários e Integração) | 🟡 Em Progresso | `SpringBootTest` e `MockMvc` configurados e validados |
| **RNF-11** | Orquestração Local para Desenvolvimento | ✅ Concluído | `docker-compose.yml` (PostgreSQL 16 + PgAdmin) |

---

## 🚀 3. Checklist de Tarefas por Fases

### Fase 1: Fundação & Banco de Dados
- [x] Configurar projeto Spring Boot 3.3+ com Java 17/21 e Maven
- [x] Criar `docker-compose.yml` com PostgreSQL 16 e PgAdmin
- [x] Criar migration Flyway inicial `V1__create_initial_schema.sql`
- [x] Mapear entidades JPA (`Usuario`, `Servico`, `Disponibilidade`, `Agendamento`, `Pagamento`, `Avaliacao`)
- [x] Criar repositórios Spring Data JPA com query de Lock Pessimista
- [x] Configurar perfil `dev` com banco H2 para testes rápidos e `prod` com PostgreSQL

### Fase 2: Segurança, Autenticação & DTOs
- [x] Criar DTOs de Request como Java Records com Bean Validation
- [x] Criar DTOs de Response como Java Records
- [x] Implementar `GlobalExceptionHandler` (RFC 7807 `ProblemDetail`)
- [x] Configurar `SecurityConfig` base e encoder BCrypt
- [x] Implementar `JwtService` (geração de token, extração de claims, validação de expiração)
- [x] Implementar `JwtAuthenticationFilter` (`OncePerRequestFilter`)
- [x] Implementar `AuthService` com métodos `cadastrar()` e `autenticar()`
- [x] Criar `AuthController` com endpoints `/api/auth/register` e `/api/auth/login`
- [ ] Adicionar testes unitários para autenticação (senhas inválidas, e-mails duplicados)

### Fase 3: Regras de Negócio e Endpoints Core
- [ ] Implementar `ServicoService` e `ServicoController` (`GET /api/servicos`, `POST`, `PUT`, `DELETE`)
- [ ] Implementar `DisponibilidadeService` e `DisponibilidadeController` (configurar grade semanal do barbeiro)
- [ ] Implementar algoritmo de cálculo de horários livres (`GET /api/agendamentos/horarios-disponiveis`)
- [ ] Implementar criação de agendamento com validação de horário e lock pessimista (`POST /api/agendamentos`)
- [ ] Implementar endpoints de transição de status (`PATCH /api/agendamentos/{id}/aprovar`, `/recusar`, `/concluir`)
- [ ] Escrever testes unitários com JUnit 5 + Mockito para o cálculo de horários e conflitos

### Fase 4: Integrações (WhatsApp & Pagamentos Pix)
- [ ] Configurar Spring Application Events ou serviço assíncrono (`@Async`)
- [ ] Implementar cliente HTTP para a API de WhatsApp (envio de notificação de agendamento)
- [ ] Implementar serviço de cobrança Pix (geração de QR Code e chave Copia e Cola)
- [ ] Criar endpoint de Webhook `/api/webhooks/pagamentos` para confirmação automática via gateway
- [ ] Implementar endpoint de avaliação do corte (`POST /api/avaliacoes`)

### Fase 5: Front-end Angular 18+
- [x] Criar scaffold com Standalone Components e Tailwind CSS
- [x] Criar modelos TypeScript tipados espelhando os DTOs do backend
- [x] Criar serviço base `barbershop.service.ts` com Signals
- [x] Criar tela de Agendamento do Cliente (Mobile-First com fluxo por etapas)
- [x] Criar serviço de autenticação `auth.service.ts` e `auth.interceptor.ts` (injetar JWT)
- [x] Criar tela de Login e Registro de Clientes/Barbeiros (`/auth`)
- [ ] Criar Route Guards funcionais (`auth.guard.ts`, `role.guard.ts`)
- [ ] Conectar tela de Agendamento aos endpoints reais de `/api/servicos` e `/api/agendamentos`
- [ ] Criar Painel do Barbeiro (`/painel-barbeiro`): grade diária com botões de aprovar/recusar
- [ ] Criar tela de configuração de horários do Barbeiro
- [ ] Criar Painel do Administrador (`/admin`): CRUD de serviços e métricas básicas

---

## 📝 4. Log de Implementações & Commits

* **`bff21f2`** (Back-end) - `feat: initial commit with project documentation, architecture, docker-compose and gitignore`
* **`5153c41`** (Front-end) - `feat: initial commit with project documentation, architecture, angular standards and gitignore`
* **`6d6f53c`** (Back-end) - `feat(api): implement jpa entities, flyway migration v1, dtos with java records, repositories with pessimistic lock, spring security and openapi`
* **`00a1bb9`** (Front-end) - `feat(web): setup angular 18 standalone app with tailwind, signals, models and mobile-first appointment booking screen`
