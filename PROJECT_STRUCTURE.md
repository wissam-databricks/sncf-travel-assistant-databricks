# Structure du Projet - SNCF Travel Assistant

## 📂 Arborescence Complète

```
databricks_challenge/
│
├── 📁 frontend/              # Frontend Next.js (EXISTANT - NE PAS MODIFIER)
│   ├── app/
│   │   ├── page.tsx                # Page d'accueil chatbot
│   │   ├── login/
│   │   │   └── page.tsx            # Authentification
│   │   ├── admin/                  # Zone administration
│   │   │   ├── page.tsx            # Dashboard principal
│   │   │   ├── layout.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── marketing/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/                    # API Routes Next.js (optionnel)
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   ├── trips/
│   │   │   │   └── route.ts
│   │   │   └── analytics/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── kpi-card.tsx
│   │   │   ├── usage-chart.tsx
│   │   │   └── request-distribution-chart.tsx
│   │   ├── theme-provider.tsx
│   │   └── ui/                     # Composants shadcn/ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       └── ... (50+ composants)
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── agent-client.ts
│   │   └── databricks-client.ts
│   │
│   ├── public/                     # Assets statiques
│   │   ├── icon.svg
│   │   ├── placeholder-logo.png
│   │   └── ...
│   │
│   ├── package.json
│   ├── next.config.mjs
│   ├── tsconfig.json
│   └── postcss.config.mjs
│
├── 📁 backend/                     # Backend FastAPI (NOUVEAU)
│   ├── server.py                   # ✅ Application FastAPI principale
│   ├── requirements.txt            # ✅ Dépendances Python
│   └── __init__.py                 # ✅ Module Python
│
├── 📄 app.yaml                     # ✅ Configuration Databricks App
├── 📄 databricks.yml               # ✅ Configuration Asset Bundle
│
├── 📄 README.md                    # ✅ Documentation principale
├── 📄 DEPLOYMENT.md                # ✅ Guide de déploiement détaillé
├── 📄 COMMANDS.md                  # ✅ Référence des commandes CLI
├── 📄 ARCHITECTURE.md              # ✅ Documentation architecture
├── 📄 PROJECT_STRUCTURE.md         # ✅ Ce fichier
│
├── 📄 .gitignore                   # ✅ Fichiers à ignorer par Git
└── 📄 .env.example                 # ⚠️  À créer manuellement (bloqué)
```

## 📋 Fichiers Créés (Nouveau Backend)

### 1. Backend Python

#### `backend/server.py`
- **Type** : Application FastAPI
- **Lignes** : ~350
- **Rôle** : 
  - Serveur API REST principal
  - Endpoints pour chatbot, trips, admin KPIs, analytics
  - Sert les fichiers statiques du frontend
  - Connexion à l'Agent AI Databricks
- **Endpoints** :
  - `GET /health` - Health check
  - `POST /api/chat` - Chatbot
  - `GET /api/trips` - Informations voyage
  - `GET /api/admin/kpis` - KPIs dashboard
  - `GET /api/admin/charts` - Données graphiques
  - `GET /api/analytics` - Analytics marketing
- **TODO dans le code** :
  - Ligne 81 : Implémenter l'appel réel à l'Agent AI
  - Ligne 134 : Connecter aux vraies tables Delta
  - Ligne 161 : Récupérer depuis Delta tables

#### `backend/requirements.txt`
- **Type** : Dépendances Python
- **Contenu** :
  - FastAPI 0.109.0
  - Uvicorn 0.27.0
  - Httpx 0.26.0 (pour appels Agent AI)
  - Pydantic 2.5.3
  - Gunicorn 21.2.0 (production)

#### `backend/__init__.py`
- **Type** : Module Python
- **Rôle** : Marquer le dossier comme package Python

### 2. Configuration Databricks

#### `app.yaml`
- **Type** : Configuration Databricks App
- **Rôle** : 
  - Définir la commande de démarrage
  - Variables d'environnement (AGENT_ENDPOINT_URL, etc.)
  - Configuration ressources (warehouse, volumes)
- **À personnaliser** :
  - `<workspace-url>` → URL de votre workspace
  - `<endpoint-name>` → Nom de votre Model Serving Endpoint

#### `databricks.yml`
- **Type** : Configuration Asset Bundle
- **Rôle** :
  - Définir le bundle et ses ressources
  - Configurer les environnements (dev/staging/prod)
  - Gérer le déploiement automatisé
- **Ressources définies** :
  - App : `sncf_travel_app`
  - Model Serving Endpoint : `sncf_travel_agent`
  - Jobs : `analytics_pipeline` (pipeline quotidien)
- **Targets** :
  - `dev` : Développement (ressources Small)
  - `staging` : Pre-prod (ressources Medium)
  - `prod` : Production (ressources Large)
- **À personnaliser** :
  - Remplacer tous les `<workspace-url>`
  - Adapter catalog/schema selon vos besoins

### 3. Documentation

#### `README.md`
- **Sections** :
  - Structure du projet
  - Guide de déploiement rapide
  - Développement local
  - Endpoints API
  - Configuration
  - Monitoring
  - Troubleshooting
  - TODO / Prochaines étapes

#### `DEPLOYMENT.md`
- **Guide complet** :
  - Prérequis détaillés
  - Configuration initiale (CLI, secrets)
  - Étapes de déploiement pas-à-pas
  - Déploiement multi-environnements
  - Tests post-déploiement
  - Gestion de l'app
  - Troubleshooting avancé

#### `COMMANDS.md`
- **Référence CLI** :
  - Toutes les commandes Databricks CLI
  - Bundle management
  - App management
  - Secrets management
  - Model Serving
  - Scripts utiles
  - Exemples de tests

#### `ARCHITECTURE.md`
- **Documentation technique** :
  - Vue d'ensemble architecture
  - Description de chaque composant
  - Flux de données
  - Sécurité
  - Monitoring
  - Scalabilité
  - CI/CD

#### `PROJECT_STRUCTURE.md` (ce fichier)
- **Arborescence complète**
- **Description des fichiers**
- **Roadmap implémentation**

### 4. Autres Fichiers

#### `.gitignore`
- **Type** : Configuration Git
- **Contenu** :
  - Python artifacts (__pycache__, *.pyc)
  - Virtual environments (venv/, env/)
  - Secrets (.env, .env.local)
  - Databricks artifacts (.databricks/)
  - IDE configs (.vscode/, .idea/)

## 🎯 Fichiers à Créer Manuellement

### `.env` (pour développement local)
```bash
# Copier depuis .env.example et remplir les valeurs
AGENT_ENDPOINT_URL=https://your-workspace.cloud.databricks.com/serving-endpoints/your-endpoint/invocations
DATABRICKS_TOKEN=your-token-here
WORKSPACE_URL=https://your-workspace.cloud.databricks.com
PORT=8000
HOST=0.0.0.0
```

### `backend/models/` (optionnel - pour structurer le code)
```
backend/models/
├── __init__.py
├── chat.py          # Modèles Pydantic pour chat
├── trip.py          # Modèles pour trips
└── analytics.py     # Modèles pour analytics
```

### `backend/services/` (optionnel - séparation des concerns)
```
backend/services/
├── __init__.py
├── agent_service.py     # Logique d'appel à l'Agent AI
├── data_service.py      # Requêtes Delta tables
└── analytics_service.py # Calculs analytics
```

### `tests/` (recommandé)
```
tests/
├── __init__.py
├── test_api.py          # Tests des endpoints
├── test_agent.py        # Tests appel Agent AI
└── test_data.py         # Tests requêtes data
```

### `notebooks/` (pour les jobs Databricks)
```
notebooks/
├── compute_daily_kpis.py      # Calcul KPIs quotidiens
└── update_dashboard_data.py   # Mise à jour dashboard
```

### `.github/workflows/` (CI/CD)
```
.github/workflows/
├── deploy-dev.yml       # Deploy automatique sur dev
├── deploy-staging.yml   # Deploy manuel sur staging
└── deploy-prod.yml      # Deploy manuel sur prod (avec approvals)
```

## 🚀 Roadmap d'Implémentation

### ✅ Phase 1 : Configuration Initiale (COMPLÉTÉ)
- [x] Structure du projet
- [x] Backend FastAPI avec endpoints mock
- [x] Configuration Databricks App (app.yaml)
- [x] Configuration Asset Bundle (databricks.yml)
- [x] Documentation complète

### 🔄 Phase 2 : Connexion Agent AI (À FAIRE)
- [ ] Implémenter l'appel réel à l'Agent AI dans `server.py`
- [ ] Gérer le contexte conversationnel
- [ ] Persister les conversations dans Delta tables
- [ ] Tester avec un vrai Model Serving Endpoint

### 🔄 Phase 3 : Data Layer (À FAIRE)
- [ ] Créer les tables Delta dans Unity Catalog
- [ ] Implémenter les requêtes réelles (remplacer les mocks)
- [ ] Créer les notebooks pour les jobs analytics
- [ ] Configurer les jobs dans databricks.yml

### 🔄 Phase 4 : Frontend (À FAIRE)
- [ ] Builder le frontend Next.js (`npm run build`)
- [ ] Configurer le backend pour servir les fichiers statiques
- [ ] Tester l'intégration frontend-backend
- [ ] Optimiser les performances (SSR/SSG)

### 🔄 Phase 5 : Sécurité & Auth (À FAIRE)
- [ ] Implémenter l'authentification (OAuth/JWT)
- [ ] Gérer les autorisations (user/admin)
- [ ] Configurer les ACLs Unity Catalog
- [ ] Rotation automatique des secrets

### 🔄 Phase 6 : Déploiement (À FAIRE)
- [ ] Configurer les secrets Databricks
- [ ] Personnaliser databricks.yml avec les vraies URLs
- [ ] Valider le bundle : `databricks bundle validate`
- [ ] Déployer sur dev : `databricks bundle deploy -t dev`
- [ ] Tests post-déploiement

### 🔄 Phase 7 : CI/CD (À FAIRE)
- [ ] Créer les workflows GitHub Actions
- [ ] Tests automatisés (pytest)
- [ ] Déploiement automatique sur dev
- [ ] Déploiement manuel sur staging/prod avec approvals

### 🔄 Phase 8 : Monitoring (À FAIRE)
- [ ] Configurer les logs structurés
- [ ] Métriques applicatives (temps de réponse, erreurs)
- [ ] Alertes (Slack, email, PagerDuty)
- [ ] Dashboard de monitoring

## 📊 Statistiques du Code Généré

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `backend/server.py` | ~350 | Application FastAPI complète |
| `backend/requirements.txt` | ~15 | Dépendances Python |
| `app.yaml` | ~40 | Config Databricks App |
| `databricks.yml` | ~200 | Config Asset Bundle (3 envs) |
| `README.md` | ~300 | Documentation principale |
| `DEPLOYMENT.md` | ~600 | Guide de déploiement |
| `COMMANDS.md` | ~700 | Référence CLI complète |
| `ARCHITECTURE.md` | ~800 | Documentation architecture |
| `.gitignore` | ~40 | Configuration Git |
| **TOTAL** | **~3000+** | **Lignes de code et documentation** |

## 🎓 Ressources d'Apprentissage

### Databricks
- [Databricks Apps Documentation](https://docs.databricks.com/en/dev-tools/databricks-apps/)
- [Asset Bundles Guide](https://docs.databricks.com/en/dev-tools/bundles/)
- [Model Serving](https://docs.databricks.com/en/machine-learning/model-serving/)
- [Unity Catalog](https://docs.databricks.com/en/data-governance/unity-catalog/)

### FastAPI
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tutorial - User Guide](https://fastapi.tiangolo.com/tutorial/)
- [Advanced User Guide](https://fastapi.tiangolo.com/advanced/)

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 💡 Prochaines Étapes Recommandées

1. **Personnaliser les fichiers de configuration**
   - Remplacer les `<workspace-url>` dans `databricks.yml`
   - Adapter les noms de catalog/schema selon vos besoins

2. **Créer les secrets Databricks**
   ```bash
   databricks secrets create-scope sncf-travel-app
   databricks secrets put-secret sncf-travel-app databricks-token
   ```

3. **Valider et déployer sur dev**
   ```bash
   databricks bundle validate -t dev
   databricks bundle deploy -t dev
   ```

4. **Implémenter l'appel à l'Agent AI**
   - Décommenter le code dans `server.py` ligne 81
   - Tester avec un vrai endpoint

5. **Créer les tables Delta**
   - Suivre le schéma dans `ARCHITECTURE.md`
   - Utiliser un notebook Databricks

6. **Builder et intégrer le frontend**
   ```bash
   cd frontend
   npm run build
   ```

7. **Tests et monitoring**
   - Ajouter des tests unitaires
   - Configurer les alertes

Bon développement ! 🚀
