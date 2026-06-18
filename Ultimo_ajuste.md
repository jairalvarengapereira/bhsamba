# BHSamba — Último Ajuste e Ponto de Partida

## Data: 17/06/2026

## Projeto

**Nome:** BHSamba — Site da Banda de Samba de Belo Horizonte
**Owner:** Jair Alvarenga Pereira
**Local:** `D:\Projetos\IA\Projetos\BHSamba\bhsamba`
**GitHub:** https://github.com/jairalvarengapereira/bhsamba
**Deploy:** https://bhsamba.vercel.app

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16.2.6 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Banco de Dados | Neon (PostgreSQL serverless) |
| ORM | Prisma 7.8 |
| Storage de Imagens | Supabase Storage (bucket: bhsamba) |
| Deploy | Vercel |
| Ícones | Lucide React |

## Último Fix Aplicado (18/06/2026)

**Commit:** `xxxxxxx` — `fix: corrigir erro 500 ao cadastrar/editar show (data NaN)`

**Problema:** Ao cadastrar ou editar um show pelo painel admin, a requisição PUT/POST retornava erro 500. O `handleSubmit` em `page.tsx` convertia a data para ISO string (`"2026-06-20T12:00:00.000Z"`). Depois, `parseDate()` em `admin.ts` fazia `split('-')` nessa string ISO, gerando `["2026", "06", "20T12", ...]` — o `d` resultava em `NaN`, criando data inválida que o Prisma rejeitava.

**Solução:** Removida a conversão de data no `handleSubmit`. O input HTML `type="date"` já envia `"YYYY-MM-DD"`, que é exatamente o formato que `parseDate()` espera e manipula corretamente.

**Arquivo alterado:**
- `src/app/admin/page.tsx` — removida linha de conversão de data no `handleSubmit`

## Fix Anterior (17/06/2026)

**Commit:** `fa6c83c` — `fix: corrigir problema de timezone na data dos shows`

**Problema:** Ao cadastrar um show, a data era salva com um dia de antecedência. O JavaScript `new Date("2026-06-20")` interpreta como UTC midnight, que no horário de Brasília (UTC-3) é 19/06 às 21:00. O PostgreSQL `@db.Date` truncava para 19/06.

**Solução:**
1. Função `parseDate()` criada em `admin.ts` — faz parse manual de "YYYY-MM-DD" e cria Date em UTC noon, evitando o shift de timezone.
2. Form submission em `page.tsx` — conversão manual sem `new Date()`.
3. `formatDate()` em `AgendaSection.tsx` — usa métodos UTC (`getUTCDate`, `getUTCMonth`, etc.) para exibir a data correta.
4. Admin page — display de data com `timeZone: 'UTC'`.

**Arquivos alterados:**
- `src/lib/admin.ts` — função `parseDate()` + uso em create/update
- `src/app/admin/page.tsx` — conversão de data no form + display com UTC
- `src/components/AgendaSection.tsx` — `formatDate()` com métodos UTC

## Fix Anterior (17/06/2026)

**Commit:** `1a10d0a` — `fix: ordenar shows por data e horário crescente`

**Problema:** Shows no mesmo dia não eram exibidos em ordem cronológica. O campo `date` no schema Prisma era `DateTime`, e o `orderBy` só considerava `date: 'asc'`, causando ordenação por ordem de inserção quando dois shows compartilhavam a mesma data.

**Solução:**
1. Schema Prisma alterado: `date DateTime` → `date DateTime @db.Date` — agora o PostgreSQL armazena apenas a data (sem hora), garantindo valores idênticos para shows no mesmo dia.
2. Queries Prisma atualizadas em `db.ts` e `admin.ts`: `orderBy: [{ date: 'asc' }, { time: 'asc' }]` — ordenação secundária por horário.
3. Ordenação client-side adicionada em `AgendaSection.tsx` como garantia extra.

**Arquivos alterados:**
- `prisma/schema.prisma` — campo `date` alterado para `@db.Date`
- `src/lib/db.ts` — `getUpcomingShows()` com orderBy composto
- `src/lib/admin.ts` — `getShows()` com orderBy composto
- `src/components/AgendaSection.tsx` — sort client-side

## Fix Anterior (08/06/2026)

**Commit:** `4b1ca0b` — `fix: lazy init Supabase client to prevent build crash when env vars are missing`

**Problema:** O upload de imagens retornava erro 500 no Vercel. O client Supabase era criado no nível do módulo em `src/app/api/admin/upload/route.ts`, causando crash na build quando as variáveis de ambiente não estavam configuradas.

**Solução:** Client Supabase movido para dentro do handler (lazy initialization) com validação de variáveis.

**Causa raiz adicional:** O Supabase estava em processo de restauração (provavelmente por inatividade prolongada — pausa automática após 7 dias sem atividade no plano gratuito).

## Variáveis de Ambiente

### No Vercel (configuradas)
- `DATABASE_URL` — Neon PostgreSQL
- `ADMIN_TOKEN` — Token de autenticação admin
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — Número do WhatsApp
- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Chave de serviço do Supabase

### No .env local (atenção: não committar!)
```env
DATABASE_URL="postgresql://neondb_owner:...@ep-steep-cell-...neondb?sslmode=require"
ADMIN_TOKEN=bhsamba2024
NEXT_PUBLIC_WHATSAPP_NUMBER=5531988887777
NEXT_PUBLIC_SUPABASE_URL=https://gnuawwkweacaokpohjbg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<sua_key_aqui>
```

## Funcionalidades Implementadas

### Painel Administrativo (`/admin`)
- Gestão de Shows (CRUD completo)
- Gestão de Músicos (CRUD completo)
- Gestão da Galeria de Fotos (CRUD completo)
- Configurações do Site
- Upload de Imagens (Supabase Storage)
- Interface responsiva com ícones modernos
- Menu otimizado para mobile

### Página Pública (`/`)
- Seção Hero com chamada para ação
- História da Banda
- Apresentação dos Músicos (duas seções: história e componentes)
- Agenda de Shows
- Galeria de Fotos com Lightbox
- Links para Redes Sociais
- Botão WhatsApp flutuante
- Menu de navegação responsivo

## Estrutura Principal

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx          # Painel admin (client-side)
│   │   └── login/            # Login do admin
│   ├── api/
│   │   └── admin/
│   │       ├── auth/         # Autenticação
│   │       ├── members/      # CRUD músicos
│   │       ├── shows/        # CRUD shows
│   │       ├── media/        # CRUD mídia
│   │       ├── settings/     # Configurações
│   │       └── upload/       # Upload de imagens (corrigido)
│   ├── page.tsx              # Página principal
│   └── layout.tsx            # Layout principal
├── components/               # 8 componentes React
├── lib/
│   ├── admin.ts              # Funções CRUD admin
│   └── db.ts                 # Configuração Prisma
└── middleware.ts              # ⚠️ DEPRECATED — migrar para proxy
```

## Avisos e Pendências

### 1. Middleware deprecado
O Next.js 16 emite aviso:
```
The "middleware" file convention is deprecated. Please use "proxy" instead.
```
**Ação:** Migrar `src/middleware.ts` para a nova convenção `proxy`.

### 2. Supabase Inatividade
O plano gratuito pausa após **7 dias sem atividade**. Para evitar:
- Criar cron job periódico (a cada 5-6 dias) que toca o Supabase
- Ou manter o projeto ativo com uso regular

### 3. Build Warning
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```
Não quebra, mas deve ser resolvido antes de atualizar o Next.js.

## Cores do Site

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde Rio | `#009B3A` | Botões, destaques |
| Dourado | `#C5A059` | Títulos, bordas |
| Amarelo | `#F9C412` | Gradientes |
| Azul | `#002776` | Backgrounds |
| Preto | `#0a0a0a` | Fundos escuros |

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Gerar Prisma Client
npx prisma generate

# Push do schema para o banco
npx prisma db push
```

## Como Continuar

Diga algo como:
> "Continuar o projeto BHSamba"

Ou especifique a tarefa:
> "Continuar o projeto BHSamba — [descreva o que precisa]"

---

**Criado em:** 14/05/2026
**Última atualização:** 18/06/2026
