from flask import abort

from app import constants
from app.utils.mongo import mongo
from bson.objectid import ObjectId
from pymongo.errors import InvalidId
from pymongo import DESCENDING, ASCENDING


def update_order(order: int, _id: str = None):
    """Method to update order of all regex depending on the order an id received as parameter.
    EX: if _id had order 5 but new order is 3 
    than it will change to order 3 and other regex's order will be increment.
    """

    # If order is not valid or not exist than it will create a new order as a last order.
    try:
        order = int(order)
    except:
        obj = mongo.db.regex.find_one({"_id": ObjectId(_id)})
        if obj:
            order = obj["order"]

        else:
            obj = list(mongo.db.regex.find().sort("order", -1).limit(1))
            if obj:
                order = obj[0]["order"] + 1
            else:
                order = 0

        return order

    # If oreder is valid than it will modify other orerds also to make a uniq order for regex.
    try:
        obj = mongo.db.regex.find_one({"_id": ObjectId(_id)})
        if obj:
            old_order = obj["order"]
            if order < old_order:

                mongo.db.regex.update_many(
                    {
                        "$and": [
                            {"order": {"$gte": order}},
                            {"order": {"$lt": old_order}}]
                    },
                    {"$inc": {"order": 1}}
                )

            elif order > old_order:
                mongo.db.regex.update_many(
                    {
                        "$and": [
                            {"order": {"$gt": old_order}},
                            {"order": {"$lte": order}}]
                    },
                    {"$inc": {"order": -1}}
                )

        else:
            obj = mongo.db.regex.find_one({"order": order})
            if obj:
                mongo.db.regex.update_many(
                    {"order": {"$gte": order}},
                    {"$inc": {"order": 1}}
                )

    except Exception as err:
        abort(500, str(err))

    return order


def get_regex_data():
    """Method to get regex data, it will return a list of all regex and regex type as list.
    If it gives any error, will return 500 error with message.
    """
    try:

        # If mongo object if None, it gets a empty list [].
        regex_list = list(mongo.db.regex.find() or [])

        # GEt list of all regex types from DB. If it give None, than it will choose empty list []
        types_list = list(mongo.db.regexType.find({}) or [])

        # Changing mongo's object _id into string of all objects.
        [obj.update({"_id": str(obj["_id"])}) for obj in regex_list]
        types_list = [{"_id": str(obj["_id"]), "name":obj["name"]}
                      for obj in types_list]

        obj_to_send = {"types": types_list, "regex": regex_list}
        return [True, obj_to_send]
    except Exception as err:
        return abort(501, str(err))


def save_regex(json):
    """Method to add regex, it will add regex to the DB, if all ok, it will return [true].
    If it gives any error, will return 500 error with message.
    """
    try:
        # Valid arguments from request and get valid query to save into mongDB. _id may None, if the object is new.
        query = valid_query(json)
        obj = mongo.db.regex.insert_one(query)
        _id = obj.inserted_id

        # Object from mongo to send
        obj = mongo.db.regex.find_one({"_id": ObjectId(_id)})
        obj.update({"_id": str(obj["_id"])})

        return [True]
    except Exception as err:
        return abort(501, str(err))


def modify_regex(json):
    """Method to modify regex, it will modify the by it's id, if all ok it will return [true].
    If it gives any error, will return 500 error with message.
    """
    try:
        _id = json.get("_id", None)
        # Valid arguments from request and get valid query to save into mongDB. _id may None, if the object is new.

        # IF mongo id exist, update the query (object). Otherwise insert it as new.
        if _id:
            query = valid_query(json)
            obj = mongo.db.regex.update_one({"_id": ObjectId(_id)}, {
                                            "$set": query}, upsert=True)
        else:
            return [False, "ID is required"]

        # Object from mongo to send
        obj = mongo.db.regex.find_one({"_id": ObjectId(_id)})
        obj.update({"_id": str(obj["_id"])})

        return [True]

    except Exception as err:
        abort(501, str(err))


def delete_regex(json):
    """Method to delete regex, it will delete the by it's id, if all ok it will return [true].
    If it gives any error, will return 500 error with message.
    """
    try:
        _id = json["_id"]
        res = mongo.db.regex.delete_one({"_id": ObjectId(_id)})

        response = {"error": {"message": "Couldn't delete the data"}}

        return [res.deleted_count > 0]

    except Exception as err:
        abort(500, str(err))


def valid_query(jsonObj: dict) -> (str, dict):
    """Method to make a valid object for mongo query, it reorders order of regex, those are necessary 
    and return valid object to add or modify to the database
    """
    
    # Required arguments.
    re_type = jsonObj["type_id"]
    re_value = jsonObj["value"]

    # Optional arguments.
    _id = jsonObj.get("_id", None)
    ignore_case = jsonObj.get("ignoreCase", False)
    re_order = update_order(jsonObj.get("order"), _id)

    # If order value is not value, it will go for exception to create own order value

    mongo_obj = {}
    if _id:
        _id = ObjectId(_id)
        # If mongo db returns none, than it will be empty dict
        mongo_obj = mongo.db.regex.find_one({"_id": _id}, {"_id": 0}) or {}

    # Update query as mongo object with valida argument.
    mongo_obj.update({"value": re_value,
                      "type_id": re_type,
                      "ignoreCase": ignore_case,
                      "order": re_order})

    return mongo_obj
