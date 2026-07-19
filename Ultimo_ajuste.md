# Último Ajuste - Mural de Recados de Voz
**Data:** 18/07/2026
**Status:** SUSPENSO (aguardando plano pago Railway ou Render)

---

## O que foi feito

### Sistema completo implementado
- **Schema Prisma:** Campo `phone` no modelo `members` + novo modelo `voiceMessages`
- **Funções CRUD:** `lib/mural.ts` (getVoiceMessages, getApprovedMessages, createMessage, updateMessageStatus, deleteMessage, findMemberByPhone)
- **API Routes:**
  - `/api/mural` — público, retorna áudios aprovados
  - `/api/mural/webhook` — recebe áudios do WhatsApp via Evolution API
  - `/api/mural/sync` — busca áudios da Evolution API (polling)
  - `/api/admin/mural` — CRUD para moderação
  - `/api/admin/mural/upload` — upload manual de áudio
  - `/api/admin/mural/sync` — sync via admin autenticado
- **Frontend:**
  - `VoicMailSection.tsx` — player de áudio com barra de progresso
  - `SendVoiceButton.tsx` — botão flutuante do WhatsApp
  - `/mural` — página pública (server component, force-dynamic)
  - Admin com aba "Recados" + botão "Sincronizar Áudios"
- **Banco de Dados:** Migrações aplicadas no Neon DB
- **Deploy:** Código no GitHub, Vercel deployado

### Evolution API (Render Free Tier)
- URL: `https://evolution-api-f54o.onrender.com`
- API Key: `bhsamba2024`
- Instância: `bhsamba`
- Número: `5531988887777`
- Webhook configurado: `https://bhsamba.vercel.app/api/mural/webhook`
- `syncFullHistory: true`

### Variáveis de ambiente (Vercel)
- `EVOLUTION_API_URL`: `https://evolution-api-f54o.onrender.com`
- `EVOLUTION_API_KEY`: `bhsamba2024`
- `EVOLUTION_INSTANCE`: `bhsamba`
- `MURAL_GROUP_ID`: `120363419714874389@g.us` (grupo "Bhs novo")

---

## Problema atual

**O Render Free Tier não é confiável** para manter conexão WhatsApp:
1. O serviço dorme após ~15 min sem requests
2. Quando acorda, a conexão WhatsApp cai (estado: `close`)
3. Precisa reconectar (escanear QR code) frequentemente
4. Mensagens do grupo são perdidas durante os restarts
5. O webhook não é acionado quando o serviço está dormindo
6. O polling (`/api/mural/sync`) retorna 0 mensagens porque o banco do Render não persiste as mensagens do WhatsApp

**Tentativas feitas:**
- Webhook: funciona quando o serviço está ativo, mas perde mensagens
- Polling via sync: Evolution API retorna 0 mensagens no banco
- Reconexão frequente:QR code expira rápido, inconveniente

---

## Próximos passos (quando puder pagar)

### Opção 1: Railway (recomendado)
- Criar conta no Railway (plano pago ~$5/mês)
- Deploy do Evolution API via Docker
- PostgreSQL gerenciado pelo Railway
- Não dorme entre requests → conexão WhatsApp estável

### Opção 2: Upgrade Render
- Plano pago do Render (~$7/mês)
- Não dorme → webhook funciona sempre

### Opção 3: Outro provedor
- Fly.io, DigitalOcean, etc.

---

## Como reconectar quando voltar

1. Deploy da Evolution API no novo servidor
2. Atualizar `EVOLUTION_API_URL` no Vercel
3. Criar instância `bhsamba` com webhook apontando para Vercel
4. Conectar WhatsApp escaneando QR code
5. Testar: enviar áudio no grupo → sync → verificar no admin
6. Configurar cron-job.org para sync automático a cada 5 min

---

## Arquivos importantes
- `src/app/api/mural/webhook/route.ts` — webhook Evolution API
- `src/app/api/mural/sync/route.ts` — polling para buscar áudios
- `src/app/api/admin/mural/sync/route.ts` — sync autenticado
- `src/lib/mural.ts` — funções CRUD
- `src/components/VoicMailSection.tsx` — player de áudio
- `src/app/admin/page.tsx` — painel admin com aba Recados
- `src/app/mural/page.tsx` — página pública do mural
- `prisma/schema.prisma` — schema com voiceMessages
- `DOCSIS.md` — documentação completa
- `GUIA_EVOLUTION_API.md` — guia de setup da Evolution API
