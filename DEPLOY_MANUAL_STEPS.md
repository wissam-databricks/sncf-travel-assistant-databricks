# 🚀 Déploiement Manuel - Instructions Exactes

## Étapes à Exécuter dans Votre Terminal

### 1. Ouvrir un Terminal

Ouvrez votre terminal (iTerm, Terminal.app, etc.)

### 2. Aller dans le Répertoire du Projet

```bash
cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge
```

### 3. Vérifier les Prérequis

```bash
# Vérifier Databricks CLI
databricks --version

# Vérifier l'authentification
databricks auth profiles

# Vérifier le frontend build
ls -la frontend/out/index.html
```

**Résultats attendus**:
- CLI version devrait s'afficher
- Au moins un profil (comme `DEFAULT`) devrait être listé
- Le fichier `index.html` devrait exister

### 4. Valider le Bundle

```bash
databricks bundle validate -t dev
```

**Résultat attendu**: 
```
✓ Configuration is valid
```

### 5. Déployer sur Databricks

```bash
databricks bundle deploy -t dev
```

**Résultat attendu**:
```
Uploading sncf_travel_assistant...
✓ Uploaded sncf_travel_assistant
✓ Deployed app sncf-travel-assistant-dev
```

**Durée estimée**: 2-5 minutes

### 6. Vérifier le Déploiement

```bash
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

### 7. Voir les Logs (Optionnel)

```bash
databricks apps logs sncf-travel-assistant-dev --follow
```

Appuyez sur `Ctrl+C` pour arrêter le suivi des logs.

---

## 🌐 Accéder à l'Application

Une fois déployée, ouvrez ces URLs dans votre navigateur:

### Frontend (Interface Principale)
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/
```

### API Documentation (Swagger UI)
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/docs
```

### Health Check
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/health
```

---

## ❓ Si Vous Rencontrez des Problèmes

### Problème: "databricks: command not found"

**Solution**:
```bash
pip install databricks-cli
```

### Problème: "Error: not authenticated"

**Solution**:
```bash
databricks auth login --host https://adb-984752964297111.11.azuredatabricks.net
```

Suivez les instructions pour vous authentifier via votre navigateur.

### Problème: "Error: frontend build not found"

**Solution**:
```bash
cd frontend
npm install
npm run build
cd ..
databricks bundle deploy -t dev
```

### Problème: "App status: ERROR"

**Solution**: Voir les logs pour identifier l'erreur
```bash
databricks apps logs sncf-travel-assistant-dev --tail 100
```

Puis redémarrer l'app:
```bash
databricks apps restart sncf-travel-assistant-dev
```

---

## 🎯 Commandes Utiles Après Déploiement

### Voir le Status
```bash
databricks apps get sncf-travel-assistant-dev
```

### Voir les Logs en Temps Réel
```bash
databricks apps logs sncf-travel-assistant-dev --follow
```

### Redémarrer l'App
```bash
databricks apps restart sncf-travel-assistant-dev
```

### Redéployer Après Modifications
```bash
databricks bundle deploy -t dev
```

### Lister Toutes les Apps
```bash
databricks apps list
```

### Supprimer l'App (⚠️ Attention)
```bash
databricks apps delete sncf-travel-assistant-dev
```

---

## ✅ Checklist de Vérification

Après le déploiement, vérifiez:

- [ ] App status est "RUNNING"
- [ ] Frontend accessible dans le navigateur
- [ ] `/health` retourne `{"status": "healthy"}`
- [ ] `/docs` affiche la documentation Swagger
- [ ] Logs ne montrent pas d'erreurs critiques

---

## 📊 Résumé du Déploiement

**Commandes essentielles** (dans l'ordre):
```bash
cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge
databricks bundle validate -t dev
databricks bundle deploy -t dev
databricks apps get sncf-travel-assistant-dev
```

**URLs à ouvrir**:
- Frontend: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/
- API Docs: https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/docs

---

## 🆘 Support

Si vous rencontrez des problèmes:
1. Consulter les logs: `databricks apps logs sncf-travel-assistant-dev`
2. Vérifier le status: `databricks apps get sncf-travel-assistant-dev`
3. Consulter `DEPLOY_NOW.md` pour plus de détails
4. Consulter `CODE_REVIEW.md` pour les problèmes connus

---

**Temps total estimé**: 5-10 minutes (première fois)

**Bonne chance ! 🚀**
