 Chatbot RAG com Banco Vetorial

Sistema de chatbot inteligente que utiliza **Retrieval-Augmented Generation (RAG)** com banco de dados vetorial para fornecer respostas contextualizadas baseadas em documentos personalizados.

> **Nota:** Este projeto foi desenvolvido como uma Prova de Conceito (POC) para demonstrar a implementação de embeddings e busca vetorial em aplicações de IA.

## Sobre o Projeto

Este chatbot permite que usuários façam upload de documentos (PDF, TXT) para diferentes entidades/contextos, processa esses documentos usando embeddings de IA e responde perguntas baseadas no conteúdo indexado. O sistema utiliza busca vetorial para encontrar os trechos mais relevantes dos documentos e gerar respostas precisas.

### Principais Funcionalidades

- **Upload e Processamento de Documentos**: Suporte para PDF e TXT
- **Embeddings com Google Generative AI**: Vetorização automática de documentos
- **Busca Vetorial Híbrida**: FAISS + PostgreSQL com pgvector
- **Chat em Tempo Real**: WebSocket para comunicação assíncrona
- **Multi-entidades**: Gerenciamento de múltiplos contextos/chatbots
- **Processamento Assíncrono**: Filas com Celery para indexação de documentos

## Tecnologias Utilizadas

### Backend
- **Django** 5.2 + **Django REST Framework**
- **PostgreSQL** com extensão **pgvector** para armazenamento de embeddings
- **FAISS** para busca vetorial de alta performance
- **Celery** + **Redis** para processamento assíncrono
- **Django Channels** + **Daphne** para WebSocket
- **LangChain** para orquestração de LLM
- **Google Generative AI** (Gemini) para embeddings e geração de texto

### Frontend
- **React** com **TypeScript**
- **Vite** como bundler
- **Axios** para comunicação HTTP
- **WebSocket** para chat em tempo real
- **Mantine UI** para componentes

### Infraestrutura
- **Docker** + **Docker Compose** para containerização
- **Redis** para cache e message broker

## Arquitetura

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │◄───────►│   Django API │◄───────►│ PostgreSQL  │
│   (React)   │WebSocket│   + Daphne   │         │  + pgvector │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ▼
                        ┌──────────────┐         ┌─────────────┐
                        │    Celery    │◄───────►│    Redis    │
                        │   Workers    │         │             │
                        └──────────────┘         └─────────────┘
                              │
                              ▼
                        ┌──────────────┐         ┌─────────────┐
                        │   FAISS      │         │   Google    │
                        │   Index      │         │   Gemini    │
                        └──────────────┘         └─────────────┘
```

### Fluxo de Processamento

1. **Upload de Documento**: Usuário envia documento via frontend
2. **Tarefa Assíncrona**: Celery processa o documento em background
3. **Chunking**: Documento é dividido em chunks de texto
4. **Embedding**: Cada chunk é convertido em vetor usando Google Generative AI
5. **Indexação**: Vetores são armazenados no PostgreSQL (pgvector) e FAISS
6. **Consulta**: Perguntas do usuário são vetorizadas e buscadas no índice
7. **RAG**: Top-k chunks mais relevantes são enviados ao LLM para gerar resposta
8. **Resposta**: LLM gera resposta contextualizada baseada nos documentos

## Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados
- Chave de API do Google Generative AI ([obter aqui](https://makersuite.google.com/app/apikey))

### Configuração

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd ChatBot-Docs
   ```

2. **Configure o Backend**
   ```bash
   cd chatbot
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e adicione suas credenciais:
   ```env
   GOOGLE_API_KEY=sua_chave_api_aqui
   DJANGO_SECRET_KEY=sua_secret_key_aqui
   POSTGRES_DB=chatbot_db
   POSTGRES_USER=chatbot_user
   POSTGRES_PASSWORD=sua_senha_aqui
   ```

3. **Configure o Frontend**
   ```bash
   cd ../chat-app-front
   cp .env.example .env
   ```
   
   Ajuste a URL da API se necessário:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

### Executando com Docker

1. **Inicie os containers**
   ```bash
   cd chatbot
   docker-compose up -d
   ```

2. **Execute as migrações do banco**
   ```bash
   docker-compose exec web python manage.py migrate
   ```

3. **Crie um superusuário (opcional)**
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

4. **Inicie o Frontend**
   ```bash
   cd ../chat-app-front
   npm install
   npm run dev
   ```

5. **Acesse a aplicação**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api
   - Admin Django: http://localhost:8000/admin

### Comandos Úteis

```bash
# Ver logs dos serviços
docker-compose logs -f

# Ver logs apenas do Django
docker-compose logs -f web

# Ver logs do Celery worker
docker-compose logs -f celery_worker

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (atenção: apaga dados do banco)
docker-compose down -v

# Executar comando Django customizado
docker-compose exec web python manage.py <comando>

# Acessar shell do Django
docker-compose exec web python manage.py shell

# Acessar terminal do container
docker-compose exec web /bin/bash
```

## Estrutura do Projeto

```
.
├── chatbot/                # Backend Django
│   ├── chat/              # App principal do chat
│   │   ├── models.py      # Modelos (Entidade, Documento, Message)
│   │   ├── views.py       # APIs REST
│   │   ├── consumers.py   # WebSocket consumers
│   │   ├── tasks.py       # Tarefas Celery
│   │   └── utils.py       # Funções de embedding e RAG
│   ├── automations/       # App de automações
│   ├── chatbot/           # Configurações do projeto
│   ├── docker-compose.yml # Orquestração de containers
│   └── requirements.txt   # Dependências Python
│
└── chat-app-front/        # Frontend React
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── pgapi/        # Cliente API
    │   ├── types/        # Tipos TypeScript
    │   └── hooks/        # Custom hooks
    └── package.json       # Dependências Node

```

## Segurança

- Variáveis sensíveis em arquivos `.env` (não versionados)
- `.gitignore` configurado para dados sensíveis
- CORS configurado no backend
- Arquivos de upload armazenados fora do controle de versão

## Notas Importantes

- Este projeto é uma **Prova de Conceito** para fins educacionais e de demonstração
- Para produção, considere:
  - Implementar autenticação e autorização robusta
  - Configurar HTTPS e certificados SSL
  - Otimizar indexação de documentos grandes
  - Implementar rate limiting e throttling
  - Configurar backup automático do banco de dados
  - Usar serviços gerenciados para Redis e PostgreSQL

## Contribuições

Este é um projeto de portfólio pessoal, mas sugestões e feedback são sempre bem-vindos!

## Licença

Este projeto é de código aberto para fins educacionais.

---

**Desenvolvido como POC para demonstração de conceitos de RAG, embeddings e banco vetorial para um cliente**