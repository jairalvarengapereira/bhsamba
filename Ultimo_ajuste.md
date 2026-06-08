# BHSamba — Último Ajuste e Ponto de Partida

## Data: 08/06/2026

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

## Último Fix Aplicado (08/06/2026)

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
**Última atualização:** 08/06/2026
