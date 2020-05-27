"""
    Main flask file to controll all petition for clinical cases, as delete, post, patch, get, put.
"""
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
    """This method works when user make patch a request to modify the id of selected version.
    This is protected route, so user must sent access token in headers.
    """
    return jsonify(controller.modify_selected_version(case_id, request.json))


class Cases(Resource):
    def get(self):
        """This method works when user make a get request get all documents those have clinical cases.
        It can receive some parameter like page number and numbers of documents by page.
        """
        return jsonify(controller.get_data(request.args))


class Case_by_id(Resource):

    @jwt_required
    def delete(self, case_id):
        """This method works when user make a delete request to delete a clinical case.
        The route must contain a valid id. 
        As this is a protected route user need to pass access token in headers.
        """

        return jsonify(controller.delete_case(case_id))


class Version(Resource):

    @jwt_required
    def delete(self, case_id, version_id):
        """This method works when user make a delete request to delete a version.
        The route must contain a valid clinical case id and version id. 
        As this is a protected route user need to pass access token in headers.
        """
        return jsonify(controller.delete_version(case_id, version_id))

    @jwt_required
    def patch(self, case_id, version_id):
        """This method works when user make a patch request to modify a version.
        The route must contain a valid clinical case id and version id.
        Also it must contain json data with valid key to modify them. 
        As this is a protected route user need to pass access token in headers.
        """
        return jsonify(controller.patchVersion(case_id, version_id, request.json))

# Adding routes to the Resource api. It serves to make class for different requests.
api = Api(bp)
api.add_resource(Cases, '', '/')
api.add_resource(Case_by_id, '', '/<case_id>')
api.add_resource(Version, '', '/<case_id>/versions/<int:version_id>')
