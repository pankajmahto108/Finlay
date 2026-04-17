import yfinance as yf

class MarketDataTool:
    @staticmethod
    def fetch_stock_data(symbol: str) -> dict:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            data = {
                "symbol": symbol,
                "current_price": info.get("currentPrice", "N/A"),
                "previous_close": info.get("previousClose", "N/A"),
                "volume": info.get("volume", "N/A"),
                "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh", "N/A"),
                "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow", "N/A")
            }
            return {"status": "success", "data": data}
        except Exception as e:
            return {"status": "error", "message": str(e)}

class SentimentTool:
    @staticmethod
    def analyze_sentiment(symbol: str) -> dict:
        # Mock sentiment analysis tool that would normally pull from News API
        return {
            "status": "success",
            "sentiment": "bullish",
            "score": 0.75,
            "summary": f"Recent news for {symbol} indicates strong product growth and higher earnings expectations."
        }
