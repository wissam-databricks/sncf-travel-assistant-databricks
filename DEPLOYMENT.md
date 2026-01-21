# Guide de Déploiement - SNCF Travel Assistant

Ce guide détaille les étapes complètes pour déployer l'application sur Databricks Apps.

## 📋 Prérequis

### 1. Outils Requis

- **Databricks CLI** (version 0.210.0+)
- **Python 3.10+**
- **Git**
- **npm/pnpm** (pour le build du frontend si nécessaire)

### 2. Permissions Databricks

Vous devez avoir les permissions suivantes dans le workspace :
- Créer et gérer des Apps
- Créer des Model Serving Endpoints
- Accès en lecture/écriture au Unity Catalog (si utilisé)
- Gérer des Secrets

## 🔧 Configuration Initiale

### Étape 1 : Installation de Databricks CLI

```bash
# Avec pip
pip install databricks-cli

# Avec Homebrew (macOS)
brew install databricks

# Vérifier l'installation
databricks --version
```

### Étape 2 : Configuration du CLI

```bash
databricks configure --token
```

Vous serez invité à fournir :
- **Host** : URL de votre workspace (ex: https://your-workspace.cloud.databricks.com)
- **Token** : Votre token d'accès personnel (à générer depuis le workspace)

Pour générer un token :
1. Connectez-vous à votre workspace Databricks
2. Allez dans **Settings** → **User Settings** → **Access Tokens**
3. Cliquez sur **Generate New Token**
4. Copiez le token (il ne sera affiché qu'une fois !)

### Étape 3 : Vérification de la Configuration

```bash
# Tester la connexion
databricks workspace list /

# Vérifier votre identité
databricks current-user me
```

## 🏗️ Configuration du Projet

### Étape 1 : Mise à Jour de databricks.yml

Ouvrez `databricks.yml` et remplacez les valeurs suivantes :

```yaml
targets:
  dev:
    workspace:
      host: https://votre-workspace.cloud.databricks.com  # REMPLACER ICI
```

Pour chaque environnement (dev, staging, prod), mettez à jour le `host`.

### Étape 2 : Configuration des Variables du Catalog

Dans `databricks.yml`, section `variables` :

```yaml
variables:
  catalog:
    default: "votre_catalog"  # REMPLACER ICI
  
  schema:
    default: "votre_schema"   # REMPLACER ICI
```

### Étape 3 : Configuration de l'Endpoint Agent AI

Dans `app.yaml` et `databricks.yml`, mettez à jour l'URL de l'endpoint :

```yaml
env:
  - name: AGENT_ENDPOINT_URL
    value: "https://votre-workspace/serving-endpoints/votre-endpoint/invocations"
```

## 🔐 Configuration des Secrets

### Créer le Scope de Secrets

```bash
# Créer un nouveau scope
databricks secrets create-scope sncf-travel-app

# Vérifier qu'il a été créé
databricks secrets list-scopes
```

### Ajouter les Secrets

```bash
# Token pour l'authentification (utiliser un Service Principal en production)
databricks secrets put-secret sncf-travel-app databricks-token

# Un éditeur de texte s'ouvrira, collez votre token, sauvegardez et fermez
```

### Vérifier les Secrets

```bash
# Lister les secrets (les valeurs ne sont pas affichées)
databricks secrets list-secrets sncf-travel-app
```

## 🚢 Déploiement

### Validation Avant Déploiement

```bash
# Valider la syntaxe et la configuration
databricks bundle validate -t dev

# Si des erreurs apparaissent, corrigez-les avant de continuer
```

Erreurs courantes :
- `workspace.host not set` → Mettez à jour le host dans databricks.yml
- `invalid resource configuration` → Vérifiez la syntaxe YAML

### Premier Déploiement (Dev)

```bash
# Déployer sur l'environnement de développement
databricks bundle deploy -t dev

# Cette commande va :
# 1. Uploader le code source vers le workspace
# 2. Créer l'app
# 3. Créer le model serving endpoint (si configuré)
# 4. Créer les jobs (si configurés)
```

### Vérifier le Déploiement

```bash
# Lister les apps déployées
databricks apps list

# Obtenir les détails de l'app
databricks apps get sncf-travel-assistant-dev

# La commande affichera notamment l'URL de l'app
```

### Accéder à l'Application

1. **Via CLI** :
   ```bash
   # Obtenir l'URL
   databricks apps get sncf-travel-assistant-dev --output json | grep '"url"'
   ```

2. **Via Console Web** :
   - Connectez-vous au workspace Databricks
   - Allez dans **Apps** (dans le menu de gauche)
   - Cliquez sur votre app

### Consulter les Logs

```bash
# Logs en temps réel
databricks apps logs sncf-travel-assistant-dev --follow

# Logs des dernières heures
databricks apps logs sncf-travel-assistant-dev --since 2h

# Sauvegarder les logs dans un fichier
databricks apps logs sncf-travel-assistant-dev > app.log
```

## 🔄 Déploiement Staging et Production

### Staging

```bash
# 1. Valider la config staging
databricks bundle validate -t staging

# 2. Déployer
databricks bundle deploy -t staging

# 3. Vérifier
databricks apps get sncf-travel-assistant-staging
```

### Production

⚠️ **IMPORTANT** : En production, utilisez un Service Principal au lieu de votre token personnel.

#### Créer un Service Principal

1. Dans le workspace Databricks, allez dans **Admin Console**
2. Cliquez sur **Service Principals**
3. **Add Service Principal**
4. Notez l'Application ID
5. Générez un secret client

#### Configurer le CLI pour le Service Principal

```bash
# Créer un nouveau profil pour la production
databricks configure --token --profile production

# Utiliser le token du service principal
```

#### Déployer en Production

```bash
# 1. Valider
databricks bundle validate -t prod --profile production

# 2. Déployer
databricks bundle deploy -t prod --profile production

# 3. Vérifier
databricks apps get sncf-travel-assistant --profile production
```

## 🧪 Tests Post-Déploiement

### Test de Santé

```bash
# Tester l'endpoint health
curl https://votre-app-url/health

# Réponse attendue :
# {
#   "status": "healthy",
#   "timestamp": "2026-01-21T...",
#   "agent_configured": true
# }
```

### Test du Chatbot

```bash
# Test du endpoint chat
curl -X POST https://votre-app-url/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quel est mon prochain train ?",
    "user_id": "test-user"
  }'
```

### Test du Dashboard Admin

```bash
# Test des KPIs
curl https://votre-app-url/api/admin/kpis

# Test des charts
curl https://votre-app-url/api/admin/charts
```

## 🔄 Mises à Jour

### Mettre à Jour le Code

```bash
# 1. Modifier le code localement
# 2. Commit (optionnel mais recommandé)
git add .
git commit -m "Update: description"

# 3. Redéployer
databricks bundle deploy -t dev

# L'app redémarre automatiquement avec le nouveau code
```

### Mettre à Jour la Configuration

```bash
# 1. Modifier app.yaml ou databricks.yml
# 2. Valider
databricks bundle validate -t dev

# 3. Redéployer
databricks bundle deploy -t dev
```

### Mettre à Jour les Secrets

```bash
# Mettre à jour un secret existant
databricks secrets put-secret sncf-travel-app databricks-token

# Redémarrer l'app pour prendre en compte le nouveau secret
databricks apps restart sncf-travel-assistant-dev
```

## 🛠️ Gestion de l'Application

### Commandes Utiles

```bash
# Lister toutes les apps
databricks apps list

# Démarrer une app arrêtée
databricks apps start sncf-travel-assistant-dev

# Arrêter une app
databricks apps stop sncf-travel-assistant-dev

# Redémarrer une app
databricks apps restart sncf-travel-assistant-dev

# Supprimer une app
databricks apps delete sncf-travel-assistant-dev

# Obtenir les métriques
databricks apps get-metrics sncf-travel-assistant-dev
```

### Monitoring

Dans la console Databricks Apps, vous pouvez voir :
- **Status** : Running, Stopped, Error
- **Métriques** : CPU, RAM, requêtes/sec
- **Logs** : Logs en temps réel
- **Events** : Historique des événements (démarrage, erreurs, etc.)

## 🐛 Troubleshooting

### Problème : "App failed to start"

```bash
# 1. Consulter les logs
databricks apps logs sncf-travel-assistant-dev

# 2. Vérifier les erreurs courantes :
# - Dépendances manquantes (requirements.txt)
# - Variables d'environnement incorrectes
# - Port déjà utilisé
# - Erreur dans le code
```

### Problème : "Cannot connect to Agent endpoint"

```bash
# 1. Vérifier que l'endpoint existe
databricks serving-endpoints list

# 2. Vérifier l'URL dans la config
databricks apps get sncf-travel-assistant-dev --output json | grep AGENT_ENDPOINT_URL

# 3. Vérifier les permissions du token
databricks current-user me
```

### Problème : "Bundle validation failed"

```bash
# 1. Vérifier la syntaxe YAML
# Utiliser un validateur YAML en ligne ou :
python -c "import yaml; yaml.safe_load(open('databricks.yml'))"

# 2. Vérifier les références de ressources
# 3. Vérifier que les variables sont définies
```

### Problème : "Frontend returns 404"

Le frontend Next.js doit être buildé :

```bash
cd frontend
npm install
npm run build

# Vérifier que le dossier 'out' ou '.next' est créé
ls -la

# Redéployer
cd ..
databricks bundle deploy -t dev
```

## 📊 Monitoring en Production

### Alertes Recommandées

Configurez des alertes pour :
- App status != running
- Taux d'erreur > 5%
- Temps de réponse > 5s
- Utilisation mémoire > 80%

### Logs Centralisés

Exportez les logs vers un système de logging centralisé :
- AWS CloudWatch
- Azure Monitor
- Splunk
- Datadog

### Backup

Sauvegardez régulièrement :
- Code source (via Git)
- Configuration (databricks.yml, app.yaml)
- Secrets (documentation sécurisée)
- Données du Unity Catalog

## 🔐 Best Practices de Sécurité

1. **Jamais de secrets en clair** dans le code ou les configs
2. **Service Principal** pour staging et prod (pas de tokens personnels)
3. **Rotation régulière des tokens** (tous les 90 jours)
4. **Principe du moindre privilège** pour les permissions
5. **Audit logs** : Activez les audit logs Databricks
6. **Network isolation** : Utilisez des Private Links si disponible

## 📞 Support

En cas de problème :

1. **Documentation Databricks** : https://docs.databricks.com/
2. **Community Forums** : https://community.databricks.com/
3. **Support Ticket** : Via votre workspace Databricks
4. **Équipe interne** : Contactez votre équipe d'infrastructure

## 📚 Ressources Supplémentaires

- [Databricks Apps Quickstart](https://docs.databricks.com/en/dev-tools/databricks-apps/quickstart.html)
- [Asset Bundles Reference](https://docs.databricks.com/en/dev-tools/bundles/reference.html)
- [Model Serving Documentation](https://docs.databricks.com/en/machine-learning/model-serving/index.html)
- [Unity Catalog](https://docs.databricks.com/en/data-governance/unity-catalog/index.html)
