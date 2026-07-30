from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    
class SourceBase(BaseModel):
    filename: str
    content_type: str

class Source(SourceBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    role: str
    content: str

class ChatMessage(ChatMessageBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    title: str
    content: str

class Report(ReportBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
