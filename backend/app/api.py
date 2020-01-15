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
    print(page, per_page)
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

    return jsonify(data)

# URL example = /documents/pdf/file.pdf
@app.route("/documents/<data_type>/<name>", methods=["GET"])
def get_document(data_type, name):
    data_type = data_type.strip()
    if data_type == constants.TYPE_LINK:
        abort(404)
    else:
        file_name = name.strip()
        directory_path = constants.PATHS_TO_DIR.get(data_type)

        if directory_path:
            file_path = safe_join(directory_path, file_name)
            if os.path.isfile(file_path):
                return send_file(file_path)

    abort(404)

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
                        }

    """
    data_type = data_type.strip()
    directory = constants.PATHS_TO_DIR.get(data_type)

    request_data = request.json

    doc_id = request_data.get("doc_id")
    file_name = (request_data["file_name"]).strip()
    clinical_case = (request_data["clinical_case"]).strip()
    time = (request_data["time"]).strip()
    meta_data = request_data["meta_data"]

    source_path = safe_join(directory, file_name.strip())

    data_to_save = dict({"data_type": data_type,
                         "source_path": source_path,
                         "clinical_case": clinical_case,
                         "meta_data": meta_data,
                         })


    if data_type == constants.TYPE_LINK:
        link = request_data["link"].strip()
        data_to_save.update({"link": link})

    # elif data_type != constants.PATHS_TO_DIR.keys():
    #     return jsonify({"error":
    #                     {"message": "Data type parameter of url is invalid, please check the url",
    #                      "type": "invalid_parm"}
    #                     })

    result_to_send = {}
    try:
        if not doc_id:

            data_to_save.update({"insert_time": time})
            result = mongo.db.clinical_cases.insert_one(data_to_save)
            request_data.update({"doc_id": str(result.inserted_id)})


        else:
            doc_id = doc_id.strip()
            data_to_save.update({"update_time": time})
            data_to_save.update({"_id": ObjectId(doc_id)})
            result = mongo.db.clinical_cases.replace_one(
                {"_id": ObjectId(doc_id)}, data_to_save, upsert=True)

            if result.upserted_id:
                request_data.update({"doc_id": str(result.inserted_id)})

        result_to_send = request_data

    except Exception as err:
        mongo.db.errors.insert_one(
            {"client_data": str(data_to_save), "error": str(err)})

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
