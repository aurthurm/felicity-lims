# FELICITY LIMS

![Screenshot1](https://user-images.githubusercontent.com/17094364/137630249-b84e5b1c-f525-4b0a-8d1e-1e2820910a5f.png)

A next generation open source laboratory information management system for clinical/medical laboratories.

## Descritpion
The Felicity LIMS project aims to create a Laboratory Information Management System (LIMS) that tracks the complete laboratory workflow providing all the functionalities of a Laboratory Information Management System. 

Felicity strives to promote an accurate flow of sample and associated experimental data to and through a laboratory to produce information that is used to make conclusions and critical decisions.

Felicity LIMS will ensure that sufficient metadata is captured and clinical laboratory personnel can track the lifecycle of a biospecimen in the laboratory from receipt to dispacth.

Felicity Backend is developed in Python using the FastAPI framework and strawberry GraphQL.
Felicity FrontEnd is developed in VueJs, URQL, and Tailwind CSS.

Felicity is the quality of being good, pleasant, or desirable.

## Main Features
 - Sample status tracking
 - Flexible batched sample workflow
 - Quality control
 - Reporting
 - Highly customizable and extensible
 - Micro kanban Project management
 - Experimental Markdown Document manager

## Installation

### Direct
#### Backend Installation 
##### using poetry
Fist install [Poetry](https://python-poetry.org/docs/#installation)
Then follow instructions below
```shell
git clone https://github.com/aurthurm/felicity.git
cd felicity
cd backend/felicity_lims
poetry install
bash felicity.sh &
````

##### using anaconda
Fist install [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
Then follow instructions below
```shell
conda create -n felicity python=3.9
conda activate felicity
git clone https://github.com/aurthurm/felicity.git
cd felicity
cd backend/felicity_lims
pip install -r requirements.txt
bash felicity.sh &
````

#### Frontend Installation 
Install [NodeJs](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)
Install [Yarn](https://yarnpkg.com/getting-started/install)
Then follow instructions below
```shell
cd felicity/frontent/vite
yarn install
# for production mode
yarn build
yarn start
# for development mode
yarn dev
````

### Docker
This method uses Docker and docker-compose which handles the details of installing dependencies for you. On your Linux command line, run:
```shell
git clone https://github.com/aurthurm/felicity.git
cd felicity
docker-compose up -d
```

## Contact
 - Email me directly at aurthurmusendame@gmail.com
 - Me on [facebook](https://www.fb.me/aurthur.musendame)
 - Me on [Linked In](https://www.linkedin.com/in/aurthurmusendame)
 - [Whatsapp Me](https://api.WhatsApp.com/send?phone=263776406399) or call on +263776406399
 - Me on [Telegram](https://www.t.me/aurthurm)
