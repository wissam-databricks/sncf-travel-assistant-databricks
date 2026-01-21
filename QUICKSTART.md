# 🚀 Quick Start - SNCF Travel Assistant

Guide de démarrage rapide pour déployer l'application en moins de 15 minutes.

## ✅ Checklist Pré-Déploiement

- [ ] Databricks CLI installé (`pip install databricks-cli`)
- [ ] Accès à un workspace Databricks
- [ ] Token d'authentification Databricks généré
- [ ] Python 3.10+ installé

## 🏃 Démarrage Rapide

### 1. Configuration du CLI (2 min)

```bash
# Installer Databricks CLI
pip install databricks-cli

# Configurer avec votre workspace
databricks configure --token
# Entrer: https://your-workspace.cloud.databricks.com
# Entrer: votre-token-personnel
```

### 2. Personnaliser la Configuration (3 min)

**Éditer `databricks.yml`** - Remplacer les placeholders :

```yaml
# Ligne ~82 (section dev)
workspace:
  host: https://VOTRE-WORKSPACE.cloud.databricks.com  # ← MODIFIER ICI

# Ligne ~98 (section staging)  
workspace:
  host: https://VOTRE-WORKSPACE.cloud.databricks.com  # ← MODIFIER ICI

# Ligne ~124 (section prod)
workspace:
  host: https://VOTRE-WORKSPACE.cloud.databricks.com  # ← MODIFIER ICI
```

**Optionnel** - Adapter les variables selon vos besoins :
```yaml
variables:
  catalog:
    default: "votre_catalog"  # Par défaut: sncf_prod
  schema:
    default: "votre_schema"   # Par défaut: travel_assistant
```

### 3. Créer les Secrets (2 min)

```bash
# Créer le scope
databricks secrets create-scope sncf-travel-app

# Ajouter le token (un éditeur s'ouvrira)
databricks secrets put-secret sncf-travel-app databricks-token
# Coller votre token, sauvegarder et fermer

# Vérifier
databricks secrets list-secrets sncf-travel-app
```

### 4. Valider la Configuration (1 min)

```bash
# Valider le bundle pour dev
databricks bundle validate -t dev

# Si OK, vous devriez voir:
# ✅ Validation complete!
```

**En cas d'erreur** :
- `workspace.host not set` → Vérifier databricks.yml ligne 82
- `invalid syntax` → Vérifier l'indentation YAML
- `authentication failed` → Re-configurer le CLI (étape 1)

### 5. Déployer sur Dev (5 min)

```bash
# Déployer l'application
databricks bundle deploy -t dev

# Attendre la fin du déploiement (peut prendre 3-5 min la première fois)
# Vous verrez: ✅ Deployment complete!
```

### 6. Vérifier et Accéder (2 min)

```bash
# Obtenir l'URL de l'app
databricks apps get sncf-travel-assistant-dev

# Ou directement extraire l'URL:
databricks apps get sncf-travel-assistant-dev --output json | grep '"url"'

# Tester le health check
curl https://VOTRE-APP-URL/health
```

**Accéder à l'application** :
1. Copier l'URL affichée
2. Ouvrir dans le navigateur
3. Ou aller dans le workspace Databricks → Apps → `sncf-travel-assistant-dev`

### 7. Consulter les Logs

```bash
# Voir les logs en temps réel
databricks apps logs sncf-travel-assistant-dev --follow

# Ou sauvegarder dans un fichier
databricks apps logs sncf-travel-assistant-dev > app.log
```

## 🧪 Tester l'API

### Health Check

```bash
curl https://VOTRE-APP-URL/health
```

**Réponse attendue** :
```json
{
  "status": "healthy",
  "timestamp": "2026-01-21T...",
  "agent_configured": true
}
```

### Chatbot (Mock)

```bash
curl -X POST https://VOTRE-APP-URL/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quel est mon prochain train ?",
    "user_id": "test-user"
  }'
```

**Réponse attendue** :
```json
{
  "response": "Votre prochain train est le TGV 6623...",
  "conversation_id": "conv-...",
  "timestamp": "2026-01-21T..."
}
```

### Admin KPIs (Mock)

```bash
curl https://VOTRE-APP-URL/api/admin/kpis
```

### Documentation Interactive

Ouvrir dans le navigateur :
```
https://VOTRE-APP-URL/docs
```

→ Interface Swagger avec tous les endpoints et possibilité de tester directement !

## 🔧 Configuration Avancée (Optionnel)

### Connecter un Agent AI Réel

**1. Créer/Déployer un Model Serving Endpoint**

Via l'interface Databricks ou CLI :
```bash
# L'endpoint sera créé automatiquement par le bundle
# Ou le créer manuellement dans le workspace
```

**2. Mettre à jour l'URL dans databricks.yml**

```yaml
env:
  - name: AGENT_ENDPOINT_URL
    value: "https://${workspace.host}/serving-endpoints/VOTRE-ENDPOINT/invocations"
```

**3. Redéployer**

```bash
databricks bundle deploy -t dev
databricks apps restart sncf-travel-assistant-dev
```

**4. Décommenter le code dans backend/server.py**

Ligne 81-104 : code pour appeler l'Agent AI réel

### Connecter aux Tables Delta

**1. Créer les tables dans Unity Catalog**

Voir schéma complet dans `ARCHITECTURE.md`

```sql
-- Exemple: table conversations
CREATE TABLE sncf_dev.travel_assistant.conversations (
  conversation_id STRING,
  user_id STRING,
  started_at TIMESTAMP,
  -- ...
);
```

**2. Implémenter les requêtes dans server.py**

Remplacer les données mock par des requêtes Spark/SQL

**3. Ajouter les dépendances**

```bash
# Dans backend/requirements.txt, ajouter:
# databricks-sql-connector==2.9.3
```

## 🔄 Workflow de Développement

### Modifier le Backend

```bash
# 1. Éditer backend/server.py
vim backend/server.py

# 2. Tester localement (optionnel)
cd backend
python server.py
# → http://localhost:8000

# 3. Déployer les changements
databricks bundle deploy -t dev

# 4. L'app redémarre automatiquement
# Vérifier les logs
databricks apps logs sncf-travel-assistant-dev --tail 50
```

### Modifier la Configuration

```bash
# 1. Éditer app.yaml ou databricks.yml
vim databricks.yml

# 2. Valider
databricks bundle validate -t dev

# 3. Redéployer
databricks bundle deploy -t dev
```

### Mettre à Jour un Secret

```bash
# 1. Mettre à jour le secret
databricks secrets put-secret sncf-travel-app databricks-token

# 2. Redémarrer l'app pour prendre en compte le nouveau secret
databricks apps restart sncf-travel-assistant-dev
```

## 🐛 Troubleshooting Rapide

### L'app ne démarre pas

```bash
# Consulter les logs
databricks apps logs sncf-travel-assistant-dev

# Erreurs courantes:
# - "ModuleNotFoundError" → Vérifier requirements.txt
# - "Address already in use" → Port 8000 déjà utilisé (ne devrait pas arriver dans Databricks)
# - "AGENT_ENDPOINT_URL not set" → Vérifier app.yaml
```

### "bundle validate" échoue

```bash
# Vérifier la syntaxe YAML
python -c "import yaml; yaml.safe_load(open('databricks.yml'))"

# Erreur commune: indentation incorrecte
# Solution: Utiliser un validateur YAML en ligne
```

### "Cannot reach app URL"

```bash
# Vérifier que l'app est en cours d'exécution
databricks apps get sncf-travel-assistant-dev

# Status doit être: RUNNING
# Si STOPPED: databricks apps start sncf-travel-assistant-dev
# Si ERROR: consulter les logs
```

### Agent AI ne répond pas

Pour l'instant, l'app utilise des données mock. Pour connecter un vrai agent :

1. Créer un Model Serving Endpoint dans Databricks
2. Mettre à jour `AGENT_ENDPOINT_URL` dans databricks.yml
3. Décommenter le code ligne 81-104 dans server.py
4. Redéployer

## 📊 Monitoring

### Voir l'État de l'App

```bash
# Status général
databricks apps get sncf-travel-assistant-dev

# Métriques
databricks apps get-metrics sncf-travel-assistant-dev
```

### Dashboard Databricks

1. Connectez-vous au workspace
2. Menu → **Apps**
3. Cliquez sur `sncf-travel-assistant-dev`
4. Onglets disponibles :
   - **Overview** : Status, URL
   - **Logs** : Logs en temps réel
   - **Metrics** : CPU, RAM, requests/sec
   - **Configuration** : Voir la config actuelle

## 🎯 Prochaines Étapes

Une fois l'app déployée en dev :

1. **Tester tous les endpoints** (voir section "Tester l'API")
2. **Connecter un Agent AI réel** (voir "Configuration Avancée")
3. **Créer les tables Delta** et remplacer les mocks
4. **Builder le frontend** Next.js et l'intégrer
5. **Déployer sur staging** : `databricks bundle deploy -t staging`
6. **Configurer le CI/CD** (voir `.github/workflows/` dans PROJECT_STRUCTURE.md)
7. **Déployer sur prod** avec Service Principal

## 📚 Documentation Complète

- **README.md** : Vue d'ensemble et guide général
- **DEPLOYMENT.md** : Guide de déploiement détaillé
- **COMMANDS.md** : Référence complète des commandes CLI
- **ARCHITECTURE.md** : Documentation architecture technique
- **PROJECT_STRUCTURE.md** : Arborescence et description des fichiers

## 💡 Conseils

### Développement Local

Pour développer plus rapidement, testez le backend localement avant de déployer :

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows

# Installer les dépendances
pip install -r requirements.txt

# Créer un fichier .env (copier depuis .env.example)
cat > .env << EOF
AGENT_ENDPOINT_URL=https://...
DATABRICKS_TOKEN=your-token
WORKSPACE_URL=https://...
PORT=8000
EOF

# Démarrer le serveur
python server.py
# → http://localhost:8000
# → Documentation: http://localhost:8000/docs
```

### Utiliser des Profils CLI

Pour gérer plusieurs workspaces :

```bash
# Profil dev
databricks configure --token --profile dev

# Profil prod
databricks configure --token --profile prod

# Utiliser un profil
databricks apps list --profile dev
databricks bundle deploy -t prod --profile prod
```

### Logs en Continu

Pendant le développement, gardez les logs ouverts dans un terminal séparé :

```bash
databricks apps logs sncf-travel-assistant-dev --follow
```

## 🆘 Support

En cas de problème :

1. **Consulter les logs** : `databricks apps logs ...`
2. **Vérifier la documentation** : README.md, DEPLOYMENT.md
3. **Databricks Community** : https://community.databricks.com/
4. **Documentation officielle** : https://docs.databricks.com/

---

**Bon développement ! 🚀**

Si vous suivez ce guide, vous devriez avoir une application fonctionnelle en moins de 15 minutes !
