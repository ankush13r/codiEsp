from app import constants
from app.mongo import mongo
from bson.objectid import ObjectId
from pymongo.errors import InvalidId




def update_order(re_type: str, order: int):

    pass


def valid_query(jsonObj: dict) -> (str, dict):
    # Required arguments.
    re_type = jsonObj["type"]
    re_value = jsonObj["value"]

    # Optional arguments.
    _id = jsonObj.get("_id", None)
    ignore_case = jsonObj.get("ignoreCase", False)

    re_order = None
    # If order value is not value, it will go for exception to create own order value
    try:
        re_order = int(jsonObj["order"])
    except:
        pass

    mongo_obj = {}
    if _id:
        _id = ObjectId(_id)
        #If mongo db returns none, than it will be empty dict
        mongo_obj = mongo.db.regex.find_one({"_id": _id}, {"_id": 0}) or {}

    # Update query as mongo object with valida argument.
    mongo_obj.update({"value": re_value,
                      "type": re_type,
                      "ignoreCase": ignore_case,
                      "order": re_order})

    return _id, mongo_obj
