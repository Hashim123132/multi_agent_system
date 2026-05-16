# Multi Agent System Setup

## Install UV (one time)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
Project Setup

Go to project:

cd /media/DATA/GENERATIVEAI/multi_agent_system

Create venv:

uv venv

Activate venv:

source .venv/bin/activate

Install dependencies:

uv pip install -r requirements.txt
uv pip install fastapi uvicorn
Run Backend

From project root:

cd /media/DATA/GENERATIVEAI/multi_agent_system
source .venv/bin/activate

uvicorn backend.app.main:app --reload
Run Frontend

Open new terminal:

cd /media/DATA/GENERATIVEAI/multi_agent_system/Frontend

npm install
npm run dev
If venv breaks after moving project

Delete old venv and recreate:

rm -rf .venv

uv venv
source .venv/bin/activate

uv pip install -r requirements.txt