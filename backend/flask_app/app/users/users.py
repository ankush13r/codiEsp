from bson.objectid import ObjectId

from flask import jsonify, request,  abort, Blueprint, session

from app.users import controller
from functools import wraps
from app import jwt
from flask_jwt_extended import jwt_required,  jwt_refresh_token_required


bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["POST"])
def login():
    session['key'] = 'value'
    return jsonify(controller.login(request.json)), 200


@bp.route("/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
    return jsonify(controller.refresh_token()), 200


@bp.route("/revoke_access_token", methods=["get"])
@jwt_required
def logout():
    return jsonify(controller.logout()), 200


@bp.route("/revoke_refresh_token", methods=["get"])
@jwt_refresh_token_required
def get_access_token():
    return jsonify(controller.logout()), 200
