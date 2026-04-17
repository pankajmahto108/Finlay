import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api.routes import chat_routes, trade_routes, market_routes
from .agents.qbit_agent import QbitAgent

# Validate config at startup
settings.validate()

app = FastAPI(title="Finlay Backend API", version="1.0.0")

# CORS middleware — uses origins from .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat_routes.router, prefix="/api/chat", tags=["Chat"])
app.include_router(trade_routes.router, prefix="/api/trade", tags=["Trade"])
app.include_router(market_routes.router, prefix="/api/market", tags=["Market"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Finlay Core Backend", "status": "ok"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "env": settings.APP_ENV}

# Global websocket agent instance (for demo)
qbit = QbitAgent()

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    # In a real app we'd get a user_id from token
    user_id = "demo_user_01"
    try:
        while True:
            data = await websocket.receive_text()
            response = await qbit.process_message(data, user_id)
            await websocket.send_json(response)
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=not settings.is_production(),
    )
