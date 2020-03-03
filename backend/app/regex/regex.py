
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
    mongo_data =list(mongo.db.regex.find() or []);

    #Changing mongo's object _id into string of all objects.
    [obj.update({"_id": str(obj["_id"])}) for obj in mongo_data]
            
    return jsonify(mongo_data)


@bp.route("/types", methods=["GET"])
def get_types():
    jsonObj = request.json
    return jsonify(jsonObj)


@bp.route("/add", methods=["POST"])
def add_regex():
    jsonObj = request.json
    try:
        #Valid arguments from request and get valid query to save into mongDB. _id may None, if the object is new.
        _id, query = utils.valid_query(jsonObj)

        #If order exist in the query, than it will check if it's a new order number or must change with any other object.
        if jsonObj["order"]:
            utils.update_order(jsonObj["type"],jsonObj["order"])
        else:
            #Get next sequence of order number by a string, in this case reges_ + type.
            re_order = shared_utils.get_next_sequence("regex_"+jsonObj["type"])
            query.update({"order":re_order})

        #IF mongo id exist, update the query (object). Otherwise insert it as new.
        if _id:
            obj = mongo.db.regex.update_one({"_id":ObjectId(_id)},{"$set":query},upsert=True)
        else: 
            obj = mongo.db.regex.insert_one(query)
            _id = obj.inserted_id

        return jsonify({"id":str(_id)})
    except Exception as err: 
        abort(501,str(err))
        
