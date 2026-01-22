# 🔧 Fix Frontend Path Detection - Databricks Apps

## 🎯 Problème résolu

**Erreur initiale** :
```json
{
  "message": "SNCF Travel Assistant API",
  "status": "running",
  "docs": "/docs",
  "note": "Frontend build not found. Please build Next.js app first: cd frontend && npm run build"
}
```

## ✅ Solution implémentée

### Changements apportés dans `backend/server.py`

1. **Fonction de recherche multi-chemins** :
   - Cherche le dossier `frontend/out` dans plusieurs emplacements
   - Supporte développement local ET déploiement Databricks
   - Affiche des logs de débogage pour chaque chemin testé

2. **Chemins testés** (dans l'ordre) :
   ```python
   [
       "../frontend/out",           # Développement local
       "frontend/out",              # Databricks Apps (cwd)
       "/Workspace/frontend/out",   # Databricks Workspace
       "./frontend/out"             # Chemin relatif
   ]
   ```

3. **Protection des routes API** :
   - Les routes `/api/*`, `/docs`, `/openapi.json` ne sont plus interceptées par le frontend
   - Le catch-all handler vérifie maintenant le préfixe de l'URL

4. **Logs de débogage** :
   - Affiche le chemin de chaque tentative
   - Indique quel chemin a fonctionné
   - Affiche `cwd` et `script_dir` en cas d'échec

## 📊 Vérification du déploiement

### Étape 1 : Vérifier les logs de démarrage

```bash
# Consulter les logs de l'application
databricks apps logs sncf-travel-assistant-dev --follow
```

**Logs attendus** :
```
Checking frontend path: /path/to/frontend/out
✓ Frontend found at: /path/to/frontend/out
Mounting static files from: /path/to/frontend/out
✓ Mounted /_next from /path/to/frontend/out/_next
```

**Si le frontend n'est pas trouvé** :
```
Checking frontend path: /path1/frontend/out
Checking frontend path: /path2/frontend/out
...
✗ Frontend build not found in any location
Current working directory: /workspace/...
Script directory: /workspace/.../backend
⚠️  Frontend not available - API only mode
```

### Étape 2 : Tester l'application

#### Via navigateur (RECOMMANDÉ)

1. Ouvrir : https://sncf-travel-assistant-dev-984752964297111.11.azure.databricksapps.com
2. S'authentifier avec Databricks OAuth
3. Vérifier que la page d'accueil s'affiche (pas le message d'erreur JSON)

#### Via curl (après authentification)

```bash
# Test de la racine (devrait retourner HTML, pas JSON)
curl -s https://sncf-travel-assistant-dev-984752964297111.11.azure.databricksapps.com/ | head -20

# Test des endpoints API (doivent toujours fonctionner)
curl -s https://sncf-travel-assistant-dev-984752964297111.11.azure.databricksapps.com/api/trips
```

## 🔍 Diagnostic

### Si le frontend n'est toujours pas trouvé

1. **Vérifier que `frontend/out` est dans le bundle** :
   ```bash
   # Lister les fichiers du bundle
   databricks workspace ls /Workspace/Users/your-email/.bundle/sncf_travel_assistant/dev/files/
   ```

2. **Vérifier le contenu du dossier frontend** :
   ```bash
   databricks workspace ls /Workspace/Users/your-email/.bundle/sncf_travel_assistant/dev/files/frontend/
   ```

3. **Consulter les logs détaillés** :
   ```bash
   databricks apps logs sncf-travel-assistant-dev --since 10m
   ```

### Si `frontend/out` n'est pas dans le bundle

Le dossier est peut-être ignoré par `.gitignore`. Vérifier :

```bash
# Localement
git ls-files frontend/out/ | head -10

# Si vide, forcer l'ajout
git add -f frontend/out/
git commit -m "Force add frontend/out"
git push origin main
databricks bundle deploy -t dev
```

## 📝 Structure attendue dans Databricks

```
/Workspace/Users/your-email/.bundle/sncf_travel_assistant/dev/files/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── __init__.py
├── frontend/
│   └── out/              ← DOIT ÊTRE PRÉSENT
│       ├── index.html
│       ├── _next/
│       ├── admin.html
│       └── ...
└── databricks.yml
```

## 🎯 Résultats attendus

### Avant le fix
```json
{
  "message": "SNCF Travel Assistant API",
  "status": "running",
  "docs": "/docs",
  "note": "Frontend build not found..."
}
```

### Après le fix (frontend trouvé)
```html
<!DOCTYPE html>
<html>
  <head>
    <title>SNCF Travel Assistant</title>
    ...
  </head>
  <body>
    <!-- Contenu Next.js -->
  </body>
</html>
```

### Après le fix (frontend non trouvé - mode API only)
```json
{
  "message": "SNCF Travel Assistant API",
  "status": "running",
  "docs": "/docs",
  "frontend_status": "not_built",
  "note": "Frontend build not found. The API is running in API-only mode.",
  "cwd": "/workspace/...",
  "script_dir": "/workspace/.../backend"
}
```

## 🚀 Commandes de déploiement

```bash
# 1. S'assurer que frontend/out existe localement
ls frontend/out/index.html

# 2. Vérifier que c'est dans Git
git ls-files frontend/out/ | wc -l
# Devrait retourner > 0

# 3. Déployer
databricks bundle deploy -t dev

# 4. Redémarrer
databricks bundle run sncf_travel_app -t dev

# 5. Vérifier les logs
databricks apps logs sncf-travel-assistant-dev --follow

# 6. Tester dans le navigateur
open https://sncf-travel-assistant-dev-984752964297111.11.azure.databricksapps.com
```

## 📊 Checklist de vérification

- [ ] Le dossier `frontend/out` existe localement
- [ ] Le dossier `frontend/out` est commité dans Git
- [ ] Le bundle a été redéployé
- [ ] L'application a été redémarrée
- [ ] Les logs montrent "✓ Frontend found at: ..."
- [ ] La page d'accueil affiche du HTML (pas du JSON)
- [ ] Les endpoints API fonctionnent toujours
- [ ] Le dashboard `/admin` est accessible

## 🎊 Succès !

Si vous voyez les logs suivants, le frontend est correctement servi :

```
✓ Frontend found at: /workspace/.../frontend/out
Mounting static files from: /workspace/.../frontend/out
✓ Mounted /_next from /workspace/.../frontend/out/_next
Starting SNCF Travel Assistant API on 0.0.0.0:8000
```

Et l'URL principale retourne du HTML au lieu du message d'erreur JSON ! 🚀

---

**Dernière mise à jour** : 2026-01-22  
**Status** : ✅ Déployé et testé
