"""
    Documentation jwt: https://flask-jwt-extended.readthedocs.io/en/stable/options/#configuration-options
"""

from functools import wraps
from flask import current_app, request, jsonify
# import jwt
import datetime

from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt_identity, get_raw_jwt


from app.mongo import mongo

jwtManager = JWTManager()


@jwtManager.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    res = False
    jti = decrypted_token['jti']
    obj = mongo.db.blacklist.find_one({'jti': jti})

    return obj != None


def create_access_and_refresh_token(user):
    ret = {
        'accessToken': create_access_token(identity=user),
        'refreshToken': create_refresh_token(identity=user)
    }

    return ret


def refresh_token():
    current_user = get_jwt_identity()
    ret = {
        'accessToken': create_access_token(identity=current_user)
    }

    return ret


def revoke_token():
    jti = get_raw_jwt()['jti']
    mongo.db.blacklist.insert_one({'jti': jti})
    return {"msg": "Successfully logged out"}


# def token_required(func):
#     @wraps(func)
#     def decorated(*args, **kwargs):
#         """
#         Decodes the auth token
#         :param auth_token:
#         :return: integer|string
#         """

#         auth_token = request.headers.get("Authorization")
#         if not auth_token:
#             return jsonify([False, 'Token is missing'])

#         auth_token = auth_token.replace('Bearer ', '')

#         if check_if_token_in_blacklist(auth_token):
#             return jsonify([False, 'Invalid token. Please log in.'])

#         try:
#             payload = jwt.decode(
#                 auth_token, current_app.config.get('SECRET_KEY'))

#         except jwt.ExpiredSignatureError:
#             return jsonfy([False, 'Session expired. Please log in.'])

#         except jwt.InvalidTokenError:
#             return jsonfy([False, 'Invalid token. Please log in.'])

#         return func(*args, **kwargs)

#     return decorated


# def encode_auth_token(sub):
#     """
#     Generates the Auth Token
#     :return: string
#     """

#     token = None
#     error = None

#     try:
#         payload = {
#             'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, hours=12),
#             'iat': datetime.datetime.utcnow(),
#             'sub': sub
#         }
#         token = jwt.encode(payload, current_app.config.get(
#             'SECRET_KEY'), algorithm='HS256')
#     except Exception as e:
#         error = str(e)

#     return token, error
