# 🎯 START HERE - Guide de Démarrage

Bienvenue ! Ce fichier vous guide pour déployer votre application SNCF Travel Assistant sur Databricks Apps.

## 📖 Par où commencer ?

### 🚀 Vous voulez déployer rapidement ? (15 min)

➡️ **Lire `QUICKSTART.md`**

Ce guide vous permet de déployer l'application en 6 étapes simples :
1. Installer Databricks CLI
2. Personnaliser la configuration
3. Créer les secrets
4. Valider
5. Déployer
6. Tester

**Note** : L'app utilisera des données mock, mais sera fonctionnelle immédiatement.

---

### 📚 Vous voulez comprendre l'architecture d'abord ?

➡️ **Lire dans cet ordre** :

1. **`SUMMARY.md`** (5 min)
   - Vue d'ensemble de ce qui a été créé
   - Statistiques du projet
   - État d'avancement

2. **`README.md`** (10 min)
   - Documentation principale
   - Vue d'ensemble générale
   - Guide de déploiement simplifié

3. **`ARCHITECTURE.md`** (20 min)
   - Architecture détaillée
   - Flux de données
   - Composants techniques

---

### 🛠️ Vous êtes développeur et voulez contribuer ?

➡️ **Lire dans cet ordre** :

1. **`PROJECT_STRUCTURE.md`** (10 min)
   - Arborescence complète
   - Description de chaque fichier
   - Roadmap d'implémentation

2. **`TODO_CODE.md`** (15 min)
   - Tous les TODOs dans le code
   - Ordre d'implémentation recommandé
   - Exemples de code

3. **`backend/server.py`**
   - Le code source du backend
   - Points d'extension commentés

---

### 🚢 Vous êtes ops et voulez déployer en production ?

➡️ **Lire dans cet ordre** :

1. **`DEPLOYMENT.md`** (30 min)
   - Guide de déploiement complet
   - Configuration des environnements
   - Troubleshooting
   - Best practices sécurité

2. **`COMMANDS.md`** (référence)
   - Toutes les commandes CLI
   - Scripts utiles
   - Exemples de monitoring

---

## 🗂️ Structure de la Documentation

```
📁 databricks_challenge/
│
├── 🚀 START_HERE.md          ← VOUS ÊTES ICI
│
├── 📘 Documentation Principale
│   ├── QUICKSTART.md          ⚡ Démarrage rapide (15 min)
│   ├── README.md              📖 Vue d'ensemble
│   ├── SUMMARY.md             📋 Résumé de ce qui a été créé
│   └── ARCHITECTURE.md        🏗️  Architecture technique
│
├── 📗 Documentation Développeur
│   ├── PROJECT_STRUCTURE.md   📂 Arborescence et roadmap
│   ├── TODO_CODE.md           ✅ TODOs à implémenter
│   └── backend/
│       └── server.py          💻 Code source backend
│
├── 📕 Documentation Ops/Deployment
│   ├── DEPLOYMENT.md          🚢 Guide déploiement complet
│   └── COMMANDS.md            ⌨️  Référence CLI
│
├── ⚙️  Configuration Databricks
│   ├── app.yaml               📄 Config Databricks App
│   └── databricks.yml         📄 Config Asset Bundle
│
├── 🔧 Backend (FastAPI)
│   └── backend/
│       ├── server.py          💻 Application FastAPI
│       ├── requirements.txt   📦 Dépendances Python
│       └── __init__.py
│
└── 🎨 Frontend (Next.js - EXISTANT)
    └── frontend/        ⚠️  NE PAS MODIFIER
```

---

## 🎯 Parcours Recommandés

### 👤 Parcours 1 : "Je veux juste voir ça fonctionner"

**Temps : 20 minutes**

1. ✅ Lire `SUMMARY.md` (comprendre ce qui a été créé)
2. ✅ Suivre `QUICKSTART.md` (déployer en dev)
3. ✅ Tester l'app dans le navigateur
4. ✅ Consulter `/docs` pour voir les endpoints API

**Résultat** : App déployée avec données mock, accessible via URL Databricks.

---

### 👨‍💻 Parcours 2 : "Je veux développer et intégrer l'Agent AI"

**Temps : 2-3 heures**

1. ✅ Lire `README.md` + `ARCHITECTURE.md`
2. ✅ Lire `TODO_CODE.md` (comprendre ce qu'il reste à faire)
3. ✅ Créer un Model Serving Endpoint dans Databricks
4. ✅ Modifier `backend/server.py` ligne 81 (décommenter appel Agent AI)
5. ✅ Mettre à jour `databricks.yml` avec l'URL de l'endpoint
6. ✅ Redéployer : `databricks bundle deploy -t dev`
7. ✅ Tester avec le chatbot

**Résultat** : Chatbot fonctionnel avec vraie IA.

---

### 🗄️ Parcours 3 : "Je veux connecter aux données réelles"

**Temps : 4-6 heures**

1. ✅ Lire `ARCHITECTURE.md` (section "Data Layer")
2. ✅ Créer les tables Delta dans Unity Catalog (schéma fourni)
3. ✅ Créer les notebooks pour les jobs analytics
4. ✅ Modifier `backend/server.py` (remplacer mocks par requêtes SQL)
5. ✅ Ajouter `databricks-sql-connector` dans requirements.txt
6. ✅ Configurer les variables d'environnement (SQL warehouse)
7. ✅ Déployer les jobs via le bundle
8. ✅ Redéployer l'app

**Résultat** : Dashboard admin avec vraies données, KPIs réels.

---

### 🚀 Parcours 4 : "Je veux déployer en production"

**Temps : 1 journée**

1. ✅ Suivre `DEPLOYMENT.md` complètement
2. ✅ Configurer les environnements (dev/staging/prod)
3. ✅ Créer un Service Principal pour la prod
4. ✅ Configurer les secrets (rotation automatique)
5. ✅ Implémenter l'authentification (OAuth/JWT)
6. ✅ Ajouter des tests automatisés
7. ✅ Configurer CI/CD (GitHub Actions)
8. ✅ Configurer monitoring et alertes
9. ✅ Déployer sur staging → tests → prod

**Résultat** : Application en production, sécurisée, monitorée, avec CI/CD.

---

## ✅ Checklist de Déploiement Minimal

### Avant le premier déploiement :

- [ ] Databricks CLI installé et configuré
- [ ] Fichier `databricks.yml` personnalisé (remplacer `<workspace-url>`)
- [ ] Secrets créés (`sncf-travel-app` scope)
- [ ] Bundle validé : `databricks bundle validate -t dev`

### Pour déployer :

```bash
databricks bundle deploy -t dev
```

### Après le déploiement :

- [ ] App démarrée (status = RUNNING)
- [ ] URL obtenue : `databricks apps get sncf-travel-assistant-dev`
- [ ] Health check OK : `curl https://your-app-url/health`
- [ ] Documentation accessible : `https://your-app-url/docs`

---

## 🆘 Besoin d'Aide ?

### ❓ Questions Fréquentes

**Q: Je n'ai pas d'Agent AI, puis-je quand même déployer ?**  
R: Oui ! L'app utilise des données mock par défaut. Vous pouvez déployer et tester immédiatement.

**Q: Le frontend Next.js doit-il être buildé ?**  
R: Pas pour les tests initiaux. Le backend expose des endpoints API. Pour servir le frontend complet, builder avec `npm run build` dans `frontend/`.

**Q: Puis-je tester en local avant de déployer ?**  
R: Oui ! `cd backend && python server.py` → http://localhost:8000

**Q: Combien coûte le déploiement ?**  
R: Dépend de votre workspace. En dev avec scale-to-zero, coût minimal (~quelques $ par jour).

**Q: Où sont les logs ?**  
R: `databricks apps logs sncf-travel-assistant-dev --follow`

---

### 📧 Support

**Documentation Databricks** : https://docs.databricks.com/  
**Community Forums** : https://community.databricks.com/  
**Cette documentation** : Tous les fichiers .md dans ce dossier

---

## 🎉 Prêt à Commencer ?

### Option 1 : Déploiement Rapide ⚡

```bash
# Suivre QUICKSTART.md - 15 minutes
cat QUICKSTART.md
```

### Option 2 : Lecture Approfondie 📚

```bash
# Commencer par le résumé
cat SUMMARY.md

# Puis l'architecture
cat ARCHITECTURE.md
```

### Option 3 : Je suis pressé 🏃

```bash
# Personnaliser databricks.yml (remplacer <workspace-url>)
vim databricks.yml

# Créer les secrets
databricks secrets create-scope sncf-travel-app
databricks secrets put-secret sncf-travel-app databricks-token

# Déployer
databricks bundle validate -t dev
databricks bundle deploy -t dev

# Obtenir l'URL
databricks apps get sncf-travel-assistant-dev
```

---

## 📊 Ce qui a été créé pour vous

| Élément | Quantité | Status |
|---------|----------|--------|
| Fichiers backend | 3 | ✅ Créés |
| Fichiers config | 2 | ✅ Créés |
| Fichiers documentation | 8 | ✅ Créés |
| Lignes de code | ~400 | ✅ Écrites |
| Lignes de config | ~240 | ✅ Écrites |
| Lignes de doc | ~3500+ | ✅ Écrites |
| Endpoints API | 7 | ✅ Implémentés |
| Environnements | 3 | ✅ Configurés |

**Total : ~4140+ lignes générées** 🎉

---

## 🚦 Prochaine Action

**👉 Choisissez votre parcours ci-dessus et commencez !**

Nous recommandons de commencer par **Parcours 1** pour voir l'app fonctionner rapidement, puis de passer au **Parcours 2** pour connecter l'Agent AI.

**Bonne chance ! 🚀**

---

*Dernière mise à jour : 2026-01-21*  
*Version : 1.0*  
*Status : ✅ Prêt pour le déploiement*
