from datetime import datetime
from distutils import dir_util
from pathlib import Path


def deleteFile(file_name: str) -> bool:
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
    str_path = "media/" + target + "/" + datetime.now().strftime("%Y/%m/%d") + "/"
    path = Path(str_path)
    if not path.is_dir():
        dir_util.mkpath(str_path)

    return str_path


def create_dir(dir_name: str):
    path = Path(dir_name)
    if not path.is_dir():
        dir_util.mkpath(dir_name)


def resolve_root_dirs():
    _dirs = ["media"]
    for _dir in _dirs:
        create_dir(_dir)
