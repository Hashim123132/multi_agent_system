import os
from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_mistralai import ChatMistralAI

from backend.app.tools.tools import web_search, scrape_url

load_dotenv()


# ------------------------
# LLM
# ------------------------
llm = ChatMistralAI(
    model="mistral-small-latest",
    temperature=0,
    api_key=os.getenv("MISTRAL_API_KEY")
)
print("MODEL BEING USED:", llm.model)

# ------------------------
# Writer Chain
# ------------------------
writer_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert research writer. Write clear, structured and insightful reports."),
    ("human", """
Write a detailed research report on the topic below.

Topic: {topic}

Research Gathered:
{research}

Structure:
- Introduction
- Key Findings (minimum 3)
- Conclusion
- Sources

Be factual and professional.
"""),
])

writer_chain = writer_prompt | llm | StrOutputParser()


# ------------------------
# Critic Chain
# ------------------------
critic_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a sharp and constructive research critic. Be honest and specific."),
    ("human", """
Review the report strictly.

Report:
{report}

Format:

Score: X/10

Strengths:
- ...

Areas to Improve:
- ...

One line verdict:
...
"""),
])

critic_chain = critic_prompt | llm | StrOutputParser()


# ------------------------
# Tools (direct use, no agents)
# ------------------------
def search_tool(query: str) -> str:
    return web_search.invoke(query)


def scrape_tool(url: str) -> str:
    return scrape_url.invoke(url)