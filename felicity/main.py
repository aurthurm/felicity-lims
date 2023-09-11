"""Note:
    - The felicity app must be creaed first before importing other modules.
    - This is important to register felicity in sanic registry
"""
from sanic import Sanic

felicity = Sanic("felicity-lims")
from lims import register_felicity

register_felicity(felicity)
