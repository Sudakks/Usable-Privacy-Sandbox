from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from loadpersona import router as loadpersona_router
from changepersonainfo import router as changepersonainfo_router
from changeswitch import router as changeswitch_router

app = FastAPI()

# ����·��
app.include_router(loadpersona_router)
app.include_router(changepersonainfo_router)
app.include_router(changeswitch_router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# class CheckContext(BaseModel):
#     context: str


# @app.post("/getContext")
# async def get_context(context: CheckContext):
#     pass

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)