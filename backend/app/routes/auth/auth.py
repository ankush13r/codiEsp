""" Main script to controll all petition for authentication like login, logout, etc.
    
    Flask + MongoDB - User Registration and Login - Explainer Video
    https://www.youtube.com/watch?v=3DMMPA3uxBo
"""


from bson.objectid import ObjectId
from flask import jsonify, request,  abort, Blueprint, session

from app.routes.auth import controller
from functools import wraps
from app.utils import jwt
from flask_jwt_extended import jwt_required,  jwt_refresh_token_required


bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["POST"])
def login():
    """This method execute on POST petition made by user to login. 
    It must receive email and password in request. 
    If all data is valid and user login correctly than it will send user data 
    and access and refresh code to the client. These token serves to make petition on protected routes  
    """
    return jsonify(controller.login(request.json)), 200


@bp.route("/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
    """This method execute on POST petition made by user to refresh access code. 
    This is a protected route by refresh token, 
    so user must pass Bearer refresh token in headers to make request.
    """
    return jsonify(controller.refresh_token()), 200


@bp.route("/revoke_access_token", methods=["get"])
@jwt_required
def logout():
    """This method execute on get request logout. It will revoke the access token. 
    This is a protected route by access token, 
    so user must pass Bearer access token in headers to make request.
    """
    return jsonify(controller.logout()), 200


@bp.route("/revoke_refresh_token", methods=["get"])
@jwt_refresh_token_required
def loogut2():
    """This method execute on get request for logout by refresh token. 
    It will revoke the refresh token. 
    This is a protected route by refresh token, 
    so user must pass Bearer refresh token in headers to make request.
    """
    return jsonify(controller.logout()), 200
