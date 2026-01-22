# 🚀 DÉMARRER LE DÉPLOIEMENT

## Option 1: Script Automatique (Le Plus Simple) ⭐

Ouvrez votre terminal et exécutez:

```bash
cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge
bash RUN_THIS.sh
```

C'est tout ! Le script va valider, déployer et afficher le status.

---

## Option 2: Commandes Manuelles (Étape par Étape)

### Étape 1: Aller dans le projet
```bash
cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge
```

### Étape 2: Valider la configuration
```bash
databricks bundle validate -t dev
```

### Étape 3: Déployer
```bash
databricks bundle deploy -t dev
```

### Étape 4: Vérifier
```bash
databricks apps get sncf-travel-assistant-dev
```

---

## 🌐 Accès à l'Application

Après le déploiement, ouvrez dans votre navigateur:

**Frontend**:
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/
```

**API Docs**:
```
https://adb-984752964297111.11.azuredatabricks.net/apps/sncf-travel-assistant-dev/docs
```

---

## ❓ Problèmes ?

Consultez:
- `DEPLOY_MANUAL_STEPS.md` - Instructions détaillées
- `DEPLOY_NOW.md` - Guide complet de 600+ lignes
- `DEPLOYMENT_INSTRUCTIONS.md` - Référence rapide

---

## ⏱️ Durée Estimée

- Première fois: 5-10 minutes
- Redéploiements: 2-3 minutes

---

**Prêt ? Exécutez `bash RUN_THIS.sh` maintenant ! 🚀**
