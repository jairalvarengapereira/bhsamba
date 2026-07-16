PRD - DOCUMENTO DE REQUISITOS DE PRODUTO ZapMural - Mural de Recados por
Voz Integração Automatizada de Áudios do WhatsApp para Landing Pages
Autor Jair Alvarenga Pereira Status Pronto para Revisão (Draft) Versão
1.0 Data 15/07/2026 Público-Alvo Desenvolvimento / DevOps / ALM Stack
Recomendada Next.js, Node.js, Supabase, PostgreSQL 1. Visão Geral do
Produto O ZapMural é uma solução de engajamento interativo que permite a
usuários, clientes ou fãs enviar mensagens de voz via WhatsApp e
visualizá-las diretamente em um "Mural de Recados" dinâmico incorporado
em uma landing page. O sistema oferece ao administrador uma interface de
moderação para filtrar, aprovar ou rejeitar os áudios antes que fiquem
públicos, garantindo a segurança e o decoro do conteúdo exibido. 1.1
Objetivos de Negócio Aumentar o engajamento e a interatividade em
landing pages de eventos, lançamentos de produtos, ou grupos (ex:
páginas de bandas, campanhas de marketing, etc.). Fornecer uma
experiência de usuário simples e sem fricção (enviar um áudio comum no
WhatsApp). Garantir controle total de marca através de um fluxo de
moderação robusto e em tempo real. Por que áudio? O envio de áudio no
WhatsApp é um dos hábitos de comunicação mais consolidados no mercado
brasileiro. Transformar esse áudio em um elemento visual e auditivo de
uma landing page cria uma ponte imediata de proximidade humana que
textos não conseguem replicar. 2. Jornadas do Usuário (User Stories)
Jornada A: O Usuário / Fã (O Emissor do Áudio) "Como visitante ou fã,
quero poder enviar um áudio pelo WhatsApp de forma nativa para que o meu
depoimento/ recado apareça na landing page do projeto/evento." Passo 1:
O usuário acessa a landing page e clica no botão "Enviar meu Recado"
(que abre o link do WhatsApp com um texto pré-definido). Passo 2: O
usuário envia uma mensagem de voz no WhatsApp. Passo 3: O usuário recebe
uma resposta automática confirmando que seu áudio foi recebido e está
aguardando aprovação. • • • • • • PRD - ZapMural - Confidencial 1

Jornada B: O Administrador (O Moderador) "Como administrador do site,
quero um painel de moderação simples para ouvir os áudios recebidos e
decidir quais serão publicados no mural." Passo 1: O administrador
acessa a área restrita do sistema (Dashboard). Passo 2: Ele visualiza a
lista de áudios pendentes, com informações do remetente (nome/número),
data, e um player para audição prévia. Passo 3: Ele clica em "Aprovar"
(o áudio entra na lista da landing page imediatamente) ou "Rejeitar" (o
áudio é descartado/arquivado). • • • PRD - ZapMural - Confidencial 2

3.  Requisitos Funcionais (FR) Os requisitos abaixo detalham as
    funcionalidades necessárias para o MVP (Minimum Viable Product): ID
    Funcionalidade Descrição detalhada Prioridade RF-01 Recepção via
    Webhook O sistema deve expor um endpoint de API (Webhook) capaz de
    receber payloads de áudio enviados por instâncias do WhatsApp
    (Evolution API, Z-API ou Cloud API). ALTA RF-02 Download e
    Armazenamento A API deve baixar o binário do áudio recebido e
    salvá-lo de forma persistente em um serviço de Storage (ex: Supabase
    Storage ou AWS S3). ALTA RF-03 Persistência em Banco O banco de
    dados deve registrar os metadados do áudio (ID único, URL do
    arquivo, número do remetente, status "pendente", timestamp). ALTA
    RF-04 Painel de Moderação Uma interface administrativa web
    (protegida por autenticação) onde o administrador possa dar play,
    aprovar ou deletar os áudios recebidos. ALTA RF-05 Conversão de
    Áudio (Opcional) Converter áudios nativos do WhatsApp (.ogg / Opus)
    para MP3 utilizando ffmpeg para garantir 100% de compatibilidade com
    navegadores antigos. MÉDIA RF-06 Mural na Landing Page Componente em
    React que consome a API do banco e renderiza os áudios aprovados com
    controle de reprodução customizado (Play/Pause/Progresso). ALTA
    RF-07 Feedback no WhatsApp Opcionalmente enviar mensagem de texto
    automática confirmando o recebimento do áudio do usuário através do
    mesmo número. BAIXA
4.  Requisitos Não-Funcionais (NFR) Compatibilidade do Player: O player
    de áudio na landing page deve ser 100% responsivo, funcionando
    perfeitamente em dispositivos móveis (Android e iOS). Segurança: O
    endpoint do webhook do WhatsApp deve validar a autenticidade das
    requisições recebidas (usando API Tokens ou Secrets). A área
    administrativa deve ser protegida por autenticação robusta.
    Desempenho: A landing page não deve sofrer com lentidão no
    carregamento. Os áudios devem ser carregados sob demanda (lazy
    loading / streaming direto da CDN do Storage). Escalabilidade: A
    modelagem de dados e armazenamento deve suportar picos de tráfego,
    especialmente em cenários de eventos ao vivo. Atenção ao Formato de
    Áudio e CORS • • • • PRD - ZapMural - Confidencial 3

Certifique-se de que a política de CORS (Cross-Origin Resource Sharing)
do seu bucket de Storage (Supabase/ S3) esteja configurada para permitir
requisições de origem cruzada a partir da URL da sua landing page, caso
contrário, o navegador bloqueará a reprodução dos áudios. 5. Proposta de
Arquitetura de Dados Esquema de banco de dados sugerido
(PostgreSQL/Supabase) para o controle dos recados: CREATE TABLE messages
( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), sender_phone
VARCHAR(20) NOT NULL, -- Número do WhatsApp do remetente sender_name
VARCHAR(100), -- Nome do contato (se extraído da API) audio_url TEXT NOT
NULL, -- Link público do arquivo no Storage duration INTEGER, -- Duração
em segundos (opcional) status VARCHAR(20) DEFAULT 'pending', --
'pending', 'approved', 'rejected' created_at TIMESTAMP WITH TIME ZONE
DEFAULT timezone('utc'::text, now()) NOT NULL, updated_at TIMESTAMP WITH
TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL ); -- Índice
para carregamento rápido dos áudios aprovados na landing page CREATE
INDEX idx_messages_approved ON messages (status) WHERE status =
'approved'; 6. Próximos Passos & ALM (Mapeamento de Épicos) Para guiar a
implementação e traduzir este documento diretamente em tarefas no seu
software de ALM (como Jira, Azure DevOps ou Trello), sugere-se a
seguinte quebra de Épicos: ÉPICO 1 \[Infra & WhatsApp API\]:
Provisionamento do servidor/instância da API de WhatsApp, configuração
de Webhooks e autenticação. ÉPICO 2 \[Backend & Armazenamento\]: Criação
do endpoint de recebimento, rotinas de download do áudio, integração com
o Storage (Supabase/S3) e persistência de metadados. ÉPICO 3 \[Mural
Frontend\]: Implementação da rota de listagem de áudios aprovados na API
e do componente de player de áudio na Landing Page (React). ÉPICO 4
\[Painel Administrativo\]: Criação do fluxo de login e painel de
moderação para aprovação/rejeição das mensagens recebidas. 1. 2. 3. 4.
PRD - ZapMural - Confidencial 4
