from typing import Any, Dict, Optional, Union

from felicity.apps.common.crud import CRUDBase
from felicity.core.security import get_password_hash  # noqa
from felicity.core.security import verify_password
from sqlalchemy.orm import Session

from .models import User
from .schemas import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.user_name == username).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            user_name=obj_in.user_name,
            hashed_password=get_password_hash(obj_in.password),
            first_name=obj_in.first_name,
            last_name=obj_in.last_name,
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if update_data["password"]:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        _user = self.get_by_email(db, email=email)
        if not _user:
            return None
        if not verify_password(password, _user.hashed_password):
            return None
        return _user

    def authenticate_by_username(
        self, db: Session, *, username: str, password: str
    ) -> Optional[User]:
        _user = self.get_by_username(db, username=username)
        if not _user:
            return None
        if not verify_password(password, _user.hashed_password):
            return None
        return _user

    def is_active(self, _user: User) -> bool:
        return _user.is_active

    def is_superuser(self, _user: User) -> bool:
        return _user.is_superuser


user = CRUDUser(User)
