import os

from flask import Flask
from . import constants
from flask_cors import CORS, cross_origin


from app.docs import docs
from app.regex import regex



def home():
    return {"data": "Welcome to CodiEsp"}

def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""


    app = Flask(__name__, instance_relative_config=True) 
    app.config.from_mapping(
        # a default secret that should be overridden by instance config
        SECRET_KEY="secret key",
        # store the database in the instance folder
        MONGO_URI=constants.MONGO_URI
    )


    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.cfg", silent=False)
    else:
        # load the test config if passed in
        app.config.update(test_config)

    print(app.config["SECRET_KEY"])
    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass


    # register the database commands
    from .mongo import mongo

    mongo.init_app(app)

    # apply the blueprints to the app
    app.register_blueprint(docs.bp)
    app.register_blueprint(regex.bp)

    CORS(app)
    
    #Url rule, with this you don't have to define @app.route("/",...) before home function. it will go directly to the index function. 
    app.add_url_rule("/", view_func=home)

    return app


