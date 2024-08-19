from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from loadpersona import router as loadpersona_router
from changepersonainfo import router as changepersonainfo_router
from changeswitch import router as changeswitch_router
from identifychange import router as identifychange_router
from restorelocalstorage import router as restorelocalstorage_router
from changefavourite import router as changefavourite_router
from deletepersona import router as deletepersona_router

app = FastAPI()

# ����·��
app.include_router(loadpersona_router)
app.include_router(changepersonainfo_router)
app.include_router(changeswitch_router)
app.include_router(identifychange_router)
app.include_router(restorelocalstorage_router)
app.include_router(changefavourite_router)
app.include_router(deletepersona_router)

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