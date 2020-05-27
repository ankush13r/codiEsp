from bson.objectid import ObjectId

from flask import jsonify, request, send_file, abort, Blueprint

from app import constants

from app.utils.mongo import mongo
from app.routes.regex import controller

from flask_restful import Resource, Api

bp = Blueprint("regex", __name__)
api = Api(bp)


class Regex(Resource):

    def get(self):
        """This method works on get request made by client. 
        It will return all regex from DataBase
        """
        return jsonify(controller.get_regex_data())

    def post(self):
        """This method works on post request. 
        It will add new regex to DB, received in request.
        """
        return jsonify(controller.save_regex(request.json))

    def put(self):
        """This method works on put request. 
        It serves to modify regex by id received in request.
        The id must be a valid ObjectId
        """
        return jsonify(controller.modify_regex(request.json))

    def delete(self):
        """This method works on put request. 
        It will delete regex by id received in request.
        The id must be a valid ObjectId
        """
        return jsonify(controller.delete_regex(request.json))


api.add_resource(Regex, '', '/')
