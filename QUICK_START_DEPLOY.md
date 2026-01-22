# ⚡ Quick Start - Déployer en 2 Minutes

## 🎯 Objectif
Déployer l'application SNCF Travel Assistant sur Databricks Apps

## ✅ Prérequis (Vérification Rapide)

```bash
# 1. Databricks CLI installé ?
databricks --version
# ✅ Si OK: Databricks CLI v0.xxx

# 2. Authentifié ?
databricks auth profiles
# ✅ Si OK: Affiche DEFAULT ou autre profil

# 3. Frontend buildé ?
ls frontend/out/index.html
# ✅ Si OK: Affiche le fichier
```

**Si un prérequis manque**, voir [DEPLOY_NOW.md](./DEPLOY_NOW.md) pour les instructions détaillées.

---

## 🚀 Déploiement en 1 Commande

```bash
./deploy.sh dev
```

**C'est tout !** 🎉

Le script va:
1. ✅ Vérifier les prérequis
2. ✅ Valider la configuration
3. ✅ Demander confirmation
4. ✅ Déployer sur Databricks
5. ✅ Afficher les URLs d'accès

---

## 🌐 Accéder à l'Application

Après le déploiement, ouvrez dans votre navigateur:

### Frontend (Interface Utilisateur)
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

## 🔍 Vérifier le Déploiement

```bash
# Status de l'app
databricks apps get sncf-travel-assistant-dev

# Logs en temps réel
databricks apps logs sncf-travel-assistant-dev --follow
```

---

## ❓ Problème ?

### Erreur: "databricks: command not found"
```bash
pip install databricks-cli
```

### Erreur: "Authentication failed"
```bash
databricks auth login --host https://adb-984752964297111.11.azuredatabricks.net
```

### Erreur: "Frontend build not found"
```bash
cd frontend && npm run build && cd ..
./deploy.sh dev
```

### Autre problème ?
Consultez [DEPLOY_NOW.md](./DEPLOY_NOW.md) pour le guide complet de troubleshooting.

---

## 📚 Documentation Complète

- **Guide de déploiement détaillé**: [DEPLOY_NOW.md](./DEPLOY_NOW.md)
- **Instructions de déploiement**: [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)
- **Résumé complet**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Code Review**: [CODE_REVIEW.md](./CODE_REVIEW.md)

---

## 🎉 Prêt !

Exécutez maintenant:
```bash
./deploy.sh dev
```

**Temps estimé**: 2-3 minutes ⏱️

Bonne chance ! 🚀
