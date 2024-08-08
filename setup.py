# setup.py
from setuptools import setup, find_packages

__version__ = "0.0.1"


# Function to read requirements.txt
def parse_requirements(filename):
    with open(filename, 'r') as f:
        return f.read().splitlines()


setup(
    name="Felicity-LIMS",
    version=__version__,
    description="Felicity Laboratory Information Management System",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    license="MIT",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    keywords="Felicity LIMS, LIMS, Laboratory Information Management System, Sample Manager, BioBank",
    url="https://github.com/beak-insights/felicity-lims/",
    include_package_data=True,
    zip_safe=False,
    packages=find_packages(include=['felicity', 'felicity.*']),
    python_requires='>=3.11',
    install_requires=parse_requirements('requirements.txt'),
    # List additional groups of dependencies here (e.g. development
    # dependencies). You can install these using the following syntax,
    # for example:
    # $ pip install -e .[dev,test]
    extras_require={
        "dev": [
            "pytest==8.1.2",
            "pytest-asyncio==0.21",
            "pytest-order==1.2.1",
            "pytest-mock==3.14.0",
            "anyio[trio]==4.2.0",
            "faker==22.5.1",
            "bump-pydantic==0.8.0",
            "isort==5.13.2",
            "flake8==7.0.0",
            "mypy==1.11.1",
            "sqlalchemy-stubs==0.4",
            "aiosqlite==0.20.0"
        ]
    },
    entry_points={
        "console_scripts": [
            "felicity-lims=felicity.cli:main",
        ],
    },
)
