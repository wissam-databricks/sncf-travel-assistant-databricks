"""
Backend FastAPI pour l'application SNCF Travel Assistant
Sert les endpoints API et le frontend Next.js buildé
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import httpx

# Configuration depuis les variables d'environnement
AGENT_ENDPOINT_URL = os.getenv("AGENT_ENDPOINT_URL", "")
DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN", "")
WORKSPACE_URL = os.getenv("WORKSPACE_URL", "")

app = FastAPI(
    title="SNCF Travel Assistant API",
    description="API backend pour le chatbot voyageur SNCF et dashboard admin",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les origines exactes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Modèles Pydantic ====================

class ChatMessage(BaseModel):
    message: str
    conversation_id: str | None = None
    user_id: str | None = None
    context: Dict[str, Any] | None = None  # Contexte additionnel (train, station, etc.)

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str

# ==================== Endpoints API ====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agent_configured": bool(AGENT_ENDPOINT_URL)
    }

@app.post("/api/chat")
async def chat(chat_message: ChatMessage) -> ChatResponse:
    """
    Endpoint pour le chatbot voyageur
    Envoie le message à l'Agent AI Databricks et retourne la réponse
    """
    conversation_id = chat_message.conversation_id or f"conv-{datetime.now().timestamp()}"
    
    # Vérifier si l'agent est configuré
    if not AGENT_ENDPOINT_URL or not DATABRICKS_TOKEN:
        print("⚠️ Agent non configuré - mode fallback")
        return ChatResponse(
            response="⚠️ L'agent AI n'est pas encore configuré. Veuillez configurer AGENT_ENDPOINT_URL et DATABRICKS_TOKEN.",
            conversation_id=conversation_id,
            timestamp=datetime.now().isoformat()
        )
    
    try:
        # Préparer le contexte pour l'agent
        context_info = ""
        if chat_message.context:
            context_info = f"\n\nContexte du voyage:\n"
            if "train_number" in chat_message.context:
                context_info += f"- Train: {chat_message.context['train_number']}\n"
            if "departure_station" in chat_message.context:
                context_info += f"- Gare de départ: {chat_message.context['departure_station']}\n"
            if "departure_time" in chat_message.context:
                context_info += f"- Heure de départ: {chat_message.context['departure_time']}\n"
        
        # Préparer le prompt complet
        full_prompt = f"""Tu es un assistant de voyage SNCF. Aide l'utilisateur avec sa demande de manière claire, concise et utile.
{context_info}
Question: {chat_message.message}"""
        
        # Appeler l'agent Databricks
        print(f"🤖 Calling Databricks Agent...")
        print(f"📍 Endpoint: {AGENT_ENDPOINT_URL}")
        print(f"📝 Message: {chat_message.message[:100]}...")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {
                "Authorization": f"Bearer {DATABRICKS_TOKEN}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "messages": [
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ]
            }
            
            response = await client.post(
                AGENT_ENDPOINT_URL,
                headers=headers,
                json=payload
            )
            
            response.raise_for_status()
            agent_data = response.json()
            
            # Extraire la réponse selon le format de l'agent
            if "choices" in agent_data and len(agent_data["choices"]) > 0:
                # Format OpenAI/Agent compatible
                agent_response = agent_data["choices"][0]["message"]["content"]
            elif "predictions" in agent_data:
                # Format Databricks Model Serving
                agent_response = agent_data["predictions"][0]
            elif "response" in agent_data:
                # Format direct
                agent_response = agent_data["response"]
            else:
                # Fallback
                agent_response = str(agent_data)
            
            print(f"✅ Agent response: {len(agent_response)} chars")
            
            return ChatResponse(
                response=agent_response,
                conversation_id=conversation_id,
                timestamp=datetime.now().isoformat()
            )
            
    except httpx.TimeoutException:
        print("⏱️ Timeout calling agent")
        raise HTTPException(
            status_code=504,
            detail="L'agent AI a mis trop de temps à répondre. Veuillez réessayer."
        )
    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP error: {e.response.status_code}")
        print(f"Response: {e.response.text}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Erreur de l'agent AI: {e.response.text}"
        )
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'appel à l'agent: {str(e)}"
        )

@app.get("/api/trips")
async def get_trips():
    """
    Récupère les informations du prochain voyage de l'utilisateur
    """
    # TODO: Récupérer depuis une base de données ou API SNCF réelle
    
    # Données mock
    next_departure = datetime.now() + timedelta(hours=2, minutes=15)
    
    return {
        "next_trip": {
            "train_number": "TGV 6623",
            "departure_station": "Paris Montparnasse",
            "arrival_station": "Bordeaux Saint-Jean",
            "departure_time": next_departure.isoformat(),
            "arrival_time": (next_departure + timedelta(hours=3, minutes=10)).isoformat(),
            "platform": "12",
            "status": "on_time",
            "delay_minutes": 0,
            "seat": "12A",
            "car": "8"
        },
        "upcoming_trips": [
            {
                "train_number": "TGV 8542",
                "departure_station": "Bordeaux Saint-Jean",
                "arrival_station": "Paris Montparnasse",
                "departure_time": (next_departure + timedelta(days=3)).isoformat(),
                "status": "scheduled"
            }
        ]
    }

@app.get("/api/admin/kpis")
async def get_admin_kpis():
    """
    Endpoint pour les KPI du dashboard administrateur
    """
    # TODO: Calculer depuis les vraies données (Delta tables, Databricks SQL)
    # Exemple de requête :
    # SELECT COUNT(*) as total_conversations FROM catalog.schema.conversations_table
    
    # Données mock
    return {
        "total_conversations": 12847,
        "total_conversations_change": 15.3,  # % de changement
        "taxi_conversion_rate": 23.4,
        "taxi_conversion_change": 5.2,
        "avg_response_time": 1.2,  # en secondes
        "avg_response_time_change": -8.5,
        "user_satisfaction": 4.6,  # sur 5
        "user_satisfaction_change": 12.1,
        "active_users_today": 3421,
        "peak_usage_hour": "18:00",
        "most_requested_route": "Paris - Lyon"
    }

@app.get("/api/admin/charts")
async def get_admin_charts():
    """
    Endpoint pour les données des graphiques du dashboard
    """
    # TODO: Récupérer depuis Delta tables avec agrégations temporelles
    
    # Données mock pour les graphiques
    now = datetime.now()
    
    # Données d'utilisation sur 7 jours
    usage_data = []
    for i in range(7):
        date = now - timedelta(days=6-i)
        usage_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "conversations": 1500 + (i * 200) + (i % 2 * 300),
            "unique_users": 800 + (i * 100),
            "taxi_bookings": 250 + (i * 30)
        })
    
    # Distribution des types de requêtes
    request_distribution = [
        {"type": "Horaires de train", "count": 4521, "percentage": 35.2},
        {"type": "Réservation taxi", "count": 3012, "percentage": 23.4},
        {"type": "Retards/Incidents", "count": 2847, "percentage": 22.1},
        {"type": "Informations voyage", "count": 1562, "percentage": 12.2},
        {"type": "Autres", "count": 905, "percentage": 7.1}
    ]
    
    # Données horaires (24h)
    hourly_data = []
    for hour in range(24):
        hourly_data.append({
            "hour": f"{hour:02d}:00",
            "requests": 100 + (300 if 6 <= hour <= 22 else 0) + (hour % 3 * 50)
        })
    
    return {
        "usage_over_time": usage_data,
        "request_distribution": request_distribution,
        "hourly_requests": hourly_data,
        "response_times": {
            "p50": 0.8,
            "p95": 2.1,
            "p99": 4.5
        }
    }

@app.get("/api/analytics")
async def get_analytics():
    """
    Endpoint pour les analytics marketing
    """
    # TODO: Calculer depuis les tables analytics
    
    return {
        "conversion_funnel": [
            {"step": "App Open", "users": 10000, "percentage": 100},
            {"step": "Chat Started", "users": 7500, "percentage": 75},
            {"step": "Query Resolved", "users": 6800, "percentage": 68},
            {"step": "Service Booked", "users": 2340, "percentage": 23.4}
        ],
        "top_routes": [
            {"route": "Paris - Lyon", "bookings": 1245},
            {"route": "Paris - Marseille", "bookings": 987},
            {"route": "Paris - Bordeaux", "bookings": 856},
            {"route": "Lyon - Marseille", "bookings": 654},
            {"route": "Paris - Toulouse", "bookings": 543}
        ],
        "user_segments": [
            {"segment": "Voyageurs fréquents", "count": 3421, "percentage": 34.2},
            {"segment": "Occasionnels", "count": 4532, "percentage": 45.3},
            {"segment": "Nouveaux", "count": 2047, "percentage": 20.5}
        ]
    }

# ==================== Servir le Frontend ====================

# Chercher le dossier frontend/out dans plusieurs emplacements possibles
def find_frontend_build_path():
    """Trouver le chemin du build frontend"""
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "..", "frontend", "out"),  # Développement local
        os.path.join(os.getcwd(), "frontend", "out"),  # Databricks Apps
        os.path.join("/Workspace", "frontend", "out"),  # Databricks Workspace
        "./frontend/out",  # Chemin relatif
    ]
    
    for path in possible_paths:
        abs_path = os.path.abspath(path)
        print(f"Checking frontend path: {abs_path}")
        if os.path.exists(abs_path):
            print(f"✓ Frontend found at: {abs_path}")
            return abs_path
    
    print("✗ Frontend build not found in any location")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Script directory: {os.path.dirname(__file__)}")
    return None

frontend_build_path = find_frontend_build_path()

if frontend_build_path and os.path.exists(frontend_build_path):
    # Si Next.js est exporté en static (next export ou output: 'export')
    print(f"Mounting static files from: {frontend_build_path}")
    
    # Monter les assets _next
    next_path = os.path.join(frontend_build_path, "_next")
    if os.path.exists(next_path):
        app.mount("/_next", StaticFiles(directory=next_path), name="next_static")
        print(f"✓ Mounted /_next from {next_path}")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Servir le frontend Next.js statique"""
        # Ne pas intercepter les routes API
        if full_path.startswith("api/") or full_path == "docs" or full_path == "openapi.json":
            raise HTTPException(status_code=404)
        
        # Essayer de servir le fichier demandé
        file_path = os.path.join(frontend_build_path, full_path)
        
        # Si c'est un fichier qui existe, le servir
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Sinon, essayer avec .html
        html_path = os.path.join(frontend_build_path, full_path + ".html")
        if os.path.isfile(html_path):
            return FileResponse(html_path)
        
        # Pour les routes vides ou racine
        if not full_path or full_path == "/":
            index_path = os.path.join(frontend_build_path, "index.html")
            if os.path.isfile(index_path):
                return FileResponse(index_path)
        
        # Par défaut, servir index.html (pour le routing SPA)
        index_path = os.path.join(frontend_build_path, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        
        raise HTTPException(status_code=404, detail="Page not found")
else:
    print("⚠️  Frontend not available - API only mode")
    
    @app.get("/")
    async def root():
        return {
            "message": "SNCF Travel Assistant API",
            "status": "running",
            "docs": "/docs",
            "frontend_status": "not_built",
            "note": "Frontend build not found. The API is running in API-only mode.",
            "cwd": os.getcwd(),
            "script_dir": os.path.dirname(__file__)
        }

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"Starting SNCF Travel Assistant API on {host}:{port}")
    print(f"Agent endpoint configured: {bool(AGENT_ENDPOINT_URL)}")
    print(f"Documentation available at: http://{host}:{port}/docs")
    
    uvicorn.run(
        "server:app",
        host=host,
        port=port,
        reload=False,  # Désactiver en production
        log_level="info"
    )
