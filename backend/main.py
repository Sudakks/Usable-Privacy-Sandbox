from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from loadpersona import router as loadpersona_router

app = FastAPI()

# 添加路由
app.include_router(loadpersona_router)

# 允许来自任意来源的请求（仅用于开发环境，生产环境应限制来源）
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
