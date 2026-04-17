from ...config import settings

# This acts as an adapter/wrapper around the user's specific "Hindsight SDK"
# For this prototype we simulate the Hindsight functionality or wrap the SDK if available

class HindsightMemoryClient:
    def __init__(self):
        # Initialize connecting to the Hindsight vector DB 
        self.api_key = settings.HINDSIGHT_API_KEY
        self.project_id = settings.HINDSIGHT_PROJECT_ID
        
        # e.g., self.client = HindsightSDK(api_key=self.api_key, project=self.project_id)
        self.memory_store = [] # Mock in-memory store for prototype
        print(f"Hindsight memory client initialized for project: {self.project_id}")

    async def store_memory(self, user_id: str, interaction: dict):
        """
        Store a conversation/interaction or trading decision in memory for future recall.
        interaction dict should contain keys like 'question', 'response', 'market_conditions', 'timestamp'
        """
        print(f"[Hindsight] Storing memory for {user_id}...")
        self.memory_store.append({
            "user_id": user_id,
            "data": interaction
        })
        return True

    async def retrieve_memory(self, user_id: str, query: str, limit: int = 3):
        """
        Retrieve relevant past context for a given query to inject into the LLM system prompt.
        """
        print(f"[Hindsight] Retrieving context for query: '{query}'")
        # In a real vector DB, we would do a cosine similarity search
        # Returning mock related past memory to demonstrate learning feature
        user_memories = [m for m in self.memory_store if m["user_id"] == user_id]
        if not user_memories:
            return "No previous interactions found."
            
        context_strs = []
        for i, mem in enumerate(user_memories[-limit:]):
            text = f"Interaction {i+1}: User asked '{mem['data'].get('question')}', Agent answered '{mem['data'].get('response')}'."
            context_strs.append(text)
            
        return "\n".join(context_strs)
