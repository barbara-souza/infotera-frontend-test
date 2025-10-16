# Infotravel - Plataforma de Busca e Reserva de Hotéis

Este projeto é uma aplicação frontend desenvolvida em **Next.js** com **React** e **TypeScript**, que simula uma plataforma completa de busca, visualização e reserva de hotéis.  
A aplicação foi construída com foco em **responsividade**, **usabilidade** e **boas práticas de arquitetura frontend**.

---

## Tecnologias Principais

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Zustand (estado global)
- React Hook Form + Zod (validação de formulários)
- Framer Motion (animações)
- Date-fns (manipulação de datas)
- JSON Server (simulação de API local)

---

## Funcionalidades

### Página Inicial (`/`)
- Campos de busca: **Destino**, **Entrada**, **Saída** e **Hóspedes**.
- Busca com **sugestões automáticas de destinos**.
- Redirecionamento para a página de resultados ao clicar em **Pesquisar**.
- Layout **responsivo** (mobile-first).

### Página de Busca (`/search`)
- Consome o endpoint interno `/api/hotels`.
- Exibe resultados em formato de **cards de hotéis** com imagens, preço e classificação.
- Implementa estados de carregamento e erro:
  - **Carregando:** exibe skeletons.
  - **Erro:** mensagem genérica de falha de requisição.

- Filtros disponíveis:
  - Nome
  - Faixa de preço
  - Estrelas
- Cada card leva à página de detalhes do hotel.

### Página de Detalhes (`/hotel/[id]`)
- Exibe informações completas do hotel selecionado.
- Mostra comodidades, políticas e tipos de quarto disponíveis.
- Permite seguir para o checkout com o quarto escolhido.

### Página de Checkout (`/checkout`)
- Formulário de dados do hóspede e contato com validação (React Hook Form + Zod).
- Exibe resumo da reserva com cálculo de taxas e valor total.
- Redireciona para a página de sucesso após a conclusão.

### Página de Sucesso (`/success`)
- Exibe confirmação da reserva.
- Mostra dados armazenados no `sessionStorage`.
- Corrige comportamentos de redirecionamento indesejados (sem flash da home).

---

## Instalar as dependências 

- npm install

## Executar o servidor da API 

- npm run server

## Executar o projeto 

- npm run dev
- Acessar http://localhost:3000

## Como Gerar o Build de Produção 

- npm run build

## Autor

Bárbara Souza
Repositório: https://github.com/barbara-souza/infotravel-frontend-test
