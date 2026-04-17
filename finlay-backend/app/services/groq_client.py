from ...config import settings

try:
    from groq import AsyncGroq
except ImportError:
    AsyncGroq = None


class GroqService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        
        if AsyncGroq and self.api_key and self.api_key != "your_groq_api_key_here":
            self.client = AsyncGroq(api_key=self.api_key)
        else:
            self.client = None

    async def generate_response(self, system_prompt: str, user_prompt: str, context: str = "") -> str:
        prompt = user_prompt
        if context:
            prompt = f"Context from past memory:\n{context}\n\nUser Question:\n{prompt}"
            
        if not self.client:
            # Mock mode if no groq client/key
            return "This is a mock response from Qbit. (Groq API Key missing or not configured)."

        try:
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            return f"Error communicating with AI model: {e}"
