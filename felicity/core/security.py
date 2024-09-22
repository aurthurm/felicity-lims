import logging
import re
from datetime import datetime, timedelta
from difflib import SequenceMatcher
from typing import Any, Union

from jose import jwt
from passlib.context import CryptContext

from felicity.core.config import get_settings

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


#  Passwords
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


#  JWTokens
def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    expire = expire.timestamp() * 1000  # convert to milliseconds
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_access_token_from_refresh(refresh: str) -> str | None:
    try:
        payload = jwt.decode(
            refresh, settings.REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
    except jwt.JWTError:
        return None

    return create_access_token(payload["sub"])


def create_refresh_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    if expires_delta:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(
            minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expires_delta.timestamp() * 1000, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.REFRESH_SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return decoded_token["sub"]
    except jwt.JWTError:
        return None


def password_similarity(username: str, password: str, max_similarity=0.7):
    """
    check is the similarity between the password and username
    ratio > max_similarity is similar
    ratio <= max_similarity is not similar
    """
    ratio = SequenceMatcher(None, username, password).ratio()
    return True if ratio > max_similarity else False, ratio


def format_password_message(old: str, new: str):
    if not old:
        return new
    return f"{old}, {new}"


def password_check(password, username):
    """
    Verify the strength of 'password'
    Returns a dict indicating the wrong criteria
    A password is considered strong if:
        8 characters length or more
        1 digit or more
        1 symbol or more
        1 uppercase letter or more
        1 lowercase letter or more
        not similar to username
    """

    # calculating the length
    length_error = len(password) < 8

    # searching for digits
    digit_error = re.search(r"\d", password) is None

    # searching for uppercase
    uppercase_error = re.search(r"[A-Z]", password) is None

    # searching for lowercase
    lowercase_error = re.search(r"[a-z]", password) is None

    # searching for symbols
    symbol_error = re.search(r"\W", password) is None

    # similarity error
    similar_error = password_similarity(username, password)[0]

    # overall result
    password_ok = not (
        length_error
        or digit_error
        or uppercase_error
        or lowercase_error
        or symbol_error
        or similar_error
    )
    message = ""
    if not password_ok:
        if length_error:
            message = format_password_message(
                message, "Password must not be less than 8 characters long "
            )
        if digit_error:
            message = format_password_message(
                message, "Password must contain at least a digit"
            )
        if uppercase_error:
            message = format_password_message(
                message, "Password must contain upper case letters"
            )
        if lowercase_error:
            message = format_password_message(
                message, "Password must contain lowercase letters"
            )
        if symbol_error:
            message = format_password_message(message, "Password must contain symbols")
        if similar_error:
            message = format_password_message(
                message, "Password is too similar to your username"
            )

    return {
        "password_ok": password_ok,
        "length_error": length_error,
        "digit_error": digit_error,
        "uppercase_error": uppercase_error,
        "lowercase_error": lowercase_error,
        "symbol_error": symbol_error,
        "similar_error": similar_error,
        "message": message,
    }
