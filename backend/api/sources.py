from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from core.database import get_db
from domain import models, schemas
from api.auth import get_current_user
import json
import io

router = APIRouter()

@router.post("/upload", response_model=schemas.Source)
async def upload_source(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Very basic parsing for MVP
    content = ""
    try:
        if file.filename.endswith(".csv") or file.filename.endswith(".txt"):
            content = (await file.read()).decode("utf-8")
        elif file.filename.endswith(".json"):
            data = json.loads(await file.read())
            content = json.dumps(data, indent=2)
        else:
             content = (await file.read()).decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse file: {str(e)}")

    db_source = models.Source(
        filename=file.filename,
        content_type=file.content_type if file.content_type else "application/octet-stream",
        content=content,
        owner_id=current_user.id
    )
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source

@router.get("/", response_model=list[schemas.Source])
def get_sources(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Source).filter(models.Source.owner_id == current_user.id).all()

@router.delete("/{source_id}")
def delete_source(source_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    source = db.query(models.Source).filter(models.Source.id == source_id, models.Source.owner_id == current_user.id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    db.delete(source)
    db.commit()
    return {"message": "Deleted successfully"}
