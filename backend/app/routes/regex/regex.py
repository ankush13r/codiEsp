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
        return jsonify(controller.get_regex_data())

    def post(self):
        return jsonify(controller.save_regex(request.json))

    def put(self):
        return jsonify(controller.modify_regex(request.json))

    def delete(self):
        return jsonify(controller.delete_regex(request.json))


api.add_resource(Regex, '', '/')
