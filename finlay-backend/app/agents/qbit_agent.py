from ..services.groq_client import GroqService
from ..memory.hindsight_client import HindsightMemoryClient
from ..tools.market_data import MarketDataTool, SentimentTool
import json
import re

class QbitAgent:
    def __init__(self):
        self.llm = GroqService()
        self.memory = HindsightMemoryClient()
        self.system_prompt = """
You are Qbit, an advanced AI financial assistant integrated into Finlay.
Your responsibilities:
- Analyze stock market data using technical indicators and news sentiment
- Provide probability-based investment insights
- Learn from past user interactions using Hindsight memory
- Personalize recommendations
- Ask for confirmation before executing trades

Format your response as a JSON object containing:
- "response": The conversational reply to the user.
- "probability": A string representation of bullish/bearish probability (e.g. "75% bullish"). If not relevant, put "None".
- "reasoning": A brief explanation of how you arrived at this decision.
"""

    async def process_message(self, user_input: str, user_id: str) -> dict:
        print(f"[Qbit] Processing message from {user_id}: {user_input}")
        
        # 1. Retrieve past memory (Hindsight)
        past_context = await self.memory.retrieve_memory(user_id, user_input)
        
        # 2. Extract potential stock symbols (simple regex for prototype)
        symbols = re.findall(r'[A-Z]{2,5}', user_input.upper())
        market_context = ""
        
        # 3. Fetch market data (tools)
        if symbols:
            # Take the first symbol found
            symbol = symbols[0]
            market_data = MarketDataTool.fetch_stock_data(symbol)
            sentiment_data = SentimentTool.analyze_sentiment(symbol)
            
            market_context = f"\nCurrent Market Data for {symbol}: {market_data}"
            market_context += f"\nSentiment Data for {symbol}: {sentiment_data}"

        full_context = f"Hindsight Memory:\n{past_context}\n\n{market_context}"
        
        # 4. Analyze (LLM Reasoning)
        raw_response = await self.llm.generate_response(self.system_prompt, user_input, full_context)
        
        # Parse the JSON response
        try:
            # sometimes LLM wraps JSON in ```json blocks
            clean_json = raw_response.strip()
            if "```json" in clean_json:
                clean_json = clean_json.split("```json")[1].split("```")[0].strip()
            elif "```" in clean_json:
                clean_json = clean_json.split("```")[1].strip()
                
            parsed_data = json.loads(clean_json)
        except Exception as e:
            # Fallback if the LLM output was not valid JSON
            parsed_data = {
                "response": raw_response,
                "probability": "Analysis failed",
                "reasoning": "Could not parse Qbit's internal reasoning."
            }
            
        # 5. Store memory
        await self.memory.store_memory(user_id, {
            "question": user_input,
            "response": parsed_data["response"],
            "market_conditions": market_context
        })

        return parsed_data
