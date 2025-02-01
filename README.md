# file-research
FastAPI와 NextJS 구성에서 파일을 업로드하고, 간단한 분석 내용을 웹 페이지로 뿌리는 예제 구성

## Project Structure
```
file-research/
├── api/                # FastAPI backend
│   ├── main.py         # Entry point for FastAPI
│   ├── requirements.txt # Backend dependencies
│   ├── Dockerfile      # Dockerfile for FastAPI
├── components/         # Next.js components
├── pages/              # Next.js pages
├── public/             # Static files for Next.js
├── styles/             # CSS and styles
├── package.json        # Frontend dependencies
├── Dockerfile          # Dockerfile for Next.js
├── docker-compose.yml  # Docker Compose configuration
├── .env                # Environment variables
└── README.md           # Documentation
```

## Getting Started
- Docker
- Docker Compose
- Node.js & npm
- Python 3.10+

- Clone the Repository
```
git clone https://github.com/neltia/file-research
cd file-research
```

### Local Installation
- Backend (FastAPI)
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.index:app --host 0.0.0.0 --port 8000 --reload
```

- Frontend (Next.js)
```
cd ..  # Move to project root
npm install
npm run dev
```

### Run Application with Docker compose
- Environment Variables
```
NEXT_PUBLIC_API_URL=http://backend:8000
ENV=production
```

- docker-compose command
```
docker-compose up --build -d  # update
docker-compose down           # shutdown
```
