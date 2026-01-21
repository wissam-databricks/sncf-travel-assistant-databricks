# Commandes CLI - SNCF Travel Assistant

Guide rapide des commandes CLI pour gérer l'application Databricks.

## 🚀 Databricks CLI - Installation et Configuration

### Installation

```bash
# Via pip
pip install databricks-cli

# Via Homebrew (macOS)
brew tap databricks/tap
brew install databricks

# Mise à jour
pip install --upgrade databricks-cli
```

### Configuration

```bash
# Configuration interactive avec token
databricks configure --token

# Configuration avec des profils multiples
databricks configure --token --profile dev
databricks configure --token --profile prod

# Utiliser un profil spécifique
databricks --profile prod workspace list /
```

### Vérification

```bash
# Version du CLI
databricks --version

# Profil actif
databricks auth profiles

# Tester la connexion
databricks current-user me
```

## 📦 Databricks Asset Bundles

### Validation

```bash
# Valider la configuration (environnement dev par défaut)
databricks bundle validate

# Valider un environnement spécifique
databricks bundle validate -t dev
databricks bundle validate -t staging
databricks bundle validate -t prod

# Mode verbose pour plus de détails
databricks bundle validate -t dev -v

# Afficher la configuration résolue (après substitution des variables)
databricks bundle validate -t dev --output json
```

### Déploiement

```bash
# Déployer sur dev
databricks bundle deploy -t dev

# Déployer sur staging
databricks bundle deploy -t staging

# Déployer sur prod (avec confirmation)
databricks bundle deploy -t prod

# Déployer avec un profil spécifique
databricks bundle deploy -t prod --profile production

# Forcer le redéploiement (même si rien n'a changé)
databricks bundle deploy -t dev --force
```

### Destruction

```bash
# Supprimer toutes les ressources d'un bundle
databricks bundle destroy -t dev

# Avec confirmation automatique (attention !)
databricks bundle destroy -t dev --auto-approve
```

## 📱 Gestion des Apps

### Lister et Consulter

```bash
# Lister toutes les apps
databricks apps list

# Lister avec format JSON
databricks apps list --output json

# Détails d'une app spécifique
databricks apps get sncf-travel-assistant-dev

# Détails en JSON
databricks apps get sncf-travel-assistant-dev --output json

# Extraire l'URL de l'app
databricks apps get sncf-travel-assistant-dev --output json | jq -r '.url'
```

### Contrôle de l'App

```bash
# Démarrer une app arrêtée
databricks apps start sncf-travel-assistant-dev

# Arrêter une app
databricks apps stop sncf-travel-assistant-dev

# Redémarrer une app
databricks apps restart sncf-travel-assistant-dev

# Supprimer une app
databricks apps delete sncf-travel-assistant-dev

# Supprimer sans confirmation
databricks apps delete sncf-travel-assistant-dev --yes
```

### Logs

```bash
# Afficher les logs
databricks apps logs sncf-travel-assistant-dev

# Logs en temps réel (follow)
databricks apps logs sncf-travel-assistant-dev --follow

# Logs des dernières heures/jours
databricks apps logs sncf-travel-assistant-dev --since 1h
databricks apps logs sncf-travel-assistant-dev --since 24h
databricks apps logs sncf-travel-assistant-dev --since 7d

# Limiter le nombre de lignes
databricks apps logs sncf-travel-assistant-dev --tail 100

# Sauvegarder les logs
databricks apps logs sncf-travel-assistant-dev > app.log
databricks apps logs sncf-travel-assistant-dev --since 24h > app-24h.log
```

### Métriques

```bash
# Obtenir les métriques de l'app
databricks apps get-metrics sncf-travel-assistant-dev

# Métriques en JSON
databricks apps get-metrics sncf-travel-assistant-dev --output json
```

## 🔐 Gestion des Secrets

### Scopes

```bash
# Lister tous les scopes
databricks secrets list-scopes

# Créer un nouveau scope
databricks secrets create-scope sncf-travel-app

# Supprimer un scope (et tous ses secrets)
databricks secrets delete-scope sncf-travel-app
```

### Secrets

```bash
# Lister les secrets d'un scope (noms seulement)
databricks secrets list-secrets sncf-travel-app

# Ajouter/Mettre à jour un secret (ouvre un éditeur)
databricks secrets put-secret sncf-travel-app databricks-token

# Ajouter un secret depuis stdin
echo "my-secret-value" | databricks secrets put-secret sncf-travel-app my-secret --binary-file /dev/stdin

# Supprimer un secret
databricks secrets delete-secret sncf-travel-app databricks-token

# Permissions sur un scope
databricks secrets list-acls sncf-travel-app
databricks secrets put-acl sncf-travel-app --principal users --permission READ
```

## 🤖 Model Serving Endpoints

### Lister et Consulter

```bash
# Lister tous les endpoints
databricks serving-endpoints list

# Détails d'un endpoint
databricks serving-endpoints get sncf-travel-agent-dev

# En JSON
databricks serving-endpoints get sncf-travel-agent-dev --output json
```

### Gestion

```bash
# Créer un endpoint (via bundle ou manuellement)
databricks serving-endpoints create --json-file endpoint-config.json

# Mettre à jour un endpoint
databricks serving-endpoints update sncf-travel-agent-dev --json-file updated-config.json

# Supprimer un endpoint
databricks serving-endpoints delete sncf-travel-agent-dev
```

### Logs et Métriques

```bash
# Logs du endpoint
databricks serving-endpoints logs sncf-travel-agent-dev

# Métriques
databricks serving-endpoints metrics sncf-travel-agent-dev
```

### Test

```bash
# Tester un endpoint (requête POST)
databricks serving-endpoints query sncf-travel-agent-dev \
  --json '{
    "messages": [
      {
        "role": "user",
        "content": "Quel est mon prochain train ?"
      }
    ]
  }'
```

## 💼 Workspace

### Navigation

```bash
# Lister le contenu d'un répertoire
databricks workspace list /

# Lister récursivement
databricks workspace list -l /Users

# Créer un répertoire
databricks workspace mkdirs /Users/myuser/my-project
```

### Upload/Download

```bash
# Upload un fichier
databricks workspace import myfile.py /Users/myuser/myfile.py

# Upload un dossier récursivement
databricks workspace import-dir ./local-folder /Users/myuser/remote-folder

# Download un fichier
databricks workspace export /Users/myuser/myfile.py myfile.py

# Download un dossier
databricks workspace export-dir /Users/myuser/remote-folder ./local-folder
```

## 📊 Jobs (si configurés dans le bundle)

### Lister et Consulter

```bash
# Lister tous les jobs
databricks jobs list

# Détails d'un job
databricks jobs get --job-id 123456

# Lister les runs d'un job
databricks jobs runs list --job-id 123456
```

### Exécution

```bash
# Lancer un job manuellement
databricks jobs run-now --job-id 123456

# Lancer avec des paramètres
databricks jobs run-now --job-id 123456 --json '{
  "notebook_params": {
    "param1": "value1"
  }
}'

# Voir le statut d'un run
databricks jobs runs get --run-id 789012

# Annuler un run
databricks jobs runs cancel --run-id 789012
```

## 🧪 Test des Endpoints API

### Health Check

```bash
# Test de santé
curl https://your-app-url/health

# Avec formatage JSON
curl -s https://your-app-url/health | jq
```

### Chatbot

```bash
# Envoyer un message
curl -X POST https://your-app-url/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quel est mon prochain train ?",
    "user_id": "test-user",
    "conversation_id": "test-conv-123"
  }' | jq

# Test avec httpie (plus lisible)
http POST https://your-app-url/api/chat \
  message="Quel est mon prochain train ?" \
  user_id="test-user"
```

### Admin Endpoints

```bash
# KPIs
curl -s https://your-app-url/api/admin/kpis | jq

# Charts
curl -s https://your-app-url/api/admin/charts | jq

# Analytics
curl -s https://your-app-url/api/analytics | jq

# Trips
curl -s https://your-app-url/api/trips | jq
```

### Test de Charge

```bash
# Test simple avec Apache Bench
ab -n 1000 -c 10 https://your-app-url/health

# Test avec wrk
wrk -t4 -c100 -d30s https://your-app-url/health

# Test POST avec wrk
wrk -t4 -c100 -d30s -s post.lua https://your-app-url/api/chat

# Contenu de post.lua :
# wrk.method = "POST"
# wrk.body   = '{"message":"test","user_id":"test"}'
# wrk.headers["Content-Type"] = "application/json"
```

## 🔍 Debugging

### Logs Détaillés

```bash
# Backend logs avec contexte
databricks apps logs sncf-travel-assistant-dev --follow | grep ERROR

# Filtrer par timestamp
databricks apps logs sncf-travel-assistant-dev --since 1h | grep "2026-01-21"

# Compter les erreurs
databricks apps logs sncf-travel-assistant-dev --since 24h | grep -c ERROR
```

### Inspection de l'État

```bash
# État complet de l'app en JSON
databricks apps get sncf-travel-assistant-dev --output json | jq

# Vérifier les variables d'environnement
databricks apps get sncf-travel-assistant-dev --output json | jq '.config.env'

# Vérifier la commande de démarrage
databricks apps get sncf-travel-assistant-dev --output json | jq '.config.command'

# URL de l'app
databricks apps get sncf-travel-assistant-dev --output json | jq -r '.url'
```

### Validation des Resources

```bash
# Vérifier que les ressources existent
databricks serving-endpoints get sncf-travel-agent-dev
databricks secrets list-secrets sncf-travel-app

# Tester la connectivité
curl -v https://your-workspace/serving-endpoints/sncf-travel-agent-dev/invocations
```

## 🔄 Workflow Complet de Déploiement

### Développement Local → Dev

```bash
# 1. Développer et tester localement
cd backend
python server.py

# 2. Valider le bundle
databricks bundle validate -t dev

# 3. Déployer
databricks bundle deploy -t dev

# 4. Vérifier
databricks apps get sncf-travel-assistant-dev
databricks apps logs sncf-travel-assistant-dev --tail 50

# 5. Tester
curl https://your-app-url/health
```

### Dev → Staging

```bash
# 1. Valider sur staging
databricks bundle validate -t staging

# 2. Déployer
databricks bundle deploy -t staging

# 3. Tests automatisés (à implémenter)
./scripts/test-staging.sh

# 4. Smoke test manuel
curl https://staging-app-url/health
curl https://staging-app-url/api/admin/kpis
```

### Staging → Production

```bash
# 1. Review final
databricks bundle validate -t prod

# 2. Déploiement avec profil prod
databricks bundle deploy -t prod --profile production

# 3. Vérification
databricks apps get sncf-travel-assistant --profile production

# 4. Monitoring
databricks apps logs sncf-travel-assistant --follow --profile production

# 5. Health check
curl https://prod-app-url/health
```

## 📝 Scripts Utiles

### Monitoring Continu

```bash
#!/bin/bash
# monitor-app.sh - Surveiller la santé de l'app

APP_NAME="sncf-travel-assistant-dev"
URL=$(databricks apps get $APP_NAME --output json | jq -r '.url')

while true; do
  STATUS=$(curl -s $URL/health | jq -r '.status')
  echo "$(date) - Status: $STATUS"
  
  if [ "$STATUS" != "healthy" ]; then
    echo "⚠️  App is unhealthy!"
    databricks apps logs $APP_NAME --tail 20
  fi
  
  sleep 60
done
```

### Rotation des Logs

```bash
#!/bin/bash
# save-logs.sh - Sauvegarder les logs quotidiennement

APP_NAME="sncf-travel-assistant-dev"
DATE=$(date +%Y-%m-%d)
LOG_FILE="logs/app-$DATE.log"

databricks apps logs $APP_NAME --since 24h > $LOG_FILE
gzip $LOG_FILE
```

### Déploiement Automatisé

```bash
#!/bin/bash
# deploy.sh - Script de déploiement

set -e

TARGET=${1:-dev}

echo "🚀 Déploiement sur $TARGET..."

# Validation
echo "📋 Validation..."
databricks bundle validate -t $TARGET

# Déploiement
echo "🔧 Déploiement..."
databricks bundle deploy -t $TARGET

# Vérification
echo "✅ Vérification..."
APP_NAME=$(databricks bundle validate -t $TARGET --output json | jq -r '.resources.apps[].name')
databricks apps get $APP_NAME

# Health check
echo "🏥 Health check..."
sleep 10
URL=$(databricks apps get $APP_NAME --output json | jq -r '.url')
curl -f $URL/health || exit 1

echo "✨ Déploiement réussi!"
```

## 📚 Ressources

- [Databricks CLI Reference](https://docs.databricks.com/en/dev-tools/cli/index.html)
- [Bundle CLI Commands](https://docs.databricks.com/en/dev-tools/bundles/cli-commands.html)
- [Apps CLI Commands](https://docs.databricks.com/en/dev-tools/databricks-apps/cli.html)
