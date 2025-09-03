# 🪄 MAGiF: Mulit-Agent Generative Formalization

(formerly GAMA)

A Python and Prolog-based simulator that enables users to create, simulate, and analyze strategic interactions using autoformalizing agents. The project supports game-theoric experiments and includes tools for validating autoformalized Prolog programs. Currently, it supports 2x2 simultaneous-move games, but its modular architecture allows for extensions to other types of games.

<p align="center">
  <img src="assets/gama.png" width="600">
</p>

## 📑 Table of Contents

- ✨ [Features](#-features)
- 🤖 [Agent Model](#-agent-model)
- 🚀 [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- ⚙️ [Experiment Configuration](#%EF%B8%8F-experiment-configuration)
- 🗂️ [Project Structure](#%EF%B8%8F-project-structure)
- 📚 [Examples](#-examples)
- 🛠️ [Built With](#%EF%B8%8F-built-with)
- 👥 [Authors](#-authors)

## ✨ Features

- **Autoformalization of Game Rules and Strategies**: Use agents to autoformalize game rules, strategies, or both using natural language descriptions as input.
- **Configurable Tournament Parameters**: Easily customize the number of agents, rounds, and target payoffs.
- **Results Logging**: Automatically log tournament results for analysis.
- **Modular Design**: Easily extendable and modifiable for other types of games.

## 🤖 Agent Model

<p align="center">
  <img src="assets/agent_model.png" width="400">
</p>

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.8 or higher
- `pip` (Python package installer)
- SWI-Prolog (for solving game strategies)
- Git (for cloning the repository)

To use GPT-4 used by default in the framework, the OpenAI API key has to be stored in an environment variable. To use an alternative LLM, an interface provided by [LLM class](magif/base_llm.py) has to be implemented. 

### Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/dicelab-rhul/GAMA.git
    cd GAMA
    ```

2. **Create a Virtual Environment**
    ```bash
    python3 -m venv magif-env
	source magif-env/bin/activate  # On Windows, use `magif-env\Scripts\activate`
    ```

3. **Install**
	Install in editable mode:
    ```bash
   	pip install -e .
    ```
    
    Alternatively, if you just want to install the runtime dependencies listed in requirements.txt:
    ```bash
   	pip install -r requirements.txt
    ```
    
4. **Install SWI-Prolog**:

   - [Download SWI-Prolog](https://www.swi-prolog.org/Download.html) and follow the installation [instructions](https://wwu-pi.github.io/tutorials/lectures/lsp/010_install_swi_prolog.html) for your operating system.    

### Tutorial

The tutorial is available [here](https://github.com/dicelab-rhul/GAMA/blob/main/tutorial/Tutorial.ipynb) and can be executed both locally and in Colab: 
[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/dicelab-rhul/GAMA/blob/main/tutorial/Tutorial.ipynb)

## ⚙️ Experiment Configuration

A sample configuration file is located at `unit_tests/CONFIG/test_config.ini`:

```ini
[Paths]
GAME_DIR = unit_tests/DATA/GAMES/
GAME_EXAMPLES_DIR = unit_tests/DATA/GAME_EXAMPLES/
STRATEGY_EXAMPLES_DIR = unit_tests/DATA/STRATEGY_EXAMPLES/
OUT_DIR = unit_tests/LOGS/
SOLVER_PATH = magif/solver/solver.pl
GAME_TEMPLATE_PATH = DATA/PROMPTS/game_prompt_template.txt
STRATEGY_TEMPLATE_PATH = DATA/PROMPTS/strategy_prompt_template.txt
FEEDBACK_TEMPLATE_PATH = DATA/PROMPTS/feedback_prompt_template.txt
STRATEGY_PATH = DATA/STRATEGIES/tit-for-tat.pl
STRATEGY_DESCRIPTION = DATA/STRATEGY_DESCRIPTIONS/default_move.txt
GAME_PATH = unit_tests/DATA/sample_game_rules.pl
AGENT_JSON = unit_tests/LOGS/agent_Jekuti.json

[Params]
num_agents = 2
num_rounds = 4
target_payoffs = 3;23
max_attempts = 5
```

Paths should be relative to the project's root directory.

## 🗂️ Project Structure

```bash
GAMA/
├── DATA/
├── LOGS/
├── experiments/
├── lms/
│   │── gpt4.py
│   └── claude.py/
├── magif/
│   ├── agent
│   │   ├── agent.py
│   │   ├── memory.py
│   │   └── mind.py
│   ├── autoformalizer
│   │   └── autoformalizer.py
│   ├── environment
│   │   ├── agent_pool.py
│   │   ├── environment.py
│   │   └── match_maker.py
│   ├── game
│   │   └── game.py
│   ├── solver
│   │   ├── solver.pl
│   │   └── solver.py
│   ├── utils
│   │   ├── base_lm.py
│   │   ├── data_object.py
│   │   ├── setup_logger.py
│   │   ├── utils.py
│   │   └── validator.py
├── LICENSE
├── pyproject.toml
├── README.md
├── setup.py
└── requirements.txt
```

## 📚 Examples
You can refer to [unit_tests](unit_tests) for examples. 
1. **Creating agents**
    ```bash
    python3 agent_creation_test.py
    ```
2. **Tournament**
    ```bash
    python3 tournament_test.py
    ```    

## 🛠️ Built With
- Python 🐍
- SWI-Prolog ⚙️
- OpenAI GPT 🤖
- Anthropic's Claude 🤖

## 👥 Authors

Agnieszka Mensfelt </br>
Kostas Stathis </br>
Vince Trencsenyi
