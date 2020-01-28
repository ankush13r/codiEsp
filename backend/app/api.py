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
    data = documents.get_data_list(data_type, page, per_page)
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

    return 0;

@app.route("/documents/new_case", methods=["POST"])
def create_new_case():
    try:
        doc_id = request.json

        case = {
            "clinical_case":"",
            "case_id":getNextSec("clinical_cases"),
            "source_id": doc_id,
            "versions": []
        }
        mongo_id = mongo.db.clinical_cases.insert(case)
        result =  mongo.db.clinical_cases.find_one(mongo_id)
        result.update({"_id":str(result["_id"])})
    except Exception as err:
        abort(404)

    return jsonify(result)

@app.route("/documents/clinical_cases", methods=["POST"])
def get_cases():
    
    return jsonify([
        {
            "_id": "id_12788",
            "case_id": 1,
            "clinical_case": "caso clinico",
            "time": 1245413,
            "yes_no": "yes",
            "meta_data": {},
            "user_id": "u_124541",
            "source_id": "s_45454",
            "versions": [
                {
                    "id": 1,
                    "clinical_case": "caso clinico1.1",
                    "time": 1245413,
                    "yes_no": "yes",
                    "meta_data": {},
                    "user_id": "u_124541",
                },
                {
                    "id": 1,
                    "clinical_case": "caso clinico1.2",
                    "time": 1245413,
                    "yes_no": "yes",
                    "meta_data": {},
                    "user_id": "u_124541",
                }
            ]
        }, {
            "_id": "id_3566",
            "case_id": 2,
            "clinical_case": "caso clinico2",
            "time": 2245413,
            "yes_no": "yes2",
            "meta_data": {},
            "user_id": "u_224541",
            "source_id": "s_25454",
            "versions": [
                {
                    "id": 1,
                    "clinical_case": "caso clinico2.1",
                    "time": 1245413,
                    "yes_no": "yes",
                    "meta_data": {},
                    "user_id": "u_124541",
                },
                {
                    "id": 1,
                    "clinical_case": "caso clinico2.2",
                    "time": 1245413,
                    "yes_no": "yes",
                    "meta_data": {},
                    "user_id": "u_124541",
                }
            ]
        }
    ])


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
    data_type = data_type.strip()
    directory = constants.PATHS_TO_DIR.get(data_type)

    request_data = request.json

    doc_id = request_data.get("id")
    yes_no = request_data.get("yes_no")
    file_name = request_data["file_name"]
    clinical_case = (request_data["clinical_case"]).strip()
    time = request_data["time"]
    meta_data = request_data["meta_data"]
    source_path = safe_join(directory, file_name.strip())

    # elif data_type != constants.PATHS_TO_DIR.keys():
    #     return jsonify({"error":
    #                     {"message": "Data type parameter of url is invalid, please check the url",
    #                      "type": "invalid_parm"}
    #                     })

    result_to_send = {}
    try:
        if not doc_id:
            data_to_save = dict({"data_type": data_type,
                                 "file_name": file_name,
                                 "source_path": source_path,
                                 "versions": [
                                     {
                                         "time": time,
                                         "clinical_case": clinical_case,
                                         "meta_data": meta_data
                                     }],
                                 "clinical_case": clinical_case,
                                 })

            if data_type == constants.TYPE_LINK:
                link = request_data["link"].strip()
                data_to_save.update({"link": link})
            if yes_no:
                data_to_save["versions"][0].update({"yes_no": yes_no})
            result = mongo.db.clinical_cases.insert_one(data_to_save)
            request_data.update({"doc_id": str(result.inserted_id)})
        else:
            doc_id = doc_id.strip()
            clinical_case_to_list = {"time": time,
                                     "clinical_case": clinical_case,
                                     "meta_data": meta_data,

                                     }
            if yes_no:
                clinical_case_to_list.update({"yes_no": yes_no})
            result = mongo.db.clinical_cases.update({"_id": ObjectId(doc_id)},
                                                    {"$addToSet": {"versions": clinical_case_to_list},
                                                     "$set": {"clinical_case": clinical_case}}
                                                    )

        versions = mongo.db.clinical_cases.find_one(
            {"_id": ObjectId(request_data["doc_id"])}, {"_id": 0, "versions": 1})
        request_data.update(versions)
        result_to_send = request_data
    except Exception as err:

        mongo.db.errors.insert_one(
            {"client_data": str(request_data), "error": str(err)})

        result_to_send = request_data.update({"error":
                                              {"message": str(err),
                                               "type": "mongo_exception"}
                                              })

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
