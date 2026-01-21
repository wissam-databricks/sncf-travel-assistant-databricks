# SNCF Travel Assistant - Databricks App

[![Databricks](https://img.shields.io/badge/Databricks-Apps-FF3621?logo=databricks)](https://docs.databricks.com/en/dev-tools/databricks-apps/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Application de chatbot voyageur avec Agent AI et dashboard administrateur, déployée sur Databricks Apps.

🔗 **Repository**: https://github.com/wissam-databricks/sncf-travel-assistant-databricks

## 📁 Structure du Projet

```
.
├── frontend/          # Frontend Next.js (existant - ne pas modifier)
│   ├── app/                 # Pages et composants React
│   ├── components/          # Composants UI réutilisables
│   ├── lib/                 # Utilitaires et clients
│   └── public/              # Assets statiques
│
├── backend/                 # Backend FastAPI (nouveau)
│   ├── server.py            # Application FastAPI principale
│   └── requirements.txt     # Dépendances Python
│
├── app.yaml                 # Configuration Databricks App
├── databricks.yml           # Configuration Asset Bundle
└── README.md                # Cette documentation
```

## 🚀 Déploiement

### Prérequis

1. **Databricks CLI** installé et configuré :
   ```bash
   # Installation
   pip install databricks-cli
   
   # Configuration
   databricks configure --token
   ```

2. **Python 3.10+** installé

3. **Accès à un workspace Databricks** avec les permissions nécessaires

### Étapes de Déploiement

#### 1. Configuration des Variables

Éditez le fichier `databricks.yml` et remplacez les placeholders :
- `<workspace-url>` : URL de votre workspace Databricks
- Autres variables selon votre environnement (catalog, schema, etc.)

#### 2. Création des Secrets Databricks

Créez un scope de secrets et ajoutez le token :

```bash
# Créer un scope de secrets
databricks secrets create-scope sncf-travel-app

# Ajouter le token (sera généré automatiquement par Databricks Apps)
# Ou utilisez un token personnel pour les tests
databricks secrets put-secret sncf-travel-app databricks-token
```

#### 3. Validation du Bundle

Vérifiez que la configuration est correcte :

```bash
# Validation générale
databricks bundle validate

# Validation pour un environnement spécifique
databricks bundle validate -t dev
```

#### 4. Déploiement

**Environnement de développement :**
```bash
databricks bundle deploy -t dev
```

**Environnement de staging :**
```bash
databricks bundle deploy -t staging
```

**Environnement de production :**
```bash
databricks bundle deploy -t prod
```

#### 5. Démarrage de l'Application

Une fois déployée, l'application démarre automatiquement. Pour gérer l'app :

```bash
# Lister les apps déployées
databricks apps list

# Voir les détails d'une app
databricks apps get sncf-travel-assistant-dev

# Voir les logs
databricks apps logs sncf-travel-assistant-dev

# Redémarrer l'app
databricks apps restart sncf-travel-assistant-dev

# Arrêter l'app
databricks apps stop sncf-travel-assistant-dev
```

#### 6. Accès à l'Application

L'URL de l'application sera disponible dans la console Databricks ou via :

```bash
databricks apps get sncf-travel-assistant-dev --output json | grep url
```

Format typique : `https://<workspace-url>/apps/<app-id>`

## 🛠️ Développement Local

### Backend uniquement

```bash
# Installer les dépendances
cd backend
pip install -r requirements.txt

# Variables d'environnement pour le dev local
export AGENT_ENDPOINT_URL="https://your-workspace.databricks.com/serving-endpoints/your-endpoint/invocations"
export DATABRICKS_TOKEN="your-token"
export WORKSPACE_URL="https://your-workspace.databricks.com"

# Démarrer le serveur
python server.py

# Ou avec uvicorn directement
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

L'API sera disponible sur `http://localhost:8000`
Documentation interactive : `http://localhost:8000/docs`

### Frontend (si besoin de modifications)

```bash
cd frontend

# Installer les dépendances
npm install
# ou
pnpm install

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Pour export statique (si configuré)
npm run export
```

## 📡 Endpoints API

### Endpoints Publics

- `GET /health` - Health check
- `POST /api/chat` - Envoyer un message au chatbot
- `GET /api/trips` - Récupérer les informations de voyage

### Endpoints Admin

- `GET /api/admin/kpis` - KPIs du dashboard
- `GET /api/admin/charts` - Données des graphiques
- `GET /api/analytics` - Analytics marketing

### Documentation

Documentation interactive Swagger disponible sur `/docs` (FastAPI auto-généré)

## 🔧 Configuration

### Variables d'Environnement

| Variable | Description | Requis | Défaut |
|----------|-------------|--------|--------|
| `AGENT_ENDPOINT_URL` | URL de l'endpoint Model Serving | Oui | - |
| `DATABRICKS_TOKEN` | Token d'authentification | Oui | - |
| `WORKSPACE_URL` | URL du workspace Databricks | Oui | - |
| `PORT` | Port de l'application | Non | 8000 |
| `HOST` | Host binding | Non | 0.0.0.0 |

### Databricks Asset Bundle

Le fichier `databricks.yml` définit trois environnements :

- **dev** : Développement avec ressources minimales
- **staging** : Pre-production avec ressources moyennes
- **prod** : Production avec ressources maximales et haute disponibilité

### Ressources Déployées

Le bundle déploie automatiquement :

1. **App** : L'application FastAPI + Frontend
2. **Model Serving Endpoint** : Endpoint pour l'Agent AI
3. **Jobs** (optionnel) : Pipeline analytics quotidien

## 🔐 Sécurité

1. **Secrets** : Tous les tokens doivent être stockés dans Databricks Secrets
2. **CORS** : Configuré pour accepter toutes les origines en dev (à restreindre en prod)
3. **Authentification** : À implémenter selon les besoins (OAuth, JWT, etc.)

## 📊 Monitoring

### Logs

```bash
# Logs en temps réel
databricks apps logs sncf-travel-assistant-dev --follow

# Logs des dernières 24h
databricks apps logs sncf-travel-assistant-dev --since 24h
```

### Métriques

Les métriques sont disponibles dans la console Databricks Apps :
- Temps de réponse
- Nombre de requêtes
- Utilisation CPU/Mémoire
- Erreurs

## 🐛 Troubleshooting

### L'app ne démarre pas

```bash
# Vérifier les logs
databricks apps logs sncf-travel-assistant-dev

# Vérifier la configuration
databricks bundle validate -t dev

# Vérifier les secrets
databricks secrets list-secrets sncf-travel-app
```

### Erreur "Agent endpoint not configured"

Vérifiez que la variable `AGENT_ENDPOINT_URL` est correctement définie dans `app.yaml` ou `databricks.yml`

### Erreur 404 sur le frontend

Le frontend doit être buildé avant le déploiement :
```bash
cd frontend
npm run build
```

## 🔄 Mise à Jour

Pour mettre à jour l'application déployée :

```bash
# Re-déployer le bundle
databricks bundle deploy -t dev

# L'app redémarre automatiquement
```

## 📝 TODO / Prochaines Étapes

### Backend
- [ ] Implémenter l'appel réel à l'Agent AI (ligne 81 dans `server.py`)
- [ ] Connecter aux vraies tables Delta pour les KPIs et analytics
- [ ] Ajouter l'authentification utilisateur
- [ ] Implémenter la gestion des sessions/conversations
- [ ] Ajouter des tests unitaires et d'intégration

### Frontend
- [ ] Configurer le build Next.js en mode standalone ou export
- [ ] Optimiser les performances (SSR/SSG selon les besoins)

### Infrastructure
- [ ] Configurer le pipeline CI/CD
- [ ] Ajouter des tests automatisés
- [ ] Configurer les alertes et monitoring avancé
- [ ] Mettre en place la rotation des secrets

## 📚 Ressources

- [Databricks Apps Documentation](https://docs.databricks.com/en/dev-tools/databricks-apps/)
- [Databricks Asset Bundles Documentation](https://docs.databricks.com/en/dev-tools/bundles/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 📧 Support

Pour toute question ou problème, contactez l'équipe d'infrastructure Databricks.
