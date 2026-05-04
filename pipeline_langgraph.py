from typing import TypedDict
from langgraph.graph import StateGraph, START, END

from tools import web_search, scrape_url
from agents import writer_chain, critic_chain


# ----------------------------
# 1. Shared State
# ----------------------------
class ResearchState(TypedDict):
    topic: str
    search_results: str
    scraped_content: str
    report: str
    feedback: str


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

# ----------------------------
# 3. Build Graph
# ----------------------------
graph = StateGraph(ResearchState)

graph.add_node("search", search_node)
graph.add_node("scrape", scrape_node)
graph.add_node("writer", writer_node)
graph.add_node("critic", critic_node)

graph.add_edge(START, "search")
graph.add_edge("search", "scrape")
graph.add_edge("scrape", "writer")
graph.add_edge("writer", "critic")
graph.add_edge("critic", END)

app = graph.compile()


# ----------------------------
# 4. Run Pipeline
# ----------------------------
if __name__ == "__main__":
    topic = input("\nEnter research topic: ")

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




