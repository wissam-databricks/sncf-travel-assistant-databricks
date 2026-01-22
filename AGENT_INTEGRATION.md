# 🤖 Intégration de l'Agent Databricks

## ✅ Implémentation Complète

J'ai implémenté le flux complet pour que le chatbot envoie les messages à votre agent Databricks et récupère les réponses.

---

## 🔄 Flux d'Intégration

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│                 │
│  - Utilisateur  │
│    clique sur   │
│    "Envoyer"    │
└────────┬────────┘
         │
         │ POST /api/chat
         │ { message, context }
         ▼
┌─────────────────┐
│   Backend       │
│   (FastAPI)     │
│                 │
│  - Reçoit le    │
│    message      │
│  - Ajoute       │
│    contexte     │
└────────┬────────┘
         │
         │ POST /serving-endpoints/...
         │ Authorization: Bearer {token}
         │ { messages: [...] }
         ▼
┌─────────────────┐
│  Agent Databricks│
│                 │
│  agents_sncf_   │
│  prod-travel_   │
│  assistant-     │
│  sncf-travel-   │
│  agent          │
└────────┬────────┘
         │
         │ Réponse JSON
         ▼
┌─────────────────┐
│   Backend       │
│   Parse réponse │
└────────┬────────┘
         │
         │ JSON response
         ▼
┌─────────────────┐
│   Frontend      │
│   Affiche       │
│   réponse       │
└─────────────────┘
```

---

## 📁 Fichiers Créés/Modifiés

### 1. `frontend/lib/agent-client.ts` ✨ **NOUVEAU**

**Rôle** : Client frontend pour communiquer avec le backend

**Fonctions principales** :
- `sendMessageToAgent()` : Envoie un message au backend
- `getNextTrip()` : Récupère les infos du prochain voyage

**Code** :
```typescript
export async function sendMessageToAgent(
  message: string,
  context: TripContext
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversation_id: context.tripId,
      context: {
        train_number: context.trainNumber,
        departure_station: context.departureStation,
        departure_time: context.departureTime,
      },
    }),
  })
  
  const data = await response.json()
  return data.response
}
```

### 2. `backend/server.py` 🔧 **MODIFIÉ**

**Changements** :
- ✅ Ajout du champ `context` dans `ChatMessage`
- ✅ Remplacé les réponses mockées par un vrai appel à l'agent
- ✅ Gestion des erreurs (timeout, HTTP errors)
- ✅ Support de plusieurs formats de réponse de l'agent

**Endpoint `/api/chat`** :
```python
@app.post("/api/chat")
async def chat(chat_message: ChatMessage) -> ChatResponse:
    # Préparer le contexte
    context_info = ""
    if chat_message.context:
        context_info = f"\n\nContexte du voyage:\n"
        context_info += f"- Train: {chat_message.context['train_number']}\n"
        # ...
    
    # Appeler l'agent Databricks
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            AGENT_ENDPOINT_URL,
            headers={"Authorization": f"Bearer {DATABRICKS_TOKEN}"},
            json={"messages": [{"role": "user", "content": full_prompt}]}
        )
        
        agent_data = response.json()
        agent_response = agent_data["choices"][0]["message"]["content"]
        
        return ChatResponse(
            response=agent_response,
            conversation_id=conversation_id,
            timestamp=datetime.now().isoformat()
        )
```

### 3. `databricks.yml` 🔧 **MODIFIÉ**

**Changement** : Configuration de l'agent pour l'environnement dev

```yaml
targets:
  dev:
    resources:
      apps:
        sncf_travel_app:
          config:
            env:
              - name: AGENT_ENDPOINT_URL
                value: "https://${workspace.host}/serving-endpoints/agents_sncf_prod-travel_assistant-sncf-travel-agent/invocations"
```

---

## 🎯 Comment ça Fonctionne

### Quand l'utilisateur envoie un message :

1. **Frontend** (`page.tsx`) :
   ```typescript
   const response = await sendMessageToAgent(content, {
     tripId: "1",
     trainNumber: "TGV 6241",
     departureStation: "Paris Gare de Lyon",
     departureTime: "08:47",
   })
   ```

2. **Client API** (`agent-client.ts`) :
   - Fait un `POST` vers `/api/chat`
   - Envoie le message + contexte du voyage

3. **Backend** (`server.py`) :
   - Reçoit le message
   - Ajoute le contexte au prompt
   - Appelle l'agent Databricks
   - Parse la réponse
   - Retourne au frontend

4. **Frontend** affiche la réponse

---

## 🚀 Tester Maintenant

### Étape 1: Commiter les Changements

```bash
cd /Users/wissam.benboubaker/Documents/Workspace/databricks_challenge

git add frontend/lib/agent-client.ts backend/server.py databricks.yml
git commit -m "Integrate Databricks Agent with chatbot

✨ Features:
- Created frontend/lib/agent-client.ts to call backend API
- Modified backend/server.py to call Databricks Agent
- Real-time agent responses instead of mock data
- Context-aware prompts (train number, station, time)
- Proper error handling (timeout, HTTP errors)

🔄 Flow:
Frontend → Backend API → Databricks Agent → Backend → Frontend

🤖 Agent:
Name: agents_sncf_prod-travel_assistant-sncf-travel-agent
Endpoint: /serving-endpoints/agents_sncf_prod-travel_assistant-sncf-travel-agent/invocations"

git push origin main
```

### Étape 2: Builder le Frontend

```bash
cd frontend
npm install  # Si pas déjà fait
npm run build
```

### Étape 3: Déployer sur Databricks

```bash
cd ..
./deploy.sh dev
```

---

## 🧪 Tester Localement (Avant Déploiement)

### Terminal 1 : Backend

```bash
cd backend
source ../venv/bin/activate

# Configurer les variables d'environnement
export AGENT_ENDPOINT_URL="https://adb-984752964297111.11.azuredatabricks.net/serving-endpoints/agents_sncf_prod-travel_assistant-sncf-travel-agent/invocations"
export DATABRICKS_TOKEN="votre-token-ici"

# Lancer le backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 : Frontend

```bash
cd frontend
npm run dev
```

### Tester

1. Ouvrez http://localhost:3000
2. Tapez un message dans le chat : "Quel est mon prochain train ?"
3. Cliquez sur "Envoyer"
4. Vous devriez voir la réponse de l'agent Databricks ! 🎉

---

## 📊 Logs de Debugging

Le backend affiche des logs utiles :

```
🤖 Calling Databricks Agent...
📍 Endpoint: https://adb-984752964297111.11.azuredatabricks.net/serving-endpoints/...
📝 Message: Quel est mon prochain train ?
✅ Agent response: 245 chars
```

En cas d'erreur :

```
❌ HTTP error: 401
Response: {"error": "Invalid token"}
```

ou

```
⏱️ Timeout calling agent
```

---

## 🔐 Variables d'Environnement Requises

### Sur Databricks (via `databricks.yml`)

```yaml
env:
  - name: AGENT_ENDPOINT_URL
    value: "https://${workspace.host}/serving-endpoints/agents_sncf_prod-travel_assistant-sncf-travel-agent/invocations"
  
  - name: DATABRICKS_TOKEN
    value: "{{secrets/sncf-travel-app/databricks-token}}"
```

### En Local (pour tester)

```bash
export AGENT_ENDPOINT_URL="https://adb-984752964297111.11.azuredatabricks.net/serving-endpoints/agents_sncf_prod-travel_assistant-sncf-travel-agent/invocations"
export DATABRICKS_TOKEN="votre-token"
```

---

## 🐛 Troubleshooting

### Erreur 401 (Unauthorized)

**Cause** : Token invalide ou expiré

**Solution** :
```bash
# Vérifier que le token est dans le secrets scope
databricks secrets list --scope sncf-travel-app

# Ou mettre à jour le token
echo "nouveau-token" | databricks secrets put-secret sncf-travel-app databricks-token
```

### Erreur 404 (Not Found)

**Cause** : L'endpoint de l'agent n'existe pas ou le nom est incorrect

**Solution** : Vérifier le nom de l'agent
```bash
databricks serving-endpoints list
```

### Timeout

**Cause** : L'agent met trop de temps à répondre

**Solution** :
- Augmenter le timeout dans `server.py` : `timeout=60.0`
- Vérifier que l'agent est bien actif (pas en "scaling to zero")

### Mode Fallback

Si l'agent n'est pas configuré, le backend retourne :

```
⚠️ L'agent AI n'est pas encore configuré.
```

Vérifiez que `AGENT_ENDPOINT_URL` et `DATABRICKS_TOKEN` sont bien définis.

---

## ✅ Checklist de Déploiement

- [ ] Fichiers créés/modifiés :
  - [ ] `frontend/lib/agent-client.ts`
  - [ ] `backend/server.py`
  - [ ] `databricks.yml`
- [ ] Variables d'environnement configurées
- [ ] Token Databricks dans le secrets scope
- [ ] Agent créé et actif sur Databricks
- [ ] Frontend buildé (`npm run build`)
- [ ] Tests locaux effectués
- [ ] Code commité et pushé sur GitHub
- [ ] Déploiement sur Databricks : `./deploy.sh dev`

---

## 🎉 Résultat Final

Maintenant, quand un utilisateur tape un message dans le chatbot :

1. ✅ Le message est envoyé à votre agent Databricks
2. ✅ L'agent génère une réponse intelligente
3. ✅ La réponse est affichée dans le chat
4. ✅ Le contexte du voyage (train, gare, heure) est pris en compte

**L'application utilise un VRAI agent AI ! 🤖✨**

---

## 📞 Support

Si vous avez des questions ou des erreurs :
1. Vérifiez les logs du backend
2. Testez l'agent directement depuis Databricks UI
3. Vérifiez que le token a les bonnes permissions

**Bonne chance avec le déploiement ! 🚀**
