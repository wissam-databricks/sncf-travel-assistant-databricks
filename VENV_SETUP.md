# 🐍 Python Virtual Environment Setup

Guide pour configurer et utiliser l'environnement virtuel Python pour le backend.

## ✅ Environnement créé

Un environnement virtuel Python a été créé dans le dossier `venv/` avec Python 3.13.5.

## 🚀 Activation de l'environnement virtuel

### macOS / Linux

```bash
# Depuis la racine du projet
source venv/bin/activate
```

### Windows

```bash
# PowerShell
venv\Scripts\Activate.ps1

# CMD
venv\Scripts\activate.bat
```

## ✓ Vérifier l'activation

Quand le venv est activé, vous verrez `(venv)` au début de votre prompt :

```bash
(venv) your-user@machine:~/databricks_challenge$
```

Vérifier le Python utilisé :

```bash
which python    # macOS/Linux
where python    # Windows
# Devrait pointer vers: .../databricks_challenge/venv/bin/python
```

## 📦 Packages installés

Les dépendances suivantes sont déjà installées :

| Package | Version | Description |
|---------|---------|-------------|
| **fastapi** | 0.128.0 | Framework API REST |
| **uvicorn** | 0.40.0 | Serveur ASGI |
| **httpx** | 0.28.1 | Client HTTP async |
| **pydantic** | 2.12.5 | Validation de données |
| **gunicorn** | 23.0.0 | Serveur production |
| **python-dotenv** | 1.2.1 | Gestion variables d'environnement |

## 🏃 Lancer le backend

```bash
# 1. Activer le venv
source venv/bin/activate

# 2. Démarrer le serveur
cd backend
python server.py

# Ou avec uvicorn directement
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Le serveur sera disponible sur :
- **API** : http://localhost:8000
- **Documentation** : http://localhost:8000/docs
- **Health check** : http://localhost:8000/health

## 🔄 Réinstaller les dépendances

Si nécessaire, vous pouvez réinstaller toutes les dépendances :

```bash
# Activer le venv
source venv/bin/activate

# Installer/Mettre à jour les dépendances
pip install -r backend/requirements.txt
```

## ➕ Ajouter une nouvelle dépendance

```bash
# 1. Activer le venv
source venv/bin/activate

# 2. Installer le package
pip install nom-du-package

# 3. Mettre à jour requirements.txt
pip freeze | grep nom-du-package >> backend/requirements.txt

# Ou manuellement éditer backend/requirements.txt
```

## 🧹 Désactiver le venv

```bash
deactivate
```

## 🗑️ Supprimer le venv

Si vous voulez recréer l'environnement de zéro :

```bash
# 1. Désactiver si activé
deactivate

# 2. Supprimer le dossier
rm -rf venv/

# 3. Recréer
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

## 🐛 Troubleshooting

### "python3: command not found"

Installer Python 3 :
```bash
# macOS
brew install python3

# Ubuntu/Debian
sudo apt-get install python3 python3-venv

# Windows
# Télécharger depuis https://www.python.org/downloads/
```

### "venv/bin/python: No such file or directory"

Le venv n'a pas été créé. Créez-le :
```bash
python3 -m venv venv
```

### Erreur d'import de module

Vérifiez que le venv est activé et que les dépendances sont installées :
```bash
source venv/bin/activate
pip install -r backend/requirements.txt
```

### Version de Python incompatible

Le projet nécessite Python 3.10+. Vérifiez votre version :
```bash
python3 --version
```

## 🎯 Next Steps

Une fois le venv configuré, vous pouvez :

1. **Tester le backend localement** :
   ```bash
   source venv/bin/activate
   cd backend
   python server.py
   ```

2. **Accéder à la documentation** : http://localhost:8000/docs

3. **Tester les endpoints** :
   ```bash
   curl http://localhost:8000/health
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Bonjour"}'
   ```

4. **Développer et tester** avant de déployer sur Databricks

## 📚 Ressources

- [Python venv Documentation](https://docs.python.org/3/library/venv.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)

---

**Environnement créé le** : 2026-01-21  
**Python version** : 3.13.5  
**Status** : ✅ Prêt à l'emploi
