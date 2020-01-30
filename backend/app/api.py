#!/usr/bin/env python
# encoding: utf-8

"""
Flask + MongoDB - User Registration and Login - Explainer Video
https://www.youtube.com/watch?v=3DMMPA3uxBo
"""

from datetime import datetime, timedelta
from bson.objectid import ObjectId
import os
import time
import re
import copy

from flask import Flask, jsonify, request, send_file, session, send_from_directory, safe_join, abort
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from pymongo.errors import BulkWriteError, DuplicateKeyError
from apscheduler.schedulers.background import BackgroundScheduler
from werkzeug.exceptions import BadRequest

import constants
import documents


app = Flask(__name__)

# Put mongo uri into the app. config
app.config["MONGO_URI"] = constants.MONGO_URI
app.config["SECRET_KEY"] = constants.secret_key
mongo = PyMongo(app)  # Creating mongo from PyMongo by app.

# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)
cors = CORS(app)


def get_valid_pagination_args(args: dict):

    try:
        page = args.get("pageIndex")
        per_page = args.get("pageSize")

        try:
            page = abs(int(page))
        except:
            page = 0

        try:
            per_page = abs(int(per_page))
        except:
            per_page = 10
    except AttributeError as err:
        print(err)  # Logging
        page = 1
        per_page = 10
    return page, per_page


def check_data_type(type):
    return (type in constants.PATHS_TO_DIR.keys())

# URL example = /documents/pdf
@app.route("/documents/<data_type>", methods=["GET"])
def get_documents(data_type):
    data_type = data_type.strip()

    if not (check_data_type(data_type)):
        abort(404)

    page, per_page = get_valid_pagination_args(request.args)
    # data = documents.get_data_list(data_type, page, per_page)
    data = documents.getDocuments(data_type, page, per_page)
    return jsonify(data)


def modifyText(content):
    style = """"""

    for term in constants.START_CASE_TERMS:
        found = re.search(term, content, flags=re.U | re.I)
        if found:
            content = re.sub(str(found.group(
            )), '<span style="background:rgba(6, 247, 255, 0.5); padding:5px;">'+str(found.group())+'</span>', content)
            break
    for term in constants.END_CASE_TERMS:
        found = re.search(term, content, flags=re.U | re.I)
        if found:
            content = re.sub(str(found.group(
            )), '<span style="background:rgba(255, 6, 6, 0.5); padding:5px;">'+str(found.group())+'</span>', content)
            break

    return content


def readFile(file_path):
    with open(file_path, "r") as iFile:
        content = iFile.read()
        return content


def getFilePath(data_type, name):
    file_name = name.strip()
    directory_path = constants.PATHS_TO_DIR.get(data_type)

    if directory_path:
        file_path = safe_join(directory_path, file_name)
        if os.path.isfile(file_path):
            return file_path
    return False

# URL example = /documents/pdf/file.pdf
@app.route("/documents/<data_type>/<name>", methods=["GET"])
def get_document(data_type, name):
    isExistFile = False
    data_type = data_type.strip()
    file_path = getFilePath(data_type, name)
    if data_type == constants.TYPE_LINK or not file_path:
        abort(404)
    elif data_type == constants.TYPE_HTML or data_type == constants.TYPE_TEXT:
        content = readFile(file_path)
        modified_content = modifyText(content)
        return str(modified_content)
    else:
        return send_file(file_path)

    abort(404)


def getNextSec(name):

    return 0


@app.route("/documents/new_case", methods=["POST"])
def create_new_case():
    try:
        doc_id = request.json["_id"]

        case = {
            "clinical_case": "",
            "case_id": getNextSec("clinical_cases"),
            "source_id": ObjectId(doc_id),
            "versions": [],
            "new": True
        }
        mongo_id = mongo.db.clinical_cases.insert(case)
        result = mongo.db.clinical_cases.find_one(mongo_id)
        result.update({"_id": str(result["_id"]),
                       "source_id": str(result["source_id"])})

    except Exception as err:
        abort(404)

    return jsonify(result)


def validMongoQuery(json):

    _id = json.get("_id")

    if _id:
        _id = ObjectId(_id)

    source_id = ObjectId(json["source_id"])
    caseText = json["clinical_case"]
    time = int(json["time"])
    user_id = json["user_id"]
    loc = json["location"]

    caseObj = {"clinical_case": caseText, "time": time,
               "user_id": user_id, "location": loc}

    yes_no = json.get("yes_no")
    if yes_no:
        caseObj.update({"yes_no": yes_no})

    if _id:
        version = copy.deepcopy(caseObj)
        caseObj.update({"source_id":version})
        query = {
            "$addToSet": {"versions": caseObj},
            "$set": caseObj,
        }
    else:
        query = copy.deepcopy(caseObj)
        query.update({"versions": [caseObj],"source_id":source_id})

    return _id, query

# URL example = /documents/data_type/add
@app.route("/documents/<data_type>/add", methods=["POST"])
def save_data(data_type):
    """ A request must be similar to the next example,
        those keys contain a interrogate symbole (?) are not required.

        Request.json = {doc_id?: str,
                        file_name: str,
                        time: Date,
                        clinical_case: str,
                        meta_data: dict()
                        yes_no: str
                        }

    """

    try:
        isNew = False
    
        _id, query = validMongoQuery(request.json)
        if _id:

            result = mongo.db.clinical_cases.update({"_id": _id}, query)
            
        else:
            _id = mongo.db.clinical_cases.save(query)
            isNew = True

        if isNew or result["nModified"] > 0:
            mongoObj = mongo.db.clinical_cases.find_one({"_id": _id})
            mongoObj.update({"_id": str(mongoObj["_id"]),
                             "source_id": str(mongoObj["source_id"])
                             })
            result_to_send = mongoObj
        else:
            
            abort(400, "Couldn't update, maybe the mongo _id is invalid.")

    except Exception as err:
        print("Error:", err)
        mongo.db.errors.insert_one({"client_data": str(request.json),
                                    "error": str(err)})
        
        abort(400, str(err))
    return jsonify(result_to_send)


@app.route("/")
@cross_origin()
def home():
    return {"data": "Welcome to codiEsp"}


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


# -----------------------------------------
# @app.route("/documents/<data_type>/add", methods=["POST"])
# def save_data(data_type):
#     data_type = data_type.strip()
#     directory = constants.PATHS_TO_DIR.get(data_type)

#     doc_id = request.json[];
