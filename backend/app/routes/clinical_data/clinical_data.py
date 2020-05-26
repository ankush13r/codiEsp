
from bson.objectid import ObjectId

from flask import jsonify, request, send_file, abort, Blueprint
from flask_restful import Resource, Api
from flask_jwt_extended import jwt_required

from app import constants
from app.utils import jwt
from app.routes.clinical_data import controller


bp = Blueprint("clinical_cases", __name__)

@bp.route("/<case_id>/selected_version", methods=["PATCH"])
@jwt_required
def modify_selected_version(case_id):
    return jsonify(controller.modify_selected_version(case_id,request.json))


class Cases(Resource):
    def get(self):
        return jsonify(controller.get_data(request.args))


class Case_by_id(Resource):

    @jwt_required
    def delete(self, case_id):
        return jsonify(controller.delete_case(case_id))


class Version(Resource):

    @jwt_required
    def delete(self, case_id, version_id):
        return jsonify(controller.delete_version(case_id, version_id))

    @jwt_required
    def patch(self,case_id, version_id):
        return jsonify(controller.patchVersion(case_id, version_id,request.json))



api = Api(bp)
api.add_resource(Cases, '', '/')
api.add_resource(Case_by_id, '', '/<case_id>')
api.add_resource(Version, '', '/<case_id>/versions/<int:version_id>')

