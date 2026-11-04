# 💈 BarberShop Web

Aplicação web moderna, responsiva (Mobile-First) e de alta performance para clientes e barbeiros, desenvolvida em **Angular 18+**.

---

## 🎯 Skills & Competências Demonstradas (Nível Pleno)

Este projeto foi construído seguindo as melhores práticas e padrões mais recentes do ecossistema Angular:

### 1. Angular Moderno (v18+)
* **Standalone Components:** Código limpo e desacoplado, sem necessidade de `NgModule` legados.
* **Angular Signals (`signal`, `computed`, `effect`):** Gerenciamento de estado reativo nativo, garantindo detecção de mudanças cirúrgica (`ChangeDetectionStrategy.OnPush`) e performance superior.
* **Control Flow Moderno:** Uso da nova sintaxe `@if`, `@for`, `@switch` e `@empty` nativa do template do Angular 17/18.
* **Deferrable Views (`@defer`):** Carregamento sob demanda (lazy loading granular) de componentes pesados como calendários e gráficos do painel de administração.

### 2. Arquitetura Front-end & Clean Code
* **Modularização por Features:** Divisão limpa em `core/` (serviços globais singleton), `shared/` (componentes reutilizáveis e pipes) e `features/` (módulos funcionais).
* **HTTP Interceptors Funcionais:** 
  * `authInterceptor`: Anexa automaticamente o cabeçalho `Authorization: Bearer <token>` em requisições autenticadas.
  * `errorInterceptor`: Captura global de erros de rede (401/403/500) com redirecionamento de rota e notificações amigáveis.
* **Route Guards Funcionais (`canActivate`):** Proteção de rotas baseada na role do usuário (Cliente, Barbeiro, Admin).

### 3. Formulários & UX Avançada
* **Reactive Forms:** Formulários robustos com tipagem estrita e validações assíncronas (ex: validação de formato e existência de telefone para WhatsApp).
* **Design Mobile-First:** Interface pensada primordialmente para smartphones, onde 95% dos clientes realizam agendamentos através de links no WhatsApp.
* **Componentes de Acessibilidade & Feedback:** Avaliação visual por estrelas, seletores de horários com feedback em tempo real e modais de confirmação de Pix com QR Code dinâmico.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** Angular 18+ (TypeScript)
* **Estilização:** Tailwind CSS
* **Ícones & UI:** Lucide Icons / PrimeNG
* **Roteamento:** Angular Router com Lazy Loading e Guards
* **Reatividade:** Angular Signals & RxJS
* **Testes:** Karma & Jasmine

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js (v18 ou v20 LTS)
* npm ou pnpm
* Angular CLI (`npm install -g @angular/cli`)

### Passos
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/nosremehj/barbershop-web.git
   cd barbershop-web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   ng serve
   ```

4. **Acesse a aplicação:**
   Abra no navegador: `http://localhost:4200`

---

## 📄 Licença
Distribuído sob a licença MIT.
