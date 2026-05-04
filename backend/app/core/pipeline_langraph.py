from typing import TypedDict
from langgraph.graph import StateGraph, START, END

from backend.app.tools.tools import web_search, scrape_url
from backend.app.agents.agents import writer_chain, critic_chain

from backend.app.config import llm

# ----------------------------
# 1. Shared State
# ----------------------------
class ResearchState(TypedDict):
    topic: str
    search_results: str
    scraped_content: str
    report: str
    feedback: str
class RouterState(TypedDict):
    topic: str
    route: str  # "chat" or "research"

# ----------------------------
# 2. Nodes
# ----------------------------

def search_node(state: ResearchState):
    print("\n[SEARCH NODE]")
    result = web_search.invoke(state["topic"])
    return {"search_results": result}


def scrape_node(state: ResearchState):
    print("\n[SCRAPE NODE]")
    result = scrape_url.invoke(state["search_results"])
    return {"scraped_content": result}


def writer_node(state: ResearchState):
    print("\n[WRITER NODE]")

    report = writer_chain.invoke({
        "topic": state["topic"],
        "research": state["search_results"] + "\n\n" + state["scraped_content"]
    })

    return {"report": report}


def critic_node(state: ResearchState):
    print("\n[CRITIC NODE]")

    feedback = critic_chain.invoke({
        "report": state["report"]
    })

    return {"feedback": feedback}

def router_node(state):
    topic = state["topic"]

    prompt = f"""
                    Classify the user input into ONE category:

                    - chat (casual conversation like hello, how are you)
                    - qa (simple factual question like what is python)
                    - research (deep topic requiring search/tools)
                    - math (mathematical expression)

                    User input: {topic}

                    Return only one word: chat, qa, research, or math
                    """

    result = llm.invoke(prompt).content.lower().strip()

    return {"route": result}


def chat_node(state):
    return {
        "report": f"I am your AI assistant. You said: {state['topic']}",
        "search_results": "",
        "scraped_content": "",
        "feedback": ""
    }

def math_node(state):
    try:
        return {"report": str(eval(state["topic"]))}
    except:
        return {"report": "Invalid math expression"}

# ----------------------------
# 3. Build Graph
# ----------------------------




class FullState(TypedDict):
    topic: str
    route: str
    search_results: str
    scraped_content: str
    report: str
    feedback: str

graph = StateGraph(FullState)
graph.add_node("router", router_node)
graph.add_node("chat", chat_node)
graph.add_node("search", search_node)
graph.add_node("scrape", scrape_node)
graph.add_node("writer", writer_node)
graph.add_node("critic", critic_node)
graph.add_node("math", math_node)
graph.add_edge(START, "router")
graph.add_conditional_edges(
    "router",
    lambda state: state["route"],
    {
        "chat": "chat",
        "qa": "chat",       
        "research": "search",
        "math": "math"
    }
)

graph.add_edge("chat", END)

graph.add_edge("search", "scrape")
graph.add_edge("scrape", "writer")
graph.add_edge("writer", "critic")
graph.add_edge("critic", END)
graph.add_edge("math", END)
app = graph.compile()

def run_graph(topic: str):
    result = app.invoke({
        "topic": topic,
        "search_results": "",
        "scraped_content": "",
        "report": "",
        "feedback": ""
    })

    return {
        "final_answer": result["report"],
        "steps": [
            {
                "node": "search",
                "output": result.get("search_results", "")
            },
            {
                "node": "scrape",
                "output": result.get("scraped_content", "")
            },
            {
                "node": "critic",
                "output": result.get("feedback", "")
            }
        ]
    }

# ----------------------------
# 4. Run Pipeline
# ----------------------------

    result = app.invoke({
        "topic": topic,
        "search_results": "",
        "scraped_content": "",
        "report": "",
        "feedback": ""
    })

    print("\n\n================ FINAL OUTPUT ================\n")
    print("REPORT:\n", result["report"])
    print("\nFEEDBACK:\n", result["feedback"])




