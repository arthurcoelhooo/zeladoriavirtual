# Zeladoria Campus

Plataforma web para registrar, acompanhar e gerenciar problemas de infraestrutura em uma faculdade.

## Funcionalidades

### Alunos

- Registro de solicitações de manutenção.
- Categorias: computador, ar-condicionado, lâmpada, projetor, banheiro, limpeza e outro.
- Descrição detalhada do problema.
- Localização digitada livremente pelo usuário, incluindo bloco, prédio, sala ou outro ponto de referência.
- Definição de prioridade: baixa, média ou alta.
- Inclusão de fotos do problema.
- Identificação do solicitante.
- Acompanhamento do status e histórico do chamado.

### Equipe

- Painel interno em `/painel`.
- Acesso protegido por senha.
- Visualização dos chamados ordenados por prioridade.
- Atualização do status do chamado:
  - Aberto
  - Em análise
  - Em manutenção
  - Resolvido
- Registro do histórico de alterações e observações da equipe.

## Tecnologias

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui e Base UI
- SWR
- Lucide React

## Estrutura principal

```text
app/
├── api/reports/       # Rotas da API para criar e atualizar chamados
├── painel/            # Painel da equipe
├── layout.tsx         # Layout e metadados globais
└── page.tsx           # Página principal para alunos

components/
├── report-form.tsx    # Formulário de abertura de chamado
├── report-card.tsx    # Card de acompanhamento do chamado
├── recent-reports.tsx # Lista de chamados recentes
├── staff-board.tsx    # Área de gerenciamento da equipe
├── staff-gate.tsx     # Tela de senha do painel
└── status-track.tsx   # Linha do tempo de status

lib/
├── types.ts           # Tipos, categorias, status e prioridades
├── labels.ts          # Rótulos exibidos na interface
├── store.ts           # Armazenamento usado pela API
└── compress-image.ts  # Compressão de imagens antes do envio
```

## Como executar

Instale as dependências e inicie o ambiente de desenvolvimento:

```bash
pnpm install
pnpm dev
```

Acesse:

- Página do aluno: `http://localhost:3000`
- Painel da equipe: `http://localhost:3000/painel`

Para gerar a versão de produção:

```bash
pnpm build
pnpm start
```

## Senha do painel

A senha atual para acessar o painel da equipe é:

```text
admin
```

Essa senha está definida no componente `components/staff-gate.tsx` como uma proteção simples de demonstração. Para uso em produção, substitua esse mecanismo por autenticação real no servidor, com usuários, sessões, controle de permissões e uma variável de ambiente para o segredo.

## API

### `GET /api/reports`

Retorna os chamados cadastrados.

### `POST /api/reports`

Cria um novo chamado. O corpo deve conter os dados de `NewReportInput` definidos em `lib/types.ts`.

### `PATCH /api/reports/:id`

Atualiza o status e os dados relacionados de um chamado.

## Observação sobre armazenamento

O projeto utiliza o armazenamento definido em `lib/store.ts`. Antes de colocar a aplicação em produção, recomenda-se substituir o armazenamento em memória por um banco de dados persistente e adicionar autenticação no servidor para proteger o painel e as rotas administrativas.
