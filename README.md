# Interactive Text Annotation & Curation


## Introduction

In medical records 80% of data is plain text (pdf, txt, html, xml) and these texts are not structured which makes it hard to search important information (clinical cases). So if we have this information already extracted and structured it would save a lot of time when working with this data.

--------------------

## Directories
- __codiEsp__:

    The main directory of the project that contains two main sub directory __backend__ and __frontend__ . Also it contains other directory and files to install and/or run the project.
    <br/><br/>
    - __backend__:
    <br/>This directory contains all [Flask](https://flask.palletsprojects.com/en/1.1.x/) (Lightweight [web](https://wsgi.readthedocs.io/en/latest/) application framework) app and other programs to run the Application programming interface (API).
    <br/><br/>
    - __frontend__:<br/>
    This directory contains frontend project of [Angular](https://angular.io/) (Platform for building mobile and desktop web applications) project.
    
    ---------

### backend:
It contains app (main backend application directory) and other files/scripts or directory.

- **app/ (main backend application directory)**:<br/>
    This is the [Flask](https://flask.palletsprojects.com/en/1.1.x/) application directory. It has many sub directories and files:
    <br/><br/>
    - **\_\_init__**.py:<br/>
    This is to initialize the app. It Creates flask app and run all necessary function those are need to run before create app like saving admin user and other data into the DB. Also it defiens parent routes for API. 
    <br/><br/>
    - **\_\_main__.py**:<br/>
    This is the app's main function. This file call to the \_\_init__.py file to create the app and run it. Python can run it just by calling directory app.
        
        - EX:
        ```bash
        bash -> user@username:~$ python -m app

        ```
    <br/>

    - **constants.py**: <br/>
    This python file has some constants, those are called by other python files.
    <br/><br/>
    - **routes/**:<br/>
    This is directory that contains python sub directories with python files .
    Each sub directory has two python files, one for __routes__ and other for it's __controller__.    
        - **auth/**: <br/>
        This app's directory is to controll petitions of __authentication__, __login__, etc.
          - **auth.py**: <br/>
          Routes file for petttions of authentication.
          <br/><br/>
          - **controller.py**:<br/>
          A python controller file to controll petitions and retun data.        

        - **clinical_data/**: <br/>
        This app's directory is to controll petitions of __CRUD clinical cases__. 
          - **clinical_data.py**: <br/>
          Routes file for petttions of CRUD clinical_cases like get, post, put , delete, etc.
          - **controller.py**:<br/>
          A python controller file to controll petitions and retun data.      
  
        - **docs/**: <br/>
        This app's directory is to controll petitions of documents like get documents or get document, etc.
          
        - **docs.py**: <br/>
        Routes file for petttions for documents to provide documents list or a single document.
        
        - **controller.py**:<br/>
        A python controller file to controll petitions and retun data.        


- **regex/**: <br/>
This app's directory is to controll petitions of __CRUD regex__ like get, post, put, post, etc.
<br/>
    
  - **regex.py**: <br/>
  Routes file for petttions of CRUD regex like get, post, put , delete, etc..
  <br/><br/>
  - **controller.py**:<br/>
  A python controller file to controll petitions and retun data.

    - **utils/**:<br/>
    Directory that contains python file with functions that can be called from other python files.
    <br/>

        - **utils.py**:<br/>
        This file contains all functions as utlis those can be share and called from other files.
        <br/><br/>
        
    - **tests/**:<br/>
    A testing directory that contains python's pytest files. It has two pytest python files where it check all necessary function and petitions if they are correctly working.
        <br/><br/>
        
        - **test_utils.py**:<br/>
        This test file test all functions from utils.
        <br/><br/>
        
        - **test_utils.py**:<br/>
        This test file test the app, it's petitions, configuration and authorization of petitions sent from utils.
        <br/><br/>
        
     - **data/**:<br/>
     This directory contains othes files with data that is necessary for the application on running time.
     <br/>
         
         - **GeoLite2-City_20200211/**:<br/>
         This data directory contains a DATABASE file with extension .mmdb that contains ip adress and location.
         This file serves to get location by clients IP address.
    

    
- __docs_to_mongo.py__:<br/>
    This function serves add documents information to the mogodb, those we want to provide them. <br>It requeres some argument to run it:
    - -i  \[ /example/folder | folder/* \]<br/>
    Folder/s or files those we want to provide them 
    <br/><br/>
    - -f  \[ link, text, html, pdf \]<br/>
    Format of documents. If they links, plain text, html or pdf 
   
    -------------------
   
### frontend:

The frontend is made with angle, therefore it uses the general structure of the angle. The main important directory is app (frontend/src/app). This directory contains many sub directories like components, services, model, etc.
    
- **app**:<br/>

    - **components/**:<br/>
    This directory contains all components used by the app. Each component directory contains files with extension .ts(Type Script), .css(Cascading Style Sheet) and .html(Hypertext Markup Language).
    <br/>
    
    - **helper/**:<br/>
        - **auth.guard.ts**:<br/>
        This file serve to check if the use is permited to open a specific route(URI).
        <br/><br/>
        
    - **interfaces**:<br/>
    This directory contains all interfaces files used by the app.
    <br/>
    
    - **models**:<br/>
    This directory contains all models(classes) files used by the app.
    <br/>
    
    - **routes**:<br/>
    This directory contains routing file to controll routing of the application.
    <br/>

    - **directives**:<br/>
    This directory contains directives used by the application. A directive serves to control error of form while user inserts data.
    <br/>
    
    - **interceptors**:<br/>
    This directory contains interceptors used by the application. A interceptor serves to control a http petition before send it. Then it controll error or modify petition inserting it more data as body , headers, add JWT access token etc. 
    <br/>
    
    - **modules**:<br/>
    This directory contains modules to import angular child modules or other components, etc.
    <br/>
    
    - **pipes**:<br/>
    This directory contains pipes used by. A pipe serves change data by calling it and passing it data.
     <br/>
     
    - **services**:<br/>
    This deirectory contains different services used by app. A service serves to make http petition to an API.  
    <br/>
   
----------------------------------

### Main() function

- The main function of backend app is __run.py__ (codiEsp/backend/run.py)<br/>
  This function create app from the file __app/\_\_init.py__ and run it.


### How to compile the program?

- **Development Mode**:

  - **Run flask**:<br/>
  To run flask app you must be inside the directory backend/ after run following commands. You need python > 3.7,  pip installed adn mongoDB. You have to create a virtual-env and you can create your favorite virtual-env you like (conda, pyenv, virtualenv, etc).
      
      
```bash 
      # create virtual-env and install dependencies:

        user@user:~/project/backend$  python -m venv .env
        user@user:~/project/backend$  source .env/bin/activate
        (.env) user@user:~/project/backend$  pip install -r install requirements.txt

       # save documents information to the mongo db. 
       # Note: If you saved information of documents to the mongoDB, so you can't move these documents to any other place.
    
        (.env) user@user:~/project/backend$  python doc_to_mongo.py -i folder_name/ -f [html | pdf | html | text]
        
        # Now running the program run.py. But if you want to run with debug mode on then replace run.py with run_debug_mode.py:
        
         (.env) user@user:~/project/backend$ python run.py
        
        # Now your service must be running

```

  - **Run angular**:<br/>
  To run angular app you must be inside the directory frontend/ and after run following commands. You need [nodeJS](https://nodejs.org/es/download/) > 10 and  [Angular/cli 9](https://angular.io/guide/setup-local) installed.

```bash 
      # Install dependencies and run frontend:

        user@user:~/project/frontend$ npm install
        user@user:~/project/frontend$ ng serve -o
      
      #It will run frontend and open the main page of the web.

```



- **Production Mode**:
  To run it you need [docker-compose](https://docs.docker.com/compose/install/) installed. And you must be inside the project directory. If you don't want to use docker, you can also install it by local apache or nginx.
  
   - You must change url of your __mongDB URI__ and __volumes path__ of you documents, in file __project/docker-compose.yml__.
   
   - Must change apiUrl by your IP address in file project/frontend/environments/environment.prod.ts/
  
   - Commands to run (-d is opcional it will run your service as production):

```bash

    # With these following command the project must be running.

    user@user:~/project/$ docker-compose rm -f
    user@user:~/project/$ docker-compose rm --all
    user@user:~/project/$ docker-compose build
    user@user:~/project/$ docker-compose up [-d] # -d is opcional argument, it runs as production.

```

----------------------

### Python requierments

aniso8601==8.0.0

APScheduler==3.6.3

astroid==2.3.3

attrs==19.3.0

autopep8==1.5

backoff==1.10.0

bcrypt==3.1.7

bson==0.5.8

cachelib==0.1

certifi==2019.11.28

cffi==1.13.2

chardet==3.0.4

Click==7.0

Flask==1.1.1

Flask-Bcrypt==0.7.1

Flask-Cors==3.0.8

Flask-JWT-Extended==3.24.1

Flask-PyMongo==2.3.0

Flask-RESTful==0.3.8

Flask-Session==0.3.2

geoip2==3.0.0

idna==2.8

isort==4.3.21

itsdangerous==1.1.0

Jinja2==2.10.3

lazy-object-proxy==1.4.3

MarkupSafe==1.1.1

maxminddb==1.5.2

mccabe==0.6.1

mock==4.0.1

more-itertools==8.3.0

packaging==20.4

pkg-resources==0.0.0

pluggy==0.13.1

py==1.8.1

pycodestyle==2.5.0

pycparser==2.19

PyJWT==1.7.1

pylint==2.4.4

pymongo==3.10.0

pyparsing==2.4.7

pytest==5.4.2

python-dateutil==2.8.1

pytz==2019.3

relaxml==0.1.3

requests==2.22.0

simple-geoip==0.1.0

simplejson==3.17.0

six==1.13.0

three==0.8.0

tzlocal==2.0.0

urllib3==1.25.7

uWSGI==2.0.18

wcwidth==0.1.9

Werkzeug==0.16.0

wrapt==1.11.2
 
 
 
 
 
 
 
 
