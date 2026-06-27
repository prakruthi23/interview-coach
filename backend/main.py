from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.questions import router as questions_router
from routers.evaluation import router as evaluation_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions_router)
app.include_router(evaluation_router)

@app.get("/health")
def health():
    return {"status": "ok"}