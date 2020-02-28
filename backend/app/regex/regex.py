
from bson.objectid import ObjectId

from flask import jsonify, request, send_file, abort, Blueprint

from app import constants
from app.mongo import mongo

bp = Blueprint("regex", __name__, url_prefix="/regex")

@bp.route("/", methods=["GET"])
def get_regex():
    return "regex"

@bp.route("/add", methods=["POST"])
def add_regex():
    jsonObj = request.json
    return jsonify(jsonObj)