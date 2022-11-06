# FELICITY LIMS (under active development)

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
 - Quality Control - LJ Charts etc
 - Reporting
 - Highly customizable and extensible
 - Customizable Role based permissions

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

### Loadtest
Start the application with gunicorn and experiment with various workers 
```shell
gunicorn --workers 4 --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker --reload felicity.main:flims
```
Experiment with various -c and --rps values
```shell
sudo npm install -g loadtest
loadtest --data '{"query": "query{clientAll{items{uid name code district{uid name email emailCc province{uid name code country{uid name}}}}}}"}' -c 4 --rps 500  http://localhost:8000/felicity-gql -T 'application/json'
loadtest --data '{"query": "query getAllSamples{sampleAll(pageSize:10 afterCursor:\"\" status:\"\" text:\"\" clientUid:0 sortBy:[\"uid\"]){totalCount pageInfo{hasNextPage hasPreviousPage endCursor startCursor __typename}items{uid analysisRequest{uid clientRequestId patient{uid firstName lastName clientPatientId gender dateOfBirth age ageDobEstimated consentSms __typename}client{uid name __typename}__typename}sampleType{uid name __typename}sampleId priority status analyses{uid name sortKey __typename}profiles{uid name __typename}rejectionReasons{uid reason __typename}__typename}__typename}}"}' -c 10 --rps 10000  http://localhost:8000/felicity-gql -T 'application/json'
```
The application seems to be very performant even without using a load balancer and caching.

## Other projects 
    - Felicity Docs - Built with Laboratory QMS in Mind but can be used anywhere for document management
    - Felicity Stocker - Medical Laboratory Inventory Management system
    - Felicity Request - Requests and Approvals (e-Requisitions)
    - Felicity Teams - Project Management Tool
    - Felicity Field - Survey Data Collection Tool, Forms ,Analytics etc
## Contact
 - [EMail](mailto:aurthurmusendame@gmail.com?subject=[GitHub]%20Felicity%20Lims%20Enquiry)
 - [Facebook](https://www.fb.me/aurthur.musendame)
 - [LinkedIn](https://www.linkedin.com/in/aurthurmusendame)
 - [Whatsapp](https://api.WhatsApp.com/send?phone=263776406399)
 - [Telegram](https://www.t.me/aurthurm)
