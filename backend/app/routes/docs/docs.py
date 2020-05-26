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
from app.utils.mongo import mongo
from app.routes.docs import controller


bp = Blueprint("docs", __name__)


@bp.route("/types", methods=["GET"])
def get_types():
    return jsonify(controller.get_types())


# URL example = /pdf
@bp.route("/<data_type>", methods=["GET"])
def get_documents(data_type):
    # Getting data by the function get_documents from utils.
    return jsonify(controller.get_documents(data_type, request.args))



# URL example = /pdf/file.pdf
@bp.route("/<data_type>/<_id>", methods=["GET"])
def get_document(data_type, _id):
    return controller.get_document(data_type, _id)


@bp.route("/finish", methods=["PUT"])
def finish_document():
    return jsonify(controller.finish_document(request.json))


# URL example = /data_type/add
@bp.route("/add", methods=["POST"])
def save_data():
    """ A request must be similar to the next example,
        those keys contain a interrogate symbole (?) are not required.
    """
    return jsonify(controller.save_data(request.json))

   

