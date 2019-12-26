#!/usr/bin/env python
# encoding: utf-8

"""
Flask + MongoDB - User Registration and Login - Explainer Video
https://www.youtube.com/watch?v=3DMMPA3uxBo
"""

from datetime import datetime, timedelta
from bson.objectid import ObjectId
import os, time

from flask import Flask, jsonify, request, send_file, session, send_from_directory, safe_join, abort
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from pymongo.errors import BulkWriteError, DuplicateKeyError
from apscheduler.schedulers.background import BackgroundScheduler
from werkzeug.exceptions import BadRequest


import Constants
import Documents


app = Flask(__name__)

# Put mongo uri into the app. config
app.config["MONGO_URI"] = Constants.MONGO_URI
app.config["SECRET_KEY"] = "secret"
mongo = PyMongo(app)  # Creating mongo from PyMongo by app.

# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)
CORS(app)



def get_valid_pagination_args(args:dict):
    
    try:
        page = args.get("page")
        per_page = args.get("perPage")

        try:
            page = abs(int(page))
            if page == 0:
                page = 1
        except:
            page = 1

        try:
            per_page = abs(int(per_page))
        except:
            per_page = 10
    except AttributeError as e:
        print(e) ####################################Logging
        page = 1
        per_page = 10

    return page, per_page

def check_data_type(type):
    return (type in Constants.PATHS_TO_DIR.keys()) 

  
@app.route("/docs/<data_type>/", methods=["GET"])
@app.route("/docs/<data_type>", methods=["GET"])
def get_documents(data_type):
    data_type = data_type.strip()
    
    if not (check_data_type(data_type)):
        abort(404)
        
    page, per_page = get_valid_pagination_args(request.args)
    
    data = Documents.get_data_list(data_type, page, per_page)
    return jsonify(data)


@app.route("/docs/<data_type>/<name>", methods=["GET"])
def get_document(data_type,name):
    data_type = data_type.strip()
    name = name.strip()
    

    
@app.route("/")
def home():
    return "<h1>Welcome to codiEsp<h1>"


# @app.before_request
# def setSession():
#     if not session.get("logged_in"):
#         session["logged_in"] = True
#         session.permanent = True
#         app.permanent_session_lifetime = timedelta(seconds=1)


if __name__ == "__main__":
    # scheduler = BackgroundScheduler()
    # scheduler.add_job(func=function, trigger="interval", days=5)
    # scheduler.start()
    app.run(host="127.0.0.1", port=5000, debug=True)
