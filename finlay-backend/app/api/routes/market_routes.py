from fastapi import APIRouter, HTTPException
from ..tools.market_data import MarketDataTool, SentimentTool

router = APIRouter()

@router.get("/data/{symbol}")
async def get_market_data(symbol: str):
    """Secure backend proxy to fetch market data without frontend holding keys."""
    try:
        # In a real app we would validate user token here
        result = MarketDataTool.fetch_stock_data(symbol.upper())
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sentiment/{symbol}")
async def get_sentiment_data(symbol: str):
    """Secure backend proxy to fetch sentiment data."""
    try:
        result = SentimentTool.analyze_sentiment(symbol.upper())
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
