#!/usr/bin/env python
# encoding: utf-8

"""
Flask + MongoDB - User Registration and Login - Explainer Video
https://www.youtube.com/watch?v=3DMMPA3uxBo
"""

# from datetime import datetime, timedelta
# import time

from bson.objectid import ObjectId
import os

from flask import jsonify, request, send_file, abort, Blueprint


from app import constants
from app.mongo import mongo
from . import utils

bp = Blueprint("docs", __name__)


@bp.route("/types", methods=["GET"])
def get_types():
    """Return a list of documents types.

    :return: A list of all types of documents available in mongoDB.
    :rtype: List
    """
    result = list(mongo.db.documents.distinct("dataType"))
    return jsonify(result)


# URL example = /pdf
@bp.route("/<data_type>", methods=["GET"])
def get_documents(data_type):
    """Receives the data type of document to find documents in mongoDb,
       It also receives page number and length of page as parameters.
       It will return a list of document depending on the data type, page number and page length:

       Ex:  page = 0, per page=10. It will send 0 to 9 documents, including 10.
            page = 3, per page=10. It will send 30 to 39 documents, including 30.

    :param data_type: Receives the data type of document to find documents in mongoDb,
    :type data_type: [type]
    :return: Json object with documents list and all necessary data as size of total record.
    :rtype: JSON(dict)
    """
    data_type = data_type.strip()

    # If the data type is link, sends a error because, we don't provide link directly.
    if format == "link":
        abort(404)
    # Getting valid page number and page length , by calling a function form utils.
    page, per_page = utils.get_valid_pagination_args(request.args)
    # Getting data by the function get_documents from utils.
    data = utils.get_documents(data_type, page, per_page)

    # If there any mongo object Id, it will gives an error. So it must cast to string before sending.
    # get_documents function converts objectId to string, also.
    return jsonify(data)


# URL example = /pdf/file.pdf
@bp.route("/<data_type>/<_id>", methods=["GET"])
def get_document(data_type, _id):
    data_type = data_type.strip()
    file_path = mongo.db.documents.find_one({"_id": ObjectId(_id)}).get("path")

    # If document format is link, then send a error
    if data_type == constants.TYPE_LINK or not file_path:
        abort(404)

    # If document format is text of html, then it will give css style to text and send as string.
    elif data_type == constants.TYPE_HTML or data_type == constants.TYPE_TEXT:
        content = utils.read_file(file_path)
        if content:
            modified_content = utils.modifyText(content)
            return str(modified_content)
        else:
            abort(404)
    # Otherwise sent file. It maybe like pdf, etc.
    else:
        return send_file(file_path)


@bp.route("/finish", methods=["PUT"])
def finish_document():
    _id = ObjectId(request.json["_id"])

    try:
        result = mongo.db.documents.update({"_id": _id, },
                                           {"$set": {"state": 1}})

        return jsonify({"data": result["nModified"]})

    except Exception as err:
        abort(304, {"Error": err})


# URL example = /data_type/add
@bp.route("/add", methods=["POST"])
def save_data():
    """ A request must be similar to the next example,
        those keys contain a interrogate symbole (?) are not required.
    """

    try:
        isNew = False

        _id, query = utils.valid_mongo_query(request.json)
        if _id:
            result = mongo.db.clinicalCases.update_one({"_id": _id}, query)
        else:
            inserted_result = mongo.db.clinicalCases.insert_one(query)
            _id = inserted_result.inserted_id
            isNew = True

        if isNew or result.modified_count > 0:
            mongoObj = mongo.db.clinicalCases.find_one({"_id": _id})

            mongo.db.documents.update_one({"_id": mongoObj["source_id"]}, {
                "$set": {"state": 0}})

            mongoObj.update({"_id": str(mongoObj["_id"]),
                             "source_id": str(mongoObj["source_id"])
                             })

            try:
                for version in mongoObj["versions"]:
                    version.update(
                        {"location_id": str(version["location_id"])})
            except Exception as err:
                pass

            result_to_send = mongoObj
        else:
            abort(400, "Couldn't update, may the mongo _id is invalid.")

    except Exception as err:
        mongo.db.errors.insert_one({"client_data": str(request.json),
                                    "error": str(err)})

        abort(400, str(err))
    
    return jsonify(result_to_send)



# -----------------------------------------------------------------------
# ------------------------------------------------------------------------

# @bp.route("/<data_type>/add", methods=["POST"])
# def save_data(data_type):
#     data_type = data_type.strip()
#     directory = constants.PATHS_TO_DIR.get(data_type)

#     doc_id = request.json[];


# @bp.before_request
# def setSession():
#     if not session.get("logged_in"):
#         session["logged_in"] = True
#         session.permanent = True
#         app.permanent_session_lifetime = timedelta(seconds=1)


# @bp.route("/new_case", methods=["POST"])
# def create_new_case():
    # try:
    # doc_id = request.json["_id"]
#
    # case = {
    # "clinicalCase": "",
    # "case_id": getNextSec("clinicalCases"),
    # "source_id": ObjectId(doc_id),
    # "versions": [],
    # "new": True
    # }
    # mongo_id = mongo.db.clinicalCases.insert(case)
    # result = mongo.db.clinicalCases.find_one(mongo_id)
    # result.update({"_id": str(result["_id"]),
    #    "source_id": str(result["source_id"])})
#
    # except Exception as err:
    # abort(404)
#
    # return jsonify(result)
