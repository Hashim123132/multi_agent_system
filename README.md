# Multi-Agent System

A student project exploring **multi-agent AI architectures** using LangGraph, FastAPI, and a modern React frontend. The system uses multiple specialized AI agents that collaborate to research topics, answer questions, solve math problems, and hold conversations.

---

## Architecture

```
User ──► Chat UI (React + Vite) ──► POST /chat (FastAPI) ──► LangGraph Pipeline
                                                                │
                     ┌──────────────────────────────────────────┼──────────────────────────┐
                     ▼                                          ▼                          ▼
              Router Agent                              Writer Agent              Critic Agent
         (classifies intent)                        (generates report)          (reviews quality)
                     │                                                                  │
                     ▼                                                                  ▼
         ┌───────┬───────┬───────┐                                              Return final
         ▼       ▼       ▼       ▼                                              answer + steps
      Chat    Search   Scrape   Math
     (casual) (Tavily) (BS4)   (eval)
```

### Agents & Flow

| Agent | Role |
|-------|------|
| **Router** | Classifies input as `chat`, `research`, or `math` |
| **Search** | Fetches web results via Tavily API |
| **Scrape** | Extracts clean text from URLs via BeautifulSoup |
| **Writer** | Produces structured reports (Intro, Findings, Conclusion, Sources) |
| **Critic** | Reviews the report, assigns a score, and suggests improvements |
| **Chat** | Handles casual conversation and Q&A |
| **Math** | Evaluates mathematical expressions |

---

## Project Structure

```
.
├── backend/
│   └── app/
│       ├── agents/              # LLM chains (writer, critic)
│       │   └── agents.py
│       ├── api/                 # FastAPI route definitions
│       │   └── routes.py
│       ├── core/                # LangGraph pipeline & state
│       │   └── pipeline_langraph.py
│       ├── services/            # Business logic layer
│       │   └── pipeline.py
│       ├── tools/               # Search & scrape tools
│       │   └── tools.py
│       ├── config.py            # LLM initialization (Mistral)
│       └── main.py              # FastAPI app entry point
├── Frontend/
│   ├── src/
│   │   ├── components/          # React components (Chat, Sidebar, Auth, UI)
│   │   ├── lib/                 # API client & Supabase integration
│   │   ├── pages/               # Route pages (Home, Login, Signup)
│   │   ├── App.tsx              # Root component with routing
│   │   └── main.tsx             # Entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── .env.example
├── pyproject.toml
├── requirements.txt
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Orchestration | LangGraph + LangChain |
| LLM | Mistral (`mistral-small-latest`) |
| Backend | FastAPI + Uvicorn |
| Web Search | Tavily API |
| Scraping | BeautifulSoup4 |
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Auth & DB | Supabase |
| Python | 3.10+ |

---

## Setup

### Prerequisites

- Python 3.10+
- Node.js
- UV (recommended) or pip

### Backend

```bash
# Create & activate virtual environment
uv venv
source .venv/bin/activate

# Install dependencies
uv pip install -r requirements.txt

# Copy env vars and fill in your API keys
cp .env.example .env

# Run the server
uvicorn backend.app.main:app --reload
```

### Frontend

```bash
cd Frontend

# Install dependencies
npm install

# Copy env vars and configure
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

Create `.env` (backend) and `Frontend/.env` (frontend) from the `.env.example` files.

| Variable | Required | Where |
|----------|----------|-------|
| `MISTRAL_API_KEY` | Yes | Backend `.env` |
| `TAVILY_API_KEY` | Yes | Backend `.env` |
| `VITE_API_URL` | Yes | Both `.env` files |
| `VITE_SUPABASE_URL` | Yes | Frontend `.env` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Frontend `.env` |

---

## API

**`POST /chat`**

Request:
```json
{ "message": "What are the latest developments in quantum computing?" }
```

Response:
```json
{
  "final_answer": "...generated report...",
  "steps": [
    { "node": "search",  "output": "..." },
    { "node": "scrape",  "output": "..." },
    { "node": "critic",  "output": "..." }
  ]
}
```

---

## License

MIT — for educational purposes.
