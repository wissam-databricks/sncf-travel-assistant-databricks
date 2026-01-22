# 🚀 Guide de Déploiement Databricks - SNCF Travel Assistant

**Date**: 2026-01-22  
**Application**: SNCF Travel Assistant  
**Target**: Databricks Apps (dev environment)

---

## ✅ Pré-requis

### 1. Databricks CLI Installé
```bash
# Vérifier l'installation
databricks --version
# Devrait afficher: Databricks CLI v0.xxx
```

### 2. Authentification Configurée
```bash
# Lister les profils disponibles
databricks auth profiles

# Si aucun profil, se connecter
databricks auth login --host https://adb-984752964297111.11.azuredatabricks.net
```

### 3. Frontend Buildé
```bash
# Vérifier que le build existe
ls -la frontend/out/index.html
# Devrait afficher le fichier index.html
```

✅ **Status**: Frontend build existe (`frontend/out/` contient index.html + assets)

---

## 📋 Étapes de Déploiement

### Étape 1: Valider la Configuration Bundle

```bash
cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge

# Valider le bundle pour l'environnement dev
databricks bundle validate -t dev
```

**Résultat attendu**: 
```
✓ Configuration is valid
```

**Si erreur**: Vérifier `databricks.yml` et corriger les erreurs affichées.

---

### Étape 2: Déployer sur Databricks

```bash
# Déployer l'application sur Databricks (environnement dev)
databricks bundle deploy -t dev
```

**Résultat attendu**:
```
Uploading sncf_travel_assistant...
✓ Uploaded sncf_travel_assistant
✓ Deployed app sncf-travel-assistant-dev
```

**Ce qui se passe**:
1. Le CLI upload tout le code (backend + frontend/out) vers Databricks Workspace
2. L'app est créée avec la configuration définie dans `databricks.yml`
3. Les variables d'environnement sont injectées
4. L'app démarre automatiquement avec `uvicorn backend.server:app`

---

### Étape 3: Vérifier le Déploiement

```bash
# Lister les apps déployées
databricks apps list

# Obtenir les détails de l'app
databricks apps get sncf-travel-assistant-dev
```

**Résultat attendu**:
```json
{
  "name": "sncf-travel-assistant-dev",
  "status": "RUNNING",
  "url": "https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev"
}
```

---

### Étape 4: Accéder à l'Application

**URL de l'app**:
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev
```

**Endpoints disponibles**:
- **Frontend**: `https://.../apps/sncf-travel-assistant-dev/`
- **API Docs**: `https://.../apps/sncf-travel-assistant-dev/docs`
- **Health Check**: `https://.../apps/sncf-travel-assistant-dev/health`
- **Chat API**: `https://.../apps/sncf-travel-assistant-dev/api/chat`
- **Trips API**: `https://.../apps/sncf-travel-assistant-dev/api/trips`
- **Admin KPIs**: `https://.../apps/sncf-travel-assistant-dev/api/admin/kpis`

---

## 🔍 Vérification Post-Déploiement

### 1. Vérifier le Health Check

```bash
# Via curl (remplacer <APP_URL> par l'URL réelle)
curl https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/health
```

**Résultat attendu**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-22T...",
  "agent_configured": false
}
```

### 2. Vérifier le Frontend

Ouvrir dans un navigateur:
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/
```

**Résultat attendu**: Page d'accueil du chatbot SNCF s'affiche

### 3. Vérifier l'API Documentation

Ouvrir dans un navigateur:
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/docs
```

**Résultat attendu**: Interface Swagger UI avec tous les endpoints

### 4. Tester l'API Chat

```bash
# Test de l'endpoint chat (nécessite authentification OAuth)
curl -X POST "https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Quel est mon prochain train ?"}'
```

**Note**: Si vous obtenez une redirection OAuth, c'est normal. Utilisez le navigateur pour tester.

---

## 🔧 Commandes de Gestion

### Voir les Logs de l'Application

```bash
# Logs en temps réel
databricks apps logs sncf-travel-assistant-dev --follow

# Dernières 100 lignes
databricks apps logs sncf-travel-assistant-dev --tail 100
```

### Redémarrer l'Application

```bash
databricks apps restart sncf-travel-assistant-dev
```

### Mettre à Jour l'Application

```bash
# Après avoir modifié le code
databricks bundle deploy -t dev
```

### Supprimer l'Application

```bash
# ⚠️ ATTENTION: Supprime l'app complètement
databricks apps delete sncf-travel-assistant-dev
```

---

## 🐛 Troubleshooting

### Problème 1: "Frontend build not found"

**Symptôme**: L'API fonctionne mais le frontend retourne une erreur

**Solution**:
```bash
# Rebuilder le frontend
cd frontend
npm run build

# Vérifier que le build existe
ls -la out/index.html

# Redéployer
cd ..
databricks bundle deploy -t dev
```

### Problème 2: "Error: app.yaml detected"

**Symptôme**: Erreur lors de la validation du bundle

**Solution**: Supprimer le fichier `app.yaml` (la config est maintenant dans `databricks.yml`)
```bash
rm app.yaml
databricks bundle validate -t dev
```

### Problème 3: "Authentication failed"

**Symptôme**: Erreur d'authentification lors du déploiement

**Solution**:
```bash
# Se reconnecter
databricks auth login --host https://adb-984752964297111.11.azuredatabricks.net

# Vérifier le profil
databricks auth profiles

# Redéployer
databricks bundle deploy -t dev
```

### Problème 4: "App status: ERROR"

**Symptôme**: L'app est déployée mais en état ERROR

**Solution**:
```bash
# Voir les logs pour identifier l'erreur
databricks apps logs sncf-travel-assistant-dev --tail 100

# Erreurs communes:
# - Port 8000 déjà utilisé → Vérifier la config
# - Module backend.server non trouvé → Vérifier le chemin dans databricks.yml
# - Dépendances manquantes → Vérifier requirements.txt
```

---

## 📊 Monitoring

### Métriques de l'Application

```bash
# Status de l'app
databricks apps get sncf-travel-assistant-dev --output json | jq '.status'

# URL de l'app
databricks apps get sncf-travel-assistant-dev --output json | jq '.url'

# Dernière mise à jour
databricks apps get sncf-travel-assistant-dev --output json | jq '.updated_at'
```

### Health Check Automatique

Créer un script de monitoring:
```bash
#!/bin/bash
# monitor_app.sh

APP_URL="https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev"

while true; do
  STATUS=$(curl -s "$APP_URL/health" | jq -r '.status')
  echo "[$(date)] App status: $STATUS"
  
  if [ "$STATUS" != "healthy" ]; then
    echo "⚠️  App is not healthy!"
    # Envoyer une alerte
  fi
  
  sleep 60  # Vérifier toutes les minutes
done
```

---

## 🌍 Déploiement Multi-Environnements

### Environnement de Staging

```bash
# Déployer en staging
databricks bundle deploy -t staging

# URL staging
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-staging
```

### Environnement de Production

```bash
# ⚠️ ATTENTION: Production deployment
databricks bundle deploy -t prod

# URL production
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant
```

**Checklist avant déploiement en production**:
- [ ] Tests passent (backend + frontend)
- [ ] Code review complété
- [ ] Documentation à jour
- [ ] Variables d'environnement configurées
- [ ] Secrets configurés dans Databricks
- [ ] Monitoring en place
- [ ] Backup plan défini

---

## 🔐 Configuration des Secrets

### Créer un Secret Scope

```bash
# Créer le scope pour l'app
databricks secrets create-scope sncf-travel-app

# Ajouter un secret (token Databricks)
databricks secrets put-secret sncf-travel-app databricks-token
# Entrer le token dans l'éditeur qui s'ouvre
```

### Utiliser les Secrets dans l'App

Les secrets sont automatiquement injectés via `databricks.yml`:
```yaml
env:
  - name: DATABRICKS_TOKEN
    value: "{{secrets/sncf-travel-app/databricks-token}}"
```

---

## 📝 Checklist de Déploiement

### Avant le Déploiement
- [ ] Frontend buildé (`npm run build` dans `frontend/`)
- [ ] Backend testé localement (`uvicorn backend.server:app`)
- [ ] `databricks.yml` validé (`databricks bundle validate`)
- [ ] Authentification Databricks configurée
- [ ] Variables d'environnement vérifiées

### Pendant le Déploiement
- [ ] `databricks bundle deploy -t dev` exécuté
- [ ] Pas d'erreurs dans la sortie du CLI
- [ ] App status = RUNNING

### Après le Déploiement
- [ ] Health check répond (status: healthy)
- [ ] Frontend accessible dans le navigateur
- [ ] API docs accessibles (/docs)
- [ ] Endpoints API testés
- [ ] Logs vérifiés (pas d'erreurs)

---

## 🎯 Commande Rapide de Déploiement

```bash
# One-liner pour déployer rapidement
cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge && \
  databricks bundle validate -t dev && \
  databricks bundle deploy -t dev && \
  echo "✅ Déploiement terminé!" && \
  databricks apps get sncf-travel-assistant-dev
```

---

## 📚 Ressources

- [Documentation Databricks Apps](https://docs.databricks.com/en/dev-tools/databricks-apps/)
- [Documentation Databricks Asset Bundles](https://docs.databricks.com/en/dev-tools/bundles/)
- [Databricks CLI Reference](https://docs.databricks.com/en/dev-tools/cli/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🆘 Support

En cas de problème:
1. Vérifier les logs: `databricks apps logs sncf-travel-assistant-dev`
2. Vérifier le status: `databricks apps get sncf-travel-assistant-dev`
3. Consulter la documentation: `DEPLOYMENT.md`, `ARCHITECTURE.md`
4. Vérifier la code review: `CODE_REVIEW.md`

---

**Prêt à déployer ?** Exécutez les commandes de la section "Étapes de Déploiement" ! 🚀
