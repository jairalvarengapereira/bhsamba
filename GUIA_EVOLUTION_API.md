# Guia de Configuração - Evolution API no Render

## Passo 1: Criar conta no Render

1. Acesse: **https://render.com**
2. Clique em **"Get Started for Free"**
3. Crie conta com GitHub (recomendado) ou email
4. Confirme o email

---

## Passo 2: Criar banco de dados PostgreSQL

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"PostgreSQL"**
3. Preencha:
   - **Name:** `evolution-db`
   - **Database:** `evolution`
   - **User:** `admin`
   - **Region:** Oregon (ou mais perto do Brasil)
4. Clique em **"Create Database"**
5. **Copie a "Internal Database URL"** (vai precisar depois)
   - Formato: `postgresql://admin:senha@xxx.ap-southeast-1.render.com:5432/evolution`

---

## Passo 3: Criar serviço Web Service

1. No dashboard, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu **GitHub**
4. Selecione ou busque o repositório, ou use **"Deploy from Docker image"**
5. Se usar Docker image, insira: `atendai/evolution-api`
6. Preencha:
   - **Name:** `evolution-api`
   - **Region:** Oregon
   - **Instance Type:** **Starter (R$ ~30/mês)**
   - **Docker Image:** `atendai/evolution-api`
7. Em **"Environment Variables"**, adicione:

```
SERVER_URL=https://evolution-api.onrender.com
AUTHENTICATION_API_KEY=bhsamba2024
DB_CONNECTION_URI=cole_a_url_do_banco_aqui
DB_DRIVER=postgres
DB_PROVIDER=postgresql
```

8. Clique **"Create Web Service"**
9. Aguarde o deploy (pode levar 5-10 minutos)

---

## Passo 4: Criar instância do WhatsApp

Após o deploy, acesse a API. Use o Postman, Insomnia ou curl:

### Criar instância:
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

**Retorno:** JSON com QR Code em base64

---

## Passo 5: Conectar WhatsApp

1. Abra o WhatsApp no celular
2. Vá em **"Dispositivos conectados"** (Configurações > Dispositivos conectados)
3. Clique em **"Vincular dispositivo"**
4. Escaneie o QR Code retornado pela API
5. Pronto! WhatsApp conectado

---

## Passo 6: Configurar Webhook para o Grupo

### Primeiro, obtenha o ID do grupo:

1. No WhatsApp Web/Desktop, abra o grupo
2. Clique no nome do grupo > **"Informações do grupo"**
3. Role até o final - o ID aparece no formato: `1203630456789@g.us`

### Configure o webhook:

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

## Passo 7: Configurar no Vercel

1. Acesse: **https://vercel.com**
2. Selecione o projeto **bhsamba**
3. Vá em **Settings > Environment Variables**
4. Adicione:

```
EVOLUTION_API_URL=https://evolution-api.onrender.com
EVOLUTION_API_KEY=bhsamba2024
EVOLUTION_INSTANCE=bhsamba
MURAL_GROUP_ID=1203630456789@g.us
```

5. Clique em **"Save"**
6. Faça **redeploy** do projeto

---

## Passo 8: Cadastrar telefones dos músicos

1. Acesse: **https://bhsamba.vercel.app/admin**
2. Faça login
3. Vá na aba **"Músicos"**
4. Edite cada músico e adicione o **número de WhatsApp** no formato: `5531999998888`
5. Salve

---

## Fluxo Final

```
Músico grava áudio no grupo do WhatsApp
         ↓
Evolution API recebe (no Render)
         ↓
Webhook envia para bhsamba.vercel.app/api/mural/webhook
         ↓
Site identifica músico pelo número
         ↓
Baixa áudio → Salva no Supabase
         ↓
Salva metadados → PostgreSQL (status: pending)
         ↓
Admin aprova no painel (/admin → Recados)
         ↓
Áudio aparece no mural (/mural)
```

---

## Solução de Problemas

### Erro: "Cannot read property 'pushName' of undefined"
- Verifique se o webhook está configurado corretamente
- Verifique se o grupo está na lista de eventos

### Erro: "Table voice_messages does not exist"
- Execute: `npx prisma db push`

### Áudio não toca no mural
- Verifique se o CORS do Supabase está configurado
- Verifique se o arquivo foi salvo no Storage

### Webhook não recebe mensagens
- Verifique se o ID do grupo está correto
- Verifique os logs no Render

---

## Custos Estimados

| Serviço | Custo |
|---------|-------|
| Render Starter | ~R$ 30/mês |
| Render Database | Incluso |
| Supabase Free | R$ 0 |
| Vercel Free | R$ 0 |
| **Total** | **~R$ 30/mês** |

---

**Autor:** Jair Alvarenga Pereira
**Data:** 16/07/2026
