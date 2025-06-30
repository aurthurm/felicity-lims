import os
from pathlib import Path

from felicity.core.dtz import timenow_dt
from felicity.core.config import settings


def delete_file(file_name: str) -> bool:
    file_path = Path(file_name)
    if file_path.is_file():
        file_path.unlink()
        return True
    # Also return true to allow deletion of image reference that no longer exists.
    return True


def resolve_media_dirs_for(target: str) -> str:
    """
    Creates directories if not exist
    """
    str_path = settings.MEDIA_DIR + "/" + target + "/" + timenow_dt().strftime("%Y/%m/%d") + "/"
    path = Path(str_path)
    if not path.is_dir():
        os.makedirs(str_path, exist_ok=True)

    return str_path


def create_dir(dir_name: str) -> None:
    path = Path(dir_name)
    if not path.is_dir():
        os.makedirs(dir_name, exist_ok=True)


def resolve_root_dirs() -> None:
    _dirs = [settings.MEDIA_DIR]
    for _dir in _dirs:
        create_dir(_dir)
