## 🚀 Getting Started
Make sure you have the following installed:

- Python 3.8 or higher
- `pip` (Python package installer)
- Git (for cloning the repository)

### Installation

1. **Clone the Repository**
    ```bash
    https://github.com/ahmadgee02/GAMA.git
    cd GAMA/user_interface/backend
    ```
2. **Install the Runtime Dependencies**
    ```bash
   	pip install -r requirements.txt
    ```
    
## ⚙️ Environment Variables (.env)

```ini
[Paths]
DATABASE_URL="your mongodb url"
SECRET_KEY="any secret key"
ACCESS_TOKEN_EXPIRE_MINUTES= "# minutes until token expires"
OPENAI_API_KEY="OPEN API KEY"
```

## 🗂️ Project Structure

```bash
backend/
├── logs/
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── IncontextExample.py
│   │   ├── prompt.py
│   │   └── user.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── chat.py
│   │   ├── incontextExample.py
│   │   ├── prompt.py
│   │   └── user.py
│   ├── schemas
│   │   ├── chat.py
│   │   ├── incontextExample.py
│   │   ├── prompt.py
│   │   └── user.py
│   ├── utils
│   │   ├── __init__.py
│   │   ├── jwt_bearer.py
│   │   ├── jwt_handler.py
│   │   └── socket_connection.py
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── logger.py
│   ├── main.py
│   ├── session_store.py
│   ├── setup.py
├── .env
├── .env.sample
├── .gitignore
└── requirements.txt
```/

