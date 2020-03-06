import os
import json
from bson.objectid import ObjectId

from flask import Flask
from . import constants
from flask_cors import CORS, cross_origin

from .mongo import mongo
from app.docs import docs
from app.regex import regex


def insertRegex(app, mongo):
    with open(app.instance_path + "/regex.json") as data:
        regexList = json.loads(data.read())

        try:
            [regex.update({"_id": ObjectId(regex["_id"])})
                for regex in regexList]
        except:
            pass

        mongo.db.regex.insert_many(regexList)


def insertRegexType(app,mongo):
        with open(app.instance_path + "/regexType.json") as data:
            regexList = json.loads(data.read())
            mongo.db.regexType.insert_many(regexList)


def initializeDB(app, mongo):
    try:
        insertRegexType(app,mongo)
    except:
        pass
    
    try:
        insertRegex(app, mongo)
    except:
        pass

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

    mongo.init_app(app)

    # apply the blueprints to the app
    app.register_blueprint(docs.bp)
    app.register_blueprint(regex.bp)

    CORS(app)

    def before_first_request():
        initializeDB(app, mongo)
    app.before_first_request(before_first_request)

    return app
