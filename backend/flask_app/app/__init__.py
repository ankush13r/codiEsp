import os
import json
from bson.objectid import ObjectId

from flask import Flask, session
from app import constants
from flask_cors import CORS, cross_origin
from datetime import timedelta
from app.jwt import jwtManager


from app.mongo import mongo
from app.docs import docs
from app.regex import regex
from app.users import users
from app.clinical_data import clinical_data


def insert_regex(app, mongo):
    try:
        with open(app.instance_path + "/regex.json") as data:
            regexList = json.loads(data.read())

            for regex in regexList:
                if not mongo.db.regex.find_one({"value": regex["value"]}):
                    mongo.db.regex.insert(regex)

        return True
    except Exception as err:
        print("Error - Inserting regex: " + str(err))
        return False


def insert_regex_type(app, mongo):
    try:
        with open(app.instance_path + "/regexType.json") as data:
            regex_types = json.loads(data.read())
            for regex_type in regex_types:
                if not mongo.db.regexType.find_one({"_id": regex_type["_id"]}):
                    mongo.db.regexType.insert(regex_type)
        return True
    except Exception as err:
        print("Error - Inserting regex types:" + str(err))
        return False


def insert_users(app, mongo):
    try:
        with open(app.instance_path + "/users.json") as data:
            users = json.loads(data.read())

            for user in users:
                if not mongo.db.users.find_one({"email": user["email"]}):
                    mongo.db.users.insert(user)

        return True

    except Exception as err:
        print("Error - Inserting users: " + str(err))
        return False


def initializeDB(app, mongo):
    insert_regex_type(app, mongo)
    insert_regex(app, mongo)
    insert_users(app, mongo)


def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""

    app = Flask(__name__, instance_relative_config=True,
                subdomain_matching=True, root_path="/api")

    if not test_config:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.cfg", silent=False)
    else:
        # load the test config if passed in
        app.config.update(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # register the database commands
    mongo.init_app(app)
    jwtManager.init_app(app)


    # apply the blueprints to the app
    app.register_blueprint(docs.bp, url_prefix="/docs")
    app.register_blueprint(regex.bp, url_prefix="/regex")
    app.register_blueprint(clinical_data.bp, url_prefix="/clinical_cases")
    app.register_blueprint(users.bp, url_prefix="/auth")

    initializeDB(app, mongo)

    return app
