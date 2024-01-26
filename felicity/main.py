"""Note:
    - The felicity app must be creaed first before importing other modules.
    - This is important to register felicity in sanic registry
"""
from felicity.lims import factory

description = """
Felicity LIMS API helps you do awesome stuff. 🚀

You will be able to:
...
"""

app_configs = {
    "title": "Felicity LIMS",
    'description': description
}

felicity = factory(app_configs)
