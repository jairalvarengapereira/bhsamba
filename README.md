# BHSamba - Site da Banda de Samba de Belo Horizonte

![Logo BHSamba](./public/Logo.png)

## Visão Geral

**BHSamba** é o site oficial da banda de samba de Belo Horizonte. O projeto é uma aplicação web moderna desenvolvida com Next.js, permitindo a gestão de shows, músicos, galeria de fotos e configurações do site.

## Stack Tecnológica

### Frontend
- **Framework**: Next.js 16.2.6 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Deploy**: Vercel

### Backend
- **Runtime**: Next.js API Routes
- **Autenticação**: Token-based (ADMIN_TOKEN)

### Banco de Dados
- **PostgreSQL**: Neon (PostgreSQL serverless)
- **ORM**: Prisma 7.8

### Armazenamento de Arquivos
- **Storage**: Supabase Storage (bucket: bhsamba)

## Estrutura do Projeto

```
bhsamba/
├── public/
│   ├── Logo.png                 # Logo da banda
│   └── uploads/                 # Uploads locais (temporário)
├── src/
│   ├── app/
│   │   ├── admin/              # Painel administrativo
│   │   │   ├── page.tsx        # Dashboard admin
│   │   │   └── login/          # Página de login
│   │   ├── api/                # Rotas da API
│   │   │   └── admin/          # Endpoints administrativos
│   │   │       ├── auth/       # Autenticação
│   │   │       ├── members/    # CRUD de músicos
│   │   │       ├── shows/      # CRUD de shows
│   │   │       ├── media/      # CRUD de mídia
│   │   │       ├── settings/    # Configurações do site
│   │   │       └── upload/     # Upload de imagens
│   │   ├── page.tsx           # Página principal
│   │   └── layout.tsx         # Layout principal
│   ├── components/             # Componentes React
│   │   ├── AgendaSection.tsx  # Seção de shows
│   │   ├── GallerySection.tsx  # Galeria de fotos
│   │   ├── HeroSection.tsx     # Seção hero
│   │   ├── Lightbox.tsx       # Visualizador de imagens
│   │   ├── MembersSection.tsx  # Seção de músicos
│   │   ├── Menu.tsx            # Menu de navegação
│   │   ├── SocialLinks.tsx     # Links sociais
│   │   └── WhatsAppButton.tsx  # Botão WhatsApp
│   ├── lib/
│   │   ├── admin.ts            # Funções admin (CRUD)
│   │   └── db.ts               # Configuração do Prisma
│   └── middleware.ts           # Middleware Next.js
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
└── package.json               # Dependências do projeto
```

## Configuração do Ambiente

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Neon Database (PostgreSQL)
DATABASE_URL=postgresql://usuario:senha@host/neon_db

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://gnuawwkweacaokpohjbg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta

# Autenticação Admin
ADMIN_TOKEN=bhsamba2024

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5531988887777
```

### No Vercel

Configure as variáveis de ambiente no painel do Vercel:
- **Storage** → **Neon** → copie a `DATABASE_URL`
- **Settings** → **Environment Variables** → adicione todas as variáveis

## Models do Banco de Dados

### Shows
```prisma
model shows {
  id          String   @id @default(cuid())
  title       String
  description String?
  venue       String
  address     String?
  date        DateTime
  time        String?
  ticketUrl   String?
  imageUrl    String?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Members (Músicos)
```prisma
model members {
  id        String   @id @default(cuid())
  name      String
  role      String
  bio       String?
  bioHistory String?
  imageUrl  String?
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Media
```prisma
model media {
  id        String   @id @default(cuid())
  type      String   @default("image")
  url       String
  caption   String?
  showId    String?
  createdAt DateTime @default(now())
}
```

### SiteSettings
```prisma
model siteSettings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Endpoints da API

### Autenticação
- `GET /api/admin/auth` - Verificar autenticação

### Shows
- `GET /api/admin/shows` - Listar shows
- `POST /api/admin/shows` - Criar show
- `PUT /api/admin/shows` - Atualizar show
- `DELETE /api/admin/shows?id={id}` - Deletar show

### Músicos
- `GET /api/admin/members` - Listar músicos
- `POST /api/admin/members` - Criar músico
- `PUT /api/admin/members` - Atualizar músico
- `DELETE /api/admin/members?id={id}` - Deletar músico

### Mídia
- `GET /api/admin/media` - Listar mídias
- `POST /api/admin/media` - Criar mídia
- `PUT /api/admin/media` - Atualizar mídia
- `DELETE /api/admin/media?id={id}` - Deletar mídia

### Configurações
- `GET /api/admin/settings` - Listar configurações
- `POST /api/admin/settings` - Criar/atualizar configuração

### Upload
- `POST /api/admin/upload` - Upload de imagens

## Instalação

```bash
# Clonar repositório
git clone https://github.com/jairalvarengapereira/bhsamba.git
cd bhsamba

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar em desenvolvimento
npm run dev
```

## Deploy

### Vercel (Recomendado)

1. Conecte o repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify

1. Conecte o repositório GitHub ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `.next`

## Funcionalidades

### Painel Administrativo
- ✅ Gestão de Shows (CRUD completo)
- ✅ Gestão de Músicos (CRUD completo)
- ✅ Gestão da Galeria de Fotos (CRUD completo)
- ✅ Configurações do Site
- ✅ Upload de Imagens
- ✅ Interface responsiva

### Página Pública
- ✅ Seção Hero com chamada para ação
- ✅ História da Banda
- ✅ Apresentação dos Músicos
- ✅ Agenda de Shows
- ✅ Galeria de Fotos com Lightbox
- ✅ Links para Redes Sociais
- ✅ Botão WhatsApp flutuante
- ✅ Menu de navegação responsivo

## Infraestrutura

### Neon (PostgreSQL)
- Plano gratuito: 0.5 GB storage
- Região: US East (N. Virginia)
- Sem servidor - serverless

### Supabase Storage
- Bucket: `bhsamba`
- Policy:允许 público uploads
- Limite: 1 GB no plano gratuito

### Vercel
- Plano gratuito: 100 horas/mês
- CDN global
- Deploys automáticos

## Cores do Site

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde Rio | `#009B3A` | Botões, destaques |
| Dourado | `#C5A059` | Títulos, bordas |
| Amarelo | `#F9C412` | Gradientes |
| Azul | `#002776` | Backgrounds |
| Preto | `#0a0a0a` | Fundos escuros |

## Contato

Para mais informações sobre o projeto, entre em contato com a equipe de desenvolvimento.

## Licença

Este projeto é propriedade da banda BHSamba.