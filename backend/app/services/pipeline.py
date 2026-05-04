import sys
import os


from backend.app.core.pipeline_langraph import run_graph # your existing function

def run_pipeline(message: str):
    return run_graph(message)