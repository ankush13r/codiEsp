"""
    This is the script jwt function to create, revoke tokens
    Documentation jwt: https://flask-jwt-extended.readthedocs.io/en/stable/options/#configuration-options
"""

from functools import wraps
from flask import current_app, request, jsonify
# import jwt
import datetime

from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt_identity, get_raw_jwt


from app.utils.mongo import mongo

jwtManager = JWTManager()


@jwtManager.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    """This methos is to check if the token that is passed for access to protected route is in blacklist or not.
    If the token is in black list, it means the token has been revoked and user can't access by this token.
    """
    

    jti = decrypted_token['jti']
    obj = mongo.db.blacklist.find_one({'jti': jti})

    return obj != None


def create_access_and_refresh_token(user):
    """Method to create access token and refresh token. By default access token is valid for 15 minuts 
    and refresh token is valid for 30 days. It create the token by secret  variable of flask and a identity.
    """

    ret = {
        'accessToken': create_access_token(identity=user),
        'refreshToken': create_refresh_token(identity=user)
    }

    return ret


def refresh_token():
    """Method to refresh access token. It will create a new access token an return it. 
    By default it's valid until 15 minuts. 
    It create the token by secret  variable of flask and a identity.
    """
    current_user = get_jwt_identity()
    ret = {
        'accessToken': create_access_token(identity=current_user)
    }

    return ret


def revoke_token():
    """function to revoke the token. It will token's jti unique variable to the black list.
    After this all request with this token will be denied. 
    """
    jti = get_raw_jwt()['jti']
    mongo.db.blacklist.insert_one({'jti': jti})
    return True

