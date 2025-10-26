# -*- coding: utf-8 -*-

import os
import sys


def is_linux():
    return sys.platform == 'linux' or sys.platform.startswith('linux') or os.name == 'posix'


def is_windows():
    return sys.platform == 'win32' or sys.platform.startswith('win') or os.name == 'nt'
