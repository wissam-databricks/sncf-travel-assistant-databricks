# 🚀 Instructions de Déploiement - SNCF Travel Assistant

## Déploiement Rapide (Recommandé)

### Option 1: Script Automatique

```bash
# Déployer en développement
./deploy.sh dev

# Déployer en staging
./deploy.sh staging

# Déployer en production
./deploy.sh prod
```

Le script automatique va:
1. ✅ Vérifier les prérequis (Databricks CLI, frontend build, venv)
2. ✅ Valider la configuration du bundle
3. ✅ Afficher un résumé du déploiement
4. ✅ Demander confirmation
5. ✅ Déployer sur Databricks
6. ✅ Afficher les URLs d'accès

---

## Déploiement Manuel

### Étape 1: Prérequis

```bash
# 1. Vérifier Databricks CLI
databricks --version

# 2. Authentification (si nécessaire)
databricks auth login --host https://adb-984752964297111.11.azuredatabricks.net

# 3. Builder le frontend
cd frontend
npm run build
cd ..

# 4. Activer l'environnement virtuel Python
source venv/bin/activate
```

### Étape 2: Valider la Configuration

```bash
# Valider le bundle pour dev
databricks bundle validate -t dev
```

**Résultat attendu**: `✓ Configuration is valid`

### Étape 3: Déployer

```bash
# Déployer sur Databricks (environnement dev)
databricks bundle deploy -t dev
```

**Résultat attendu**:
```
Uploading sncf_travel_assistant...
✓ Uploaded sncf_travel_assistant
✓ Deployed app sncf-travel-assistant-dev
```

### Étape 4: Vérifier le Déploiement

```bash
# Obtenir les détails de l'app
databricks apps get sncf-travel-assistant-dev

# Voir les logs
databricks apps logs sncf-travel-assistant-dev --follow
```

---

## URLs d'Accès

### Environnement Dev
- **Frontend**: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/
- **API Docs**: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/docs
- **Health**: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/health

### Environnement Staging
- **Frontend**: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-staging/
- **API Docs**: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-staging/docs

### Environnement Production
- **Frontend**: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant/
- **API Docs**: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant/docs

---

## Commandes Utiles

### Gestion de l'Application

```bash
# Lister toutes les apps
databricks apps list

# Obtenir le status d'une app
databricks apps get sncf-travel-assistant-dev

# Redémarrer une app
databricks apps restart sncf-travel-assistant-dev

# Supprimer une app
databricks apps delete sncf-travel-assistant-dev
```

### Logs et Monitoring

```bash
# Voir les logs en temps réel
databricks apps logs sncf-travel-assistant-dev --follow

# Voir les 100 dernières lignes
databricks apps logs sncf-travel-assistant-dev --tail 100

# Exporter les logs dans un fichier
databricks apps logs sncf-travel-assistant-dev > app_logs.txt
```

### Mise à Jour de l'Application

```bash
# Après avoir modifié le code
git pull  # Si nécessaire
cd frontend && npm run build && cd ..  # Si frontend modifié
databricks bundle deploy -t dev
```

---

## Troubleshooting

### Problème: "Frontend build not found"

**Solution**:
```bash
cd frontend
npm install
npm run build
cd ..
databricks bundle deploy -t dev
```

### Problème: "Authentication failed"

**Solution**:
```bash
databricks auth login --host https://adb-984752964297111.11.azuredatabricks.net
databricks auth profiles  # Vérifier le profil
```

### Problème: "App status: ERROR"

**Solution**:
```bash
# Voir les logs pour identifier l'erreur
databricks apps logs sncf-travel-assistant-dev --tail 100

# Redémarrer l'app
databricks apps restart sncf-travel-assistant-dev
```

### Problème: "Module backend.server not found"

**Solution**: Vérifier que le chemin dans `databricks.yml` est correct:
```yaml
command: ["uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Checklist de Déploiement

### Avant le Déploiement
- [ ] Code testé localement
- [ ] Frontend buildé (`npm run build`)
- [ ] Backend testé (`uvicorn backend.server:app`)
- [ ] `databricks.yml` validé
- [ ] Authentification Databricks OK
- [ ] Variables d'environnement vérifiées

### Après le Déploiement
- [ ] App status = RUNNING
- [ ] Health check répond (200 OK)
- [ ] Frontend accessible
- [ ] API docs accessibles
- [ ] Endpoints API testés
- [ ] Logs vérifiés (pas d'erreurs)

---

## Configuration Multi-Environnements

Le fichier `databricks.yml` définit 3 environnements:

### Dev (Développement)
- App name: `sncf-travel-assistant-dev`
- Catalog: `sncf_dev`
- Schema: `travel_assistant_dev`
- Mode: `development`

### Staging (Pré-production)
- App name: `sncf-travel-assistant-staging`
- Catalog: `sncf_staging`
- Schema: `travel_assistant`
- Mode: `production`

### Prod (Production)
- App name: `sncf-travel-assistant`
- Catalog: `sncf_prod`
- Schema: `travel_assistant`
- Mode: `production`

---

## Secrets Management

### Créer un Secret Scope

```bash
# Créer le scope
databricks secrets create-scope sncf-travel-app

# Ajouter un secret
databricks secrets put-secret sncf-travel-app databricks-token
# Un éditeur s'ouvre pour entrer le token

# Lister les secrets
databricks secrets list-secrets sncf-travel-app
```

### Utiliser les Secrets

Les secrets sont référencés dans `databricks.yml`:
```yaml
env:
  - name: DATABRICKS_TOKEN
    value: "{{secrets/sncf-travel-app/databricks-token}}"
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Databricks

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Setup Databricks CLI
        run: pip install databricks-cli
      
      - name: Deploy to Databricks
        env:
          DATABRICKS_HOST: ${{ secrets.DATABRICKS_HOST }}
          DATABRICKS_TOKEN: ${{ secrets.DATABRICKS_TOKEN }}
        run: |
          databricks bundle validate -t dev
          databricks bundle deploy -t dev
```

---

## Monitoring et Alerting

### Health Check Monitoring

```bash
#!/bin/bash
# monitor.sh - Script de monitoring

APP_URL="https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev"

while true; do
  STATUS=$(curl -s "$APP_URL/health" | jq -r '.status' 2>/dev/null)
  
  if [ "$STATUS" == "healthy" ]; then
    echo "[$(date)] ✓ App is healthy"
  else
    echo "[$(date)] ✗ App is NOT healthy (status: $STATUS)"
    # Envoyer une alerte (email, Slack, etc.)
  fi
  
  sleep 60  # Check every minute
done
```

---

## Support et Documentation

- **Guide de déploiement complet**: [DEPLOY_NOW.md](./DEPLOY_NOW.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Code Review**: [CODE_REVIEW.md](./CODE_REVIEW.md)
- **Documentation Databricks Apps**: https://docs.databricks.com/en/dev-tools/databricks-apps/

---

## Contact

En cas de problème:
1. Consulter les logs: `databricks apps logs sncf-travel-assistant-dev`
2. Vérifier le status: `databricks apps get sncf-travel-assistant-dev`
3. Consulter la documentation ci-dessus
4. Contacter l'équipe de support

---

**Prêt à déployer ?** Exécutez `./deploy.sh dev` ! 🚀
