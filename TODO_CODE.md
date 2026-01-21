# 📝 TODOs dans le Code

Liste des TODOs à implémenter pour connecter le backend aux systèmes réels.

## 🔴 Critiques (Fonctionnalité core)

### 1. Connexion à l'Agent AI

**Fichier** : `backend/server.py`  
**Ligne** : 81-104  
**Fonction** : `chat()`

```python
# TODO: Appeler l'Agent AI réel via Databricks Model Serving
# Décommenter et adapter le code suivant :

if AGENT_ENDPOINT_URL and DATABRICKS_TOKEN:
    async with httpx.AsyncClient() as client:
        headers = {
            "Authorization": f"Bearer {DATABRICKS_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": chat_message.message
                }
            ]
        }
        response = await client.post(
            AGENT_ENDPOINT_URL,
            headers=headers,
            json=payload,
            timeout=30.0
        )
        response.raise_for_status()
        agent_response = response.json()
        return ChatResponse(
            response=agent_response["choices"][0]["message"]["content"],
            conversation_id=chat_message.conversation_id or "new-conv-id",
            timestamp=datetime.now().isoformat()
        )
```

**Prérequis** :
- Model Serving Endpoint déployé
- Variable `AGENT_ENDPOINT_URL` configurée
- Variable `DATABRICKS_TOKEN` configurée

**Priorité** : 🔴 HAUTE

---

### 2. Récupération des Voyages depuis la Base de Données

**Fichier** : `backend/server.py`  
**Ligne** : 134  
**Fonction** : `get_trips()`

```python
# TODO: Récupérer depuis une base de données ou API SNCF réelle

# Exemple avec Databricks SQL:
from databricks import sql

connection = sql.connect(
    server_hostname=os.getenv("DATABRICKS_SERVER_HOSTNAME"),
    http_path=os.getenv("DATABRICKS_HTTP_PATH"),
    access_token=DATABRICKS_TOKEN
)

cursor = connection.cursor()
cursor.execute("""
    SELECT 
        trip_id,
        train_number,
        departure_station,
        arrival_station,
        departure_time,
        arrival_time,
        platform,
        status,
        delay_minutes,
        seat,
        car
    FROM sncf_prod.travel_assistant.user_trips
    WHERE user_id = ? 
      AND departure_time > current_timestamp()
    ORDER BY departure_time ASC
    LIMIT 1
""", (user_id,))

result = cursor.fetchone()
# Formatter et retourner
```

**Prérequis** :
- Table `user_trips` créée dans Unity Catalog
- Connexion Databricks SQL configurée

**Priorité** : 🔴 HAUTE

---

### 3. Calcul des KPIs depuis les Tables Analytics

**Fichier** : `backend/server.py`  
**Ligne** : 161  
**Fonction** : `get_admin_kpis()`

```python
# TODO: Calculer depuis les vraies données (Delta tables, Databricks SQL)
# Exemple de requête :
# SELECT COUNT(*) as total_conversations 
# FROM catalog.schema.conversations_table
# WHERE date >= current_date - 7

# Exemple d'implémentation:
cursor.execute("""
    SELECT 
        SUM(total_conversations) as total_conv,
        AVG(conversion_rate) as avg_conversion,
        AVG(avg_response_time) as avg_time,
        AVG(avg_satisfaction) as avg_sat
    FROM sncf_prod.travel_assistant.daily_kpis
    WHERE date >= current_date - 7
""")

result = cursor.fetchone()
return {
    "total_conversations": result[0],
    "taxi_conversion_rate": result[1],
    "avg_response_time": result[2],
    "user_satisfaction": result[3],
    # Calculer les % de changement vs période précédente
}
```

**Prérequis** :
- Table `daily_kpis` créée
- Job analytics quotidien en place

**Priorité** : 🟡 MOYENNE

---

### 4. Données des Graphiques depuis Delta Tables

**Fichier** : `backend/server.py`  
**Ligne** : 195  
**Fonction** : `get_admin_charts()`

```python
# TODO: Récupérer depuis Delta tables avec agrégations temporelles

# Usage over time (7 derniers jours)
cursor.execute("""
    SELECT 
        date,
        total_conversations as conversations,
        unique_users,
        taxi_bookings
    FROM sncf_prod.travel_assistant.daily_kpis
    WHERE date >= current_date - 7
    ORDER BY date ASC
""")

usage_data = [
    {
        "date": row[0].isoformat(),
        "conversations": row[1],
        "unique_users": row[2],
        "taxi_bookings": row[3]
    }
    for row in cursor.fetchall()
]

# Distribution des requêtes
cursor.execute("""
    SELECT 
        request_type as type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
    FROM sncf_prod.travel_assistant.messages
    WHERE timestamp >= current_date - 7
    GROUP BY request_type
    ORDER BY count DESC
""")

request_distribution = [
    {
        "type": row[0],
        "count": row[1],
        "percentage": row[2]
    }
    for row in cursor.fetchall()
]

return {
    "usage_over_time": usage_data,
    "request_distribution": request_distribution,
    # ...
}
```

**Prérequis** :
- Tables analytics créées
- Classification des types de requêtes

**Priorité** : 🟡 MOYENNE

---

### 5. Analytics Marketing

**Fichier** : `backend/server.py`  
**Ligne** : 230  
**Fonction** : `get_analytics()`

```python
# TODO: Calculer depuis les tables analytics

# Exemple: Conversion funnel
cursor.execute("""
    WITH funnel AS (
        SELECT 
            COUNT(DISTINCT user_id) as total_users,
            COUNT(DISTINCT CASE WHEN chat_started THEN user_id END) as started_chat,
            COUNT(DISTINCT CASE WHEN query_resolved THEN user_id END) as resolved,
            COUNT(DISTINCT CASE WHEN service_booked THEN user_id END) as booked
        FROM sncf_prod.travel_assistant.user_sessions
        WHERE date >= current_date - 30
    )
    SELECT * FROM funnel
""")

# Top routes
cursor.execute("""
    SELECT 
        CONCAT(departure_station, ' - ', arrival_station) as route,
        COUNT(*) as bookings
    FROM sncf_prod.travel_assistant.bookings
    WHERE created_at >= current_date - 30
    GROUP BY departure_station, arrival_station
    ORDER BY bookings DESC
    LIMIT 5
""")

# etc.
```

**Priorité** : 🟢 BASSE (Nice to have)

---

## 🟡 Moyennes (Améliorations)

### 6. Persister les Conversations

**Fichier** : `backend/server.py`  
**Fonction** : `chat()`  
**Ajout nécessaire** :

```python
# Après avoir reçu la réponse de l'Agent AI, persister dans Delta:

cursor.execute("""
    INSERT INTO sncf_prod.travel_assistant.messages
    (message_id, conversation_id, role, content, timestamp)
    VALUES (?, ?, ?, ?, ?)
""", (
    str(uuid.uuid4()),
    conversation_id,
    "user",
    chat_message.message,
    datetime.now()
))

cursor.execute("""
    INSERT INTO sncf_prod.travel_assistant.messages
    (message_id, conversation_id, role, content, timestamp)
    VALUES (?, ?, ?, ?, ?)
""", (
    str(uuid.uuid4()),
    conversation_id,
    "assistant",
    response_text,
    datetime.now()
))

connection.commit()
```

**Priorité** : 🟡 MOYENNE

---

### 7. Gestion du Contexte Conversationnel

**Fichier** : `backend/server.py`  
**Fonction** : `chat()`  
**Amélioration** :

```python
# Récupérer l'historique de la conversation
cursor.execute("""
    SELECT role, content
    FROM sncf_prod.travel_assistant.messages
    WHERE conversation_id = ?
    ORDER BY timestamp ASC
    LIMIT 10
""", (conversation_id,))

history = [
    {"role": row[0], "content": row[1]}
    for row in cursor.fetchall()
]

# Ajouter le nouveau message
history.append({
    "role": "user",
    "content": chat_message.message
})

# Envoyer tout le contexte à l'Agent AI
payload = {
    "messages": history
}
```

**Priorité** : 🟡 MOYENNE

---

## 🟢 Basses (Optimisations)

### 8. Caching des Réponses Fréquentes

**Fichier** : `backend/server.py`  
**Ajout** : Utiliser Redis pour cacher les réponses

```python
import redis

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379))
)

# Dans la fonction chat():
cache_key = f"response:{hash(chat_message.message)}"
cached = redis_client.get(cache_key)

if cached:
    return json.loads(cached)

# Sinon, appeler l'Agent AI et cacher
response = call_agent_ai(chat_message)
redis_client.setex(cache_key, 3600, json.dumps(response))  # 1h TTL
return response
```

**Priorité** : 🟢 BASSE

---

### 9. Rate Limiting

**Fichier** : `backend/server.py`  
**Ajout** : Middleware de rate limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/chat")
@limiter.limit("10/minute")  # Max 10 requêtes par minute
async def chat(request: Request, chat_message: ChatMessage):
    # ...
```

**Priorité** : 🟢 BASSE

---

### 10. Authentification

**Fichier** : Nouveau fichier `backend/utils/auth.py`

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

# Dans server.py:
from backend.utils.auth import verify_token

@app.get("/api/admin/kpis", dependencies=[Depends(verify_token)])
async def get_admin_kpis():
    # Seulement accessible avec token valide
    pass
```

**Priorité** : 🟡 MOYENNE (pour la prod)

---

## 📋 Configuration Nécessaire

### Variables d'Environnement à Ajouter

Pour les TODOs ci-dessus, ajouter dans `app.yaml` :

```yaml
env:
  # Existant
  - name: AGENT_ENDPOINT_URL
    value: "https://..."
  - name: DATABRICKS_TOKEN
    value: "{{secrets/...}}"
  
  # À ajouter pour Databricks SQL
  - name: DATABRICKS_SERVER_HOSTNAME
    value: "your-workspace.cloud.databricks.com"
  - name: DATABRICKS_HTTP_PATH
    value: "/sql/1.0/warehouses/your-warehouse-id"
  
  # Optionnel: Redis pour caching
  - name: REDIS_HOST
    value: "your-redis-host"
  - name: REDIS_PORT
    value: "6379"
  
  # Optionnel: JWT pour auth
  - name: JWT_SECRET
    value: "{{secrets/sncf-travel-app/jwt-secret}}"
```

### Dépendances à Ajouter

Dans `backend/requirements.txt` :

```txt
# Existant
fastapi==0.109.0
uvicorn[standard]==0.27.0
httpx==0.26.0
pydantic==2.5.3

# À ajouter pour Databricks SQL
databricks-sql-connector==2.9.3

# Optionnel: Caching
redis==5.0.1

# Optionnel: Auth
pyjwt==2.8.0
python-jose[cryptography]==3.3.0

# Optionnel: Rate limiting
slowapi==0.1.9
```

---

## 🎯 Ordre d'Implémentation Recommandé

### Phase 1 : Core Features
1. ✅ Connexion Agent AI (TODO #1) - **PRIORITÉ MAX**
2. ✅ Récupération voyages (TODO #2)
3. ✅ Persister conversations (TODO #6)

### Phase 2 : Analytics
4. Calcul KPIs réels (TODO #3)
5. Graphiques depuis Delta (TODO #4)
6. Contexte conversationnel (TODO #7)

### Phase 3 : Production Ready
7. Authentification (TODO #10)
8. Analytics marketing (TODO #5)

### Phase 4 : Optimisations
9. Caching (TODO #8)
10. Rate limiting (TODO #9)

---

## 📚 Ressources

### Databricks SQL Connector
```python
# Documentation complète
# https://docs.databricks.com/dev-tools/python-sql-connector.html

# Exemple de connexion
from databricks import sql

with sql.connect(
    server_hostname=os.getenv("DATABRICKS_SERVER_HOSTNAME"),
    http_path=os.getenv("DATABRICKS_HTTP_PATH"),
    access_token=os.getenv("DATABRICKS_TOKEN")
) as connection:
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM table")
        result = cursor.fetchall()
```

### Model Serving API
```python
# Documentation
# https://docs.databricks.com/api/workspace/servingendpoints

# Exemple d'appel
import httpx

response = await httpx.post(
    "https://workspace.cloud.databricks.com/serving-endpoints/endpoint-name/invocations",
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    },
    json={
        "messages": [
            {"role": "user", "content": "message"}
        ]
    }
)
```

---

**Dernière mise à jour : 2026-01-21**
