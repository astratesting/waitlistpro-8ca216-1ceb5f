from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import api, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title='WaitlistPro API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'https://*.vercel.app'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router, prefix='/auth', tags=['auth'])
app.include_router(api.router, prefix='/api', tags=['waitlist'])


@app.get('/health')
def health_check():
    return {'status': 'ok', 'service': 'waitlistpro'}
