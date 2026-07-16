# DOCSIS - Documentação de Modificações do BHSamba

## Data: 16/07/2026

---

## Resumo da Implementação

**Funcionalidade:** Mural de Recados de Voz (ZapMural)
**Descrição:** Sistema para recebimento, moderação e exibição de recados de voz dos músicos do grupo via WhatsApp.

---

## Arquivos Criados

### 1. `src/lib/mural.ts`
**Função:** Biblioteca de funções CRUD para o model `voiceMessages`.

**Funções exportadas:**
- `getVoiceMessages()` — Lista todas as mensagens (admin)
- `getApprovedMessages()` — Lista mensagens aprovadas (público)
- `getPendingMessages()` — Lista mensagens pendentes
- `createMessage(data)` — Cria novo recado
- `updateMessageStatus(id, status)` — Atualiza status (pending/approved/rejected)
- `deleteMessage(id)` — Remove recado
- `findMemberByPhone(phone)` — Busca músico pelo número de telefone

---

### 2. `src/app/api/mural/route.ts`
**Função:** API pública para listar áudios aprovados.

**Método:** `GET`
**Retorno:** Array de voiceMessages com member incluído
**Autenticação:** Não requer (público)

---

### 3. `src/app/api/mural/webhook/route.ts`
**Função:** Webhook para receber áudios da Evolution API.

**Método:** `POST`
**Autenticação:** Bearer token (EVOLUTION_API_KEY)

**Fluxo:**
1. Valida autenticação via header `Authorization`
2. Verifica se a mensagem é do grupo configurado (MURAL_GROUP_ID)
3. Verifica se é mensagem de áudio (audioMessage ou pttMessage)
4. Baixa o áudio do payload
5. Faz upload para Supabase Storage (pasta `voice/`)
6. Identifica músico pelo número de telefone
7. Salva metadados no banco com status `pending`

**Variáveis de ambiente necessárias:**
- `EVOLUTION_API_KEY` — Chave de autenticação da Evolution API
- `MURAL_GROUP_ID` — ID do grupo WhatsApp (formato: `1203630456789@g.us`)
- `NEXT_PUBLIC_SUPABASE_URL` — URL do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Chave de serviço do Supabase

---

### 4. `src/app/api/admin/mural/route.ts`
**Função:** API administrativa para gerenciar recados.

**Métodos:**
- `GET` — Lista todas as mensagens (requer auth)
- `PUT` — Atualiza status da mensagem (requer auth)
- `DELETE` — Remove mensagem (requer auth)

**Autenticação:** Cookie `admin-token`

---

### 5. `src/app/api/admin/mural/upload/route.ts`
**Função:** Upload manual de áudio pelo painel administrativo.

**Método:** `POST`
**Autenticação:** Cookie `admin-token`

**Campos do FormData:**
- `file` — Arquivo de áudio (obrigatório)
- `memberId` — ID do músico (opcional)
- `senderPhone` — Número do remetente (opcional, padrão: "manual")
- `senderName` — Nome do remetente (opcional, padrão: "Admin Upload")
- `duration` — Duração em segundos (opcional)

---

### 6. `src/components/VoicMailSection.tsx`
**Função:** Componente React para exibir recados de voz com player de áudio.

**Props:**
```typescript
interface VoicMailSectionProps {
  messages: VoiceMessage[];
}
```

**Funcionalidades:**
- Player de áudio customizado (Play/Pause)
- Barra de progresso clicável
- Exibição de duração atual/total
- Foto e nome do músico
- Data de criação
- Design responsivo com cores do site ( Verde Rio/Dourado)

---

### 7. `src/components/SendVoiceButton.tsx`
**Função:** Botão flutuante para enviar recado via WhatsApp.

**Props:**
```typescript
interface SendVoiceButtonProps {
  phoneNumber: string;
}
```

**Funcionalidades:**
- Aparece após rolar 400px
- Abre WhatsApp com mensagem pré-definida
- Animação de pulse
- Tooltip ao passar o mouse
- Posição fixa inferior esquerda

---

### 8. `src/app/mural/page.tsx`
**Função:** Página dedicada ao Mural de Recados.

**Rota:** `/mural`

**Funcionalidades:**
- Server component com dados do servidor
- Renderiza VoicMailSection com áudios aprovados
- Botão "Enviar Recado de Voz" (link para WhatsApp)
- SendVoiceButton flutuante
- Metadata SEO configurada
- Tratamento de erros (fallback para tabela não existe)
- Modo dinâmico (force-dynamic)

---

## Arquivos Modificados

### 1. `prisma/schema.prisma`

**Alterações:**

#### Model `members` — Adicionado campo `phone`
```prisma
model members {
  id         String   @id @default(uuid())
  name       String
  role       String
  phone      String?  @map("phone")  // ← NOVO
  bio        String?
  bioHistory String?  @map("biohistory")
  imageUrl   String?  @map("imageurl")
  order      Int      @default(0) @map("order")
  isActive   Boolean  @default(true) @map("isactive")
  createdAt  DateTime @default(now()) @map("createdat")
  updatedAt  DateTime @updatedAt @map("updatedat")

  voiceMessages voiceMessages[]  // ← NOVO (relação)

  @@map("members")
}
```

#### Novo Model `voiceMessages`
```prisma
model voiceMessages {
  id          String   @id @default(uuid())
  senderPhone String   @map("sender_phone")
  senderName  String?  @map("sender_name")
  audioUrl    String   @map("audio_url")
  duration    Int?
  status      String   @default("pending") @map("status")
  memberId    String?  @map("member_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  member members? @relation(fields: [memberId], references: [id])

  @@index([status])
  @@index([memberId])
  @@map("voice_messages")
}
```

**Campos da tabela `voice_messages`:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| sender_phone | VARCHAR | Número do WhatsApp do remetente |
| sender_name | VARCHAR (opcional) | Nome do contato |
| audio_url | TEXT | URL do áudio no Supabase Storage |
| duration | INTEGER (opcional) | Duração em segundos |
| status | VARCHAR | Status: pending, approved, rejected |
| member_id | UUID (opcional) | FK para members |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

---

### 2. `src/lib/admin.ts`

**Alterações:**
- `createMember()` — Adicionado parâmetro `phone`
- `updateMember()` — Adicionado parâmetro `phone`

---

### 3. `src/app/admin/page.tsx`

**Alterações:**
- Adicionado ícone `Volume2` e `Upload` nos imports
- Adicionada interface `VoiceMessage`
- Adicionado state `messages` (VoiceMessage[])
- Adicionada aba "Recados" na grid de tabs (5 colunas)
- Adicionado `MessagesTab` com:
  - Upload manual de áudio
  - Seleção de músico
  - Lista de recados com player
  - Botões Aprovar/Rejeitar/Excluir
  - Indicador de status (Pendente/Aprovado/Rejeitado)
- Atualizado `ModalForm` para incluir campo "WhatsApp" no form de músicos

---

### 4. `src/components/Menu.tsx`

**Alterações:**
- Adicionado item "Recados" no menu com ícone `🎙️`
- Link: `/mural`

---

## Variáveis de Ambiente Necessárias

### Para o Webhook (Evolution API)
```env
EVOLUTION_API_URL=https://evolution-api.onrender.com
EVOLUTION_API_KEY=bhsamba2024
EVOLUTION_INSTANCE=bhsamba
MURAL_GROUP_ID=1203630456789@g.us
```

### Já existentes (necessárias)
```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_TOKEN=bhsamba2024
NEXT_PUBLIC_WHATSAPP_NUMBER=5531988887777
```

---

## Configuração do Banco de Dados

### ✅ Criar tabela (CONCLUÍDO)
```bash
npx prisma db push
```
**Status:** Tabela `voice_messages` criada com sucesso no banco Neon em 16/07/2026

### Ou via migration
```bash
npx prisma migrate dev --name add-mural-features
```

---

## Configuração da Evolution API

### Criar instância
```bash
POST https://evolution-api.onrender.com/instance/create
Headers:
  apikey: bhsamba2024
  Content-Type: application/json

Body:
{
  "instanceName": "bhsamba",
  "number": "5531988887777",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}
```

### Configurar webhook
```bash
POST https://evolution-api.onrender.com/webhook/set/bhsamba
Headers:
  apikey: bhsamba2024
  Content-Type: application/json

Body:
{
  "webhook": {
    "url": "https://bhsamba.vercel.app/api/mural/webhook",
    "byEvents": false,
    "base64": true,
    "events": ["messages.upsert"]
  }
}
```

---

## Fluxo de Uso

### Fluxo Automático (Webhook)
```
1. Músico grava áudio no grupo WhatsApp
2. Evolution API recebe áudio
3. Webhook envia para /api/mural/webhook
4. Sistema identifica músico pelo número
5. Áudio é salvo no Supabase Storage
6. Metadados salvos no banco (status: pending)
7. Admin aprova no painel
8. Áudio aparece no mural (/mural)
```

### Fluxo Manual (Upload)
```
1. Músico envia áudio para admin via WhatsApp
2. Admin acessa /admin → Aba "Recados"
3. Admin seleciona músico e faz upload do áudio
4. Sistema salva no Supabase Storage
5. Áudio fica com status: pending
6. Admin aprova
7. Áudio aparece no mural (/mural)
```

---

## Rotas Criadas

| Rota | Método | Descrição | Autenticação |
|------|--------|-----------|--------------|
| `/mural` | GET | Página do mural | Não |
| `/api/mural` | GET | Lista áudios aprovados | Não |
| `/api/mural/webhook` | POST | Recebe áudio da Evolution API | Bearer token |
| `/api/admin/mural` | GET | Lista todos os áudios | Cookie admin |
| `/api/admin/mural` | PUT | Atualiza status | Cookie admin |
| `/api/admin/mural` | DELETE | Remove áudio | Cookie admin |
| `/api/admin/mural/upload` | POST | Upload manual | Cookie admin |

---

## Backup

Cópia de segurança criada em:
```
D:\Projetos\IA\Producao\BHSamba\bhsamba_backup_20260716_151057
```

**Conteúdo:** 77 arquivos (excluindo .next e node_modules)

---

## Pendências

### ✅ Concluído
- [x] Schema Prisma atualizado (phone no members + voiceMessages)
- [x] Tabela voice_messages criada no banco Neon
- [x] Prisma Client regenerado
- [x] Todas as APIs criadas e funcionais
- [x] Componentes React criados
- [x] Página /mural criada
- [x] Admin page atualizada (aba Recados)
- [x] Menu atualizado (link Recados)
- [x] Build verificado com sucesso
- [x] Backup criado
- [x] Documentação DOCSIS.md criada

### ⏳ Pendente (requer ação manual)
1. **Configurar Evolution API no Render** — Seguir guia na seção "Configuração da Evolution API"
2. **Adicionar variáveis de ambiente no Vercel** — EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE, MURAL_GROUP_ID
3. **Cadastrar números de WhatsApp dos músicos** — No painel admin → Músicos → Editar → Campo WhatsApp
4. **Configurar ID do grupo WhatsApp** — MURAL_GROUP_ID no Vercel

### 🔮 Melhorias futuras
- Converter áudios OGG para MP3 (ffmpeg)
- Adicionar paginação no mural
- Adicionar busca por músico
- Notificação quando receber novo recado
- Estatísticas de uso

---

## Cores do Site

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde Rio | `#009B3A` | Botões, destaques |
| Dourado | `#C5A059` | Títulos, bordas |
| Amarelo | `#F9C412` | Gradientes |
| Azul | `#002776` | Backgrounds |
| Preto | `#0a0a0a` | Fundos escuros |

---

**Autor:** Jair Alvarenga Pereira
**Data da implementação:** 16/07/2026
**Versão:** 1.0
