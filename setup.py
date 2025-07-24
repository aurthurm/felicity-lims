from setuptools import setup, find_packages

__version__ = "0.2.0"


# Function to read requirements.txt
def parse_requirements(filename):
    with open(filename, 'r') as f:
        return f.read().splitlines()


# Read long description from README.md, with error handling
try:
    with open("README.md", "r") as fh:
        long_description = fh.read()
except FileNotFoundError:
    long_description = ""

setup(
    name="Felicity-LIMS",
    version=__version__,
    description="Felicity Laboratory Information Management System",
    long_description=long_description,
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
    extras_require={
        "dev": parse_requirements('requirements-dev.txt'),
    },
    entry_points={
        "console_scripts": [
            "felicity-lims=felicity.cli:main",
        ],
    },
)
