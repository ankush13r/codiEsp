
from bson.objectid import ObjectId

from flask import jsonify, request, send_file, abort, Blueprint

from app import constants
from app.regex import utils

from app.mongo import mongo
from app.shared import utils as shared_utils

from flask_restful import Resource, Api

bp = Blueprint("regex", __name__)
api = Api(bp)


class Regex(Resource):

    def get(self):
        return jsonify(utils.get_regex_data())

    def post(self):
        jsonObj = request.json
        try:
            # Valid arguments from request and get valid query to save into mongDB. _id may None, if the object is new.
            query = utils.valid_query(jsonObj)
            obj = mongo.db.regex.insert_one(query)
            _id = obj.inserted_id

            # Object from mongo to send
            obj = mongo.db.regex.find_one({"_id": ObjectId(_id)})
            obj.update({"_id": str(obj["_id"])})

            return jsonify(utils.get_regex_data())
        except Exception as err:
            print(err)
            abort(501, str(err))

    def put(self):
        jsonObj = request.json
        try:
            _id = jsonObj.get("_id", None)
            # Valid arguments from request and get valid query to save into mongDB. _id may None, if the object is new.

            # IF mongo id exist, update the query (object). Otherwise insert it as new.
            if _id:
                query = utils.valid_query(jsonObj)
                obj = mongo.db.regex.update_one({"_id": ObjectId(_id)}, {
                                                "$set": query}, upsert=True)
            else:
                return jsonify({"error": {"message": "ID is required"}})

            # Object from mongo to send
            obj = mongo.db.regex.find_one({"_id": ObjectId(_id)})
            obj.update({"_id": str(obj["_id"])})

            return jsonify(utils.get_regex_data())
        except Exception as err:
            abort (204,str(err))


    def delete(self):
        
        try:
            _id = request.json["_id"]
            res = mongo.db.regex.delete_one({"_id": ObjectId(_id)})

            response = {"error": {"message": "Couldn't delete the data"}}

            if res.deleted_count > 0:
                response = {"deleted": res.deleted_count}

            return jsonify(response)
            
        except Exception as err:
            abort (204,str(err))

api.add_resource(Regex, '', '/')

