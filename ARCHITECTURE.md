# Architecture - SNCF Travel Assistant

## 📐 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         Utilisateurs                             │
│                    (Voyageurs + Admins)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Databricks App                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Frontend (Next.js)                           │   │
│  │  - Pages utilisateur (chatbot)                            │   │
│  │  - Dashboard admin (KPIs, analytics)                      │   │
│  │  - UI Components (shadcn/ui)                              │   │
│  └────────────────────┬──────────────────────────────────────┘   │
│                       │                                           │
│                       ▼                                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Backend (FastAPI)                            │   │
│  │  - API REST endpoints                                     │   │
│  │  - Business logic                                         │   │
│  │  - Data aggregation                                       │   │
│  └────────┬─────────────────────────────┬──────────────────┘   │
└───────────┼─────────────────────────────┼──────────────────────┘
            │                             │
            ▼                             ▼
┌───────────────────────┐    ┌────────────────────────────┐
│ Databricks            │    │  Unity Catalog             │
│ Model Serving         │    │  - Tables Delta            │
│ - Agent AI            │    │  - Données conversations   │
│ - LLM Fine-tuné       │    │  - Analytics               │
│ - RAG                 │    │  - User data               │
└───────────────────────┘    └────────────────────────────┘
```

## 🏗️ Composants

### 1. Frontend (Next.js) - `frontend/`

**Technologie** : Next.js 14+, React, TypeScript, Tailwind CSS, shadcn/ui

**Structure** :
```
frontend/
├── app/
│   ├── page.tsx                 # Page d'accueil utilisateur
│   ├── login/page.tsx           # Authentification
│   ├── admin/                   # Zone administration
│   │   ├── page.tsx             # Dashboard principal
│   │   ├── analytics/page.tsx   # Analytics détaillées
│   │   ├── marketing/page.tsx   # Marketing insights
│   │   └── settings/page.tsx    # Paramètres
│   └── api/                     # API Routes Next.js (optionnel)
│       ├── chat/route.ts        # Proxy vers backend
│       ├── trips/route.ts
│       └── analytics/route.ts
├── components/
│   ├── admin/                   # Composants admin
│   │   ├── kpi-card.tsx
│   │   ├── usage-chart.tsx
│   │   └── request-distribution-chart.tsx
│   └── ui/                      # Composants UI réutilisables
└── lib/
    ├── utils.ts
    ├── databricks-client.ts     # Client pour API backend
    └── agent-client.ts
```

**Responsabilités** :
- Interface utilisateur (chatbot conversationnel)
- Dashboard administrateur avec visualisations
- Gestion de l'état client (React hooks, Context)
- Routing et navigation
- Validation côté client
- Responsive design

**Points d'intégration** :
- Appelle le backend FastAPI via fetch/axios
- Peut utiliser les API Routes Next.js comme proxy (optionnel)
- SSR/SSG pour performance optimale

### 2. Backend (FastAPI) - `backend/`

**Technologie** : Python 3.10+, FastAPI, Uvicorn, Pydantic

**Structure** :
```
backend/
├── server.py               # Application FastAPI principale
├── requirements.txt        # Dépendances Python
├── __init__.py
├── models/                 # Modèles Pydantic (à créer si besoin)
│   ├── chat.py
│   ├── trip.py
│   └── analytics.py
├── services/               # Services métier (à créer si besoin)
│   ├── agent_service.py    # Communication avec Agent AI
│   ├── data_service.py     # Requêtes Delta tables
│   └── analytics_service.py
└── utils/                  # Utilitaires
    ├── auth.py
    └── databricks.py
```

**Responsabilités** :
- Exposer les endpoints API REST
- Orchestrer les appels à l'Agent AI (Model Serving)
- Agréger les données depuis Unity Catalog
- Gestion des sessions/conversations
- Authentification et autorisation (à implémenter)
- Servir les fichiers statiques du frontend

**Endpoints principaux** :

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Health check |
| `/api/chat` | POST | Envoyer un message au chatbot |
| `/api/trips` | GET | Infos voyage utilisateur |
| `/api/admin/kpis` | GET | KPIs dashboard admin |
| `/api/admin/charts` | GET | Données graphiques |
| `/api/analytics` | GET | Analytics marketing |

**Configuration** :
- Variables d'environnement (secrets Databricks)
- CORS configuré pour frontend
- Middleware de logging et monitoring

### 3. Agent AI (Databricks Model Serving)

**Technologie** : LLM (GPT, Llama, etc.), RAG, Vector Search

**Composants** :
- **LLM de base** : Modèle de langage (OpenAI, Anthropic, open-source)
- **Fine-tuning** : Entraîné sur données SNCF (horaires, FAQ, etc.)
- **RAG (Retrieval-Augmented Generation)** :
  - Knowledge base : Documentation SNCF, horaires, politiques
  - Vector Search : Databricks Vector Search
  - Embedding model : pour encoder queries/documents

**Fonctionnalités** :
- Répondre aux questions sur les horaires, retards, connexions
- Recommander des services (taxi, hôtel, etc.)
- Gérer le contexte conversationnel
- Personnalisation basée sur l'historique utilisateur

**Déploiement** :
- Model Serving Endpoint Databricks
- Autoscaling (scale to zero en dev, toujours actif en prod)
- Multiple workload sizes (Small/Medium/Large)

### 4. Data Layer (Unity Catalog)

**Catalog** : `sncf_prod` (ou `sncf_dev`, `sncf_staging`)
**Schema** : `travel_assistant`

**Tables principales** :

```sql
-- Conversations
CREATE TABLE sncf_prod.travel_assistant.conversations (
  conversation_id STRING,
  user_id STRING,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  message_count INT,
  resolved BOOLEAN,
  satisfaction_score FLOAT
);

-- Messages
CREATE TABLE sncf_prod.travel_assistant.messages (
  message_id STRING,
  conversation_id STRING,
  role STRING,  -- 'user' ou 'assistant'
  content STRING,
  timestamp TIMESTAMP,
  metadata MAP<STRING, STRING>
);

-- Bookings (taxis, etc.)
CREATE TABLE sncf_prod.travel_assistant.bookings (
  booking_id STRING,
  conversation_id STRING,
  user_id STRING,
  service_type STRING,  -- 'taxi', 'hotel', etc.
  status STRING,
  created_at TIMESTAMP,
  amount DECIMAL(10, 2)
);

-- User trips
CREATE TABLE sncf_prod.travel_assistant.user_trips (
  trip_id STRING,
  user_id STRING,
  train_number STRING,
  departure_station STRING,
  arrival_station STRING,
  departure_time TIMESTAMP,
  arrival_time TIMESTAMP,
  status STRING,
  delay_minutes INT
);

-- Analytics aggregations (materialized views)
CREATE TABLE sncf_prod.travel_assistant.daily_kpis (
  date DATE,
  total_conversations INT,
  unique_users INT,
  taxi_bookings INT,
  conversion_rate FLOAT,
  avg_response_time FLOAT,
  avg_satisfaction FLOAT
);
```

**Jobs Databricks** :
- Pipeline quotidien pour calculer les KPIs
- Agrégations pour le dashboard
- Nettoyage de données
- Training data preparation pour le modèle

### 5. Databricks Asset Bundle

**Fichier** : `databricks.yml`

**Ressources gérées** :
- **App** : Application frontend + backend
- **Model Serving Endpoint** : Agent AI
- **Jobs** : Pipelines de données
- **Permissions** : Accès Unity Catalog, secrets

**Environnements** :
- **dev** : Développement, ressources minimales
- **staging** : Pre-production, tests
- **prod** : Production, haute disponibilité

**Workflow CI/CD** :
```
Code push → GitHub Actions → databricks bundle validate → 
databricks bundle deploy → Tests automatisés → Monitoring
```

## 🔄 Flux de Données

### 1. Requête Utilisateur (Chatbot)

```
User input
   ↓
Frontend Next.js
   ↓ POST /api/chat
Backend FastAPI
   ↓ Validation
   ↓ Enrichissement (user context)
   ↓ POST /serving-endpoints/agent/invocations
Agent AI (Model Serving)
   ↓ RAG: Récupère contexte pertinent
   ↓ LLM: Génère réponse
   ↓ Response
Backend FastAPI
   ↓ Log conversation → Delta Table
   ↓ Response
Frontend Next.js
   ↓ Display
User sees response
```

### 2. Dashboard Admin

```
Admin accède au dashboard
   ↓
Frontend Next.js
   ↓ GET /api/admin/kpis
Backend FastAPI
   ↓ Query Unity Catalog
SELECT * FROM daily_kpis WHERE date >= current_date - 7
   ↓ Agrégations
   ↓ Response JSON
Frontend Next.js
   ↓ Visualisation (charts)
Admin voit KPIs
```

### 3. Pipeline Analytics (Job quotidien)

```
Cron trigger (2h du matin)
   ↓
Databricks Job
   ↓ Notebook: compute_daily_kpis.py
   ↓ Lecture des tables conversations, messages, bookings
   ↓ Agrégations Spark
INSERT INTO daily_kpis VALUES (...)
   ↓
   ↓ Notebook: update_dashboard_data.py
   ↓ Mise à jour des vues matérialisées
   ↓ Envoi notifications si anomalies
Job terminé
```

## 🔐 Sécurité

### 1. Authentification

**Options** :
- **OAuth 2.0** : Via Azure AD, Okta, etc.
- **JWT** : Tokens émis après login
- **Databricks Auth** : Pour les API internes

**Implémentation** (à faire) :
```python
# backend/utils/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(token: str):
    # Vérifier le JWT
    # Ou appeler Databricks auth
    pass

@app.get("/api/admin/kpis", dependencies=[Depends(verify_token)])
async def get_kpis():
    # Seulement accessible avec token valide
    pass
```

### 2. Autorisation

**Niveaux** :
- **User** : Accès au chatbot, ses données personnelles
- **Admin** : Accès au dashboard, toutes les données
- **Super Admin** : Gestion des settings

**Databricks** :
- Unity Catalog ACLs pour les tables
- Model Serving permissions (CAN_QUERY)
- Workspace permissions

### 3. Secrets

**Databricks Secrets** :
- Tokens d'accès
- API keys (Agent AI, services externes)
- Database credentials

**Rotation** :
- Automatisée tous les 90 jours
- Alertes avant expiration

## 📊 Monitoring et Observabilité

### 1. Métriques Applicatives

**Backend (FastAPI)** :
- Request count, latency, errors (par endpoint)
- Response times (p50, p95, p99)
- Uptime / downtime

**Agent AI** :
- Inference time
- Token usage
- Error rate
- Cache hit rate (si RAG caching)

**Database** :
- Query performance
- Table sizes
- Row counts

### 2. Logs

**Centralisés** :
- Application logs → Databricks App logs
- Job logs → Databricks Jobs
- Audit logs → Databricks audit logs

**Format structuré (JSON)** :
```json
{
  "timestamp": "2026-01-21T10:30:00Z",
  "level": "INFO",
  "endpoint": "/api/chat",
  "user_id": "user123",
  "conversation_id": "conv456",
  "response_time_ms": 1234,
  "status_code": 200
}
```

### 3. Alertes

**Déclencheurs** :
- Error rate > 5%
- Latency > 5s (p95)
- App down
- Model serving endpoint down
- Job failure

**Canaux** :
- Email
- Slack
- PagerDuty (pour prod)

## 🚀 Scalabilité

### 1. Backend

**Horizontal scaling** :
- Databricks Apps auto-scale basé sur CPU/RAM
- Multiple instances derrière load balancer

**Optimisations** :
- Caching (Redis pour sessions, responses fréquentes)
- Connection pooling pour DB
- Async I/O (FastAPI nativement async)

### 2. Agent AI

**Model Serving** :
- Auto-scaling basé sur throughput
- GPU workloads pour inference rapide
- Model caching

**RAG** :
- Vector Search optimisé
- Index pre-warming
- Query caching

### 3. Data Layer

**Delta Lake** :
- Partitioning (par date, user_id)
- Z-ordering pour queries fréquentes
- Vacuum régulier

**Compute** :
- Serverless SQL pour queries ad-hoc
- Clusters dédiés pour jobs lourds

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Databricks

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install Databricks CLI
        run: pip install databricks-cli
      
      - name: Configure Databricks
        env:
          DATABRICKS_HOST: ${{ secrets.DATABRICKS_HOST }}
          DATABRICKS_TOKEN: ${{ secrets.DATABRICKS_TOKEN }}
        run: |
          databricks configure --token <<EOF
          $DATABRICKS_HOST
          $DATABRICKS_TOKEN
          EOF
      
      - name: Validate Bundle
        run: databricks bundle validate -t dev
      
      - name: Deploy
        run: databricks bundle deploy -t dev
      
      - name: Run Tests
        run: pytest tests/
      
      - name: Health Check
        run: |
          URL=$(databricks apps get sncf-travel-assistant-dev --output json | jq -r '.url')
          curl -f $URL/health || exit 1
```

## 📈 Évolutions Futures

### Phase 2
- Multilingue (anglais, espagnol, etc.)
- Intégration paiements directs
- Application mobile native

### Phase 3
- Voice assistant (speech-to-text, text-to-speech)
- Proactive notifications (retards, alternatives)
- Gamification / loyalty program

### Phase 4
- Expansion à d'autres modes de transport
- Intégration MaaS (Mobility as a Service)
- Predictive analytics (demande, pannes)

## 📚 Documentation Technique

- **API** : `/docs` (Swagger auto-généré par FastAPI)
- **Architecture** : Ce document
- **Déploiement** : `DEPLOYMENT.md`
- **Commandes** : `COMMANDS.md`
- **README** : `README.md`
