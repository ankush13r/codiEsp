from app import constants
from app.mongo import mongo
from bson.objectid import ObjectId
from pymongo.errors import InvalidId
from pymongo import DESCENDING, ASCENDING


def update_order(re_type: str, order: int):

    try:
        order = int(order)
        if mongo.db.regex.find_one({"order":order,"type":re_type}):
            mongo.db.regex.update_many(
                {"order": {"$gte": order}, "type":re_type},
                {"$inc": {"order": 1}}
            )

    except:
        obj = list(mongo.db.regex.find({"type":re_type}).sort("order", -1).limit(1))
        if obj:
            order = obj[0]["order"] + 1

    return order or 0


def valid_query(jsonObj: dict) -> (str, dict):
    # Required arguments.
    re_type = jsonObj["type"]
    re_value = jsonObj["value"]

    # Optional arguments.
    _id = jsonObj.get("_id", None)
    ignore_case = jsonObj.get("ignoreCase", False)

    re_order = update_order(re_type, jsonObj.get("order"))

    # If order value is not value, it will go for exception to create own order value

    mongo_obj = {}
    if _id:
        _id = ObjectId(_id)
        # If mongo db returns none, than it will be empty dict
        mongo_obj = mongo.db.regex.find_one({"_id": _id}, {"_id": 0}) or {}

    # Update query as mongo object with valida argument.
    mongo_obj.update({"value": re_value,
                      "type": re_type,
                      "ignoreCase": ignore_case,
                      "order": re_order})

    return _id, mongo_obj
