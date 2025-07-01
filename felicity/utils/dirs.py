import logging
import os
from pathlib import Path

from felicity.core.dtz import timenow_dt
from felicity.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def delete_file(file_name: str) -> bool:
    file_path = Path(file_name)
    if file_path.is_file():
        file_path.unlink()
        return True
    # Also return true to allow deletion of image reference that no longer exists.
    return True


def resolve_media_dirs_for(target: str) -> tuple[str, str]:
    """
    Creates target date-based subdirectories under MEDIA_DIR if they don't exist.
    Returns:
        full_path (str): Absolute path to the created directory.
        relative_path (str): Path starting from MEDIA_FOLDER (e.g., 'uploads/2025/07/01/')
    """
    date_path = timenow_dt().strftime('%Y/%m/%d')
    relative_path = f"{target}/{date_path}/"
    full_path = Path(settings.MEDIA_DIR) / relative_path
    full_path.mkdir(parents=True, exist_ok=True)
    return str(full_path.resolve()), relative_path


def get_full_path_from_relative(relative_path: str) -> str:
    """
    Given a relative path like 'uploads/2025/07/01/',
    returns the full absolute path under MEDIA_DIR.
    """
    full_path = Path(settings.MEDIA_DIR) / relative_path
    return str(full_path.resolve())

def get_download_path(file_relative_path: str) -> str:
    """
    Given a relative path like 'uploads/2025/07/01/file.jpg',
    returns a download path starting with '<media_folder>/'.
    
    Example:
        input: 'uploads/2025/07/01/file.jpg'
        output: '<media_folder>/uploads/2025/07/01/file.jpg'
    """
    return f"{settings.MEDIA_FOLDER}/{file_relative_path.lstrip('/')}"

def create_dir(dir_name: str) -> None:
    path = Path(dir_name)
    if not path.is_dir():
        os.makedirs(dir_name, exist_ok=True)


def resolve_root_dirs() -> None:
    _dirs = [settings.MEDIA_DIR]
    for _dir in _dirs:
        create_dir(_dir)
