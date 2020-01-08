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
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from pymongo.errors import BulkWriteError, DuplicateKeyError
from apscheduler.schedulers.background import BackgroundScheduler
from werkzeug.exceptions import BadRequest


import constants, documents


app = Flask(__name__)

# Put mongo uri into the app. config
app.config["MONGO_URI"] = constants.MONGO_URI
app.config["SECRET_KEY"] = constants.secret_key
mongo = PyMongo(app)  # Creating mongo from PyMongo by app.

# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)
cors = CORS(app)


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
    return (type in constants.PATHS_TO_DIR.keys()) 


@app.route("/documents/<data_type>/", methods=["GET"])
@app.route("/documents/<data_type>", methods=["GET"])
def get_documents(data_type):
    data_type = data_type.strip()
    
    if not (check_data_type(data_type)):
        abort(404)
        
    page, per_page = get_valid_pagination_args(request.args)
    data = documents.get_data_list(data_type, page, per_page)
    print("------------------------------------------")
    print(data)
    return jsonify(data)


@app.route("/documents/<data_type>/<name>", methods=["GET"])
def get_document(data_type,name):
    data_type = data_type.strip()
    file_name = name.strip()
    directory_path = constants.PATHS_TO_DIR.get(data_type)

    if directory_path:
        file_path = safe_join(directory_path, file_name)
        if os.path.isfile(file_path):
            return send_file(file_path)

    abort(404)

@app.route("/documents/<data_type>/<name>/save", methods=["POST"])
def save_data(data_type,name):
    data_type = data_type.strip()
    file_name = name.strip()
    directory_path = constants.PATHS_TO_DIR.get(data_type)
    
    doc_id = request.json.get("id")
    time = request.json.get("time")
    clinicl_case = request.json["clinical_case"]
	meta_data = request.json["meta_data"]

    data_to_save = dict({"clinicl_case":clinicl_case, "meta_data",meta_data})
    
    if doc_id:
        data_to_save.update({"_id":doc_id})
    
    if time:
        data_to_save.update({"time":time)

 

    if data_type == constants.TYPE_LINK:
        result = mongo.db.clinical_cases.save({"_id":"testing"})
    elif data_type in constants.PATHS_TO_DIR.keys():
        result = mongo.db.clinical_cases.save({"_id":"t111115", "name":"1223"})

    print(result)
    # print(doc_id)
    return "ok"


@app.route("/")
@cross_origin()
def home():
    return {"data":"Welcome to codiEsp"}


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
