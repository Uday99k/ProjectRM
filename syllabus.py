import sys
import os
from pathlib import Path
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Add the parent directory to sys.path to import app modules
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

from app.models.user import User
from app.models.syllabus import Syllabus  # Import Syllabus model to establish relationship
from app.database import Base, engine, SessionLocal
from app.config import get_settings

# Create password hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == "admin@admin.com").first()
        if existing_admin:
            print("Admin user already exists!")
            return

        # Create admin user
        admin = User(
            email="admin@admin.com",
            password_hash=pwd_context.hash("admin123"),
            full_name="System Admin",
            role="admin",
            is_approved=True,
            created_at=datetime.utcnow()
        )

        db.add(admin)
        db.commit()
        print("Admin user created successfully!")
        print("Email: admin@admin.com")
        print("Password: admin123")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()