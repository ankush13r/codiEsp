
from bson.objectid import ObjectId

from flask import jsonify, request, send_file, abort, Blueprint

from app import constants
from app.regex import utils

from app.mongo import mongo
from app.shared import utils as shared_utils


bp = Blueprint("regex", __name__, url_prefix="/regex")


@bp.route("/", methods=["GET"])
@bp.route("", methods=["GET"])
def get_regex():
    # If mongo object if None, it gets a empty list [].
    regex_list = list(mongo.db.regex.find() or [])

    # GEt list of all regex types from DB. If it give None, than it will choose empty list []
    types_list = list(mongo.db.regexTypes.find({}, {"style": 0}) or [])

    # Changing mongo's object _id into string of all objects.
    [obj.update({"_id": str(obj["_id"])}) for obj in regex_list]
    [obj.update({"_id": str(obj["_id"])}) for obj in types_list]

    obj_to_send = {"types": types_list, "regex": regex_list}
    return jsonify(obj_to_send)


@bp.route("/add", methods=["POST"])
def add_regex():
    jsonObj = request.json

    try:
        # Valid arguments from request and get valid query to save into mongDB. _id may None, if the object is new.
        _id, query = utils.valid_query(jsonObj)

           # IF mongo id exist, update the query (object). Otherwise insert it as new.
        if _id:
            obj = mongo.db.regex.update_one({"_id": ObjectId(_id)}, {
                                            "$set": query}, upsert=True)
        else:
            obj = mongo.db.regex.insert_one(query)
            _id = obj.inserted_id

        # Object from mongo to send
        obj = mongo.db.regex.find_one({"_id": _id})
        obj.update({"_id": str(obj["_id"])})

        return jsonify(obj)
    except Exception as err:
        abort(501, str(err))
