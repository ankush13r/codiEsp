"""Controller file for auth.py. All request of auth.py will be controll in this file.
"""

from flask import current_app, request, abort
from app.utils import jwt

from app.utils.mongo import mongo


def login(json):
    '''Check if the given email and password match the ones for that user in database.
        If all data is correct then it will make login and return user data 
        and token to access to the protected tokens.
    '''

    response = [False, 'Invalid user and/or password']

    user_mail = ""
    password = ""

    try:
        user_mail = json['email']
        password = json['password']
    except:
        abort(406, "email and user name required")
    try:

        found_user = mongo.db.users.find_one(
            {
                'email': {"$regex": f"^{user_mail}$", "$options": 'i'},
                'password': password
            }, {
                '_id': 0,
                'password': 0
            })

        if found_user:
            tokens = jwt.create_access_and_refresh_token(found_user["email"])

            response = [True, {"user": found_user, "tokens": tokens}]

        else:
            response = [False, 'Invalid user and/or password']

    except Exception as err:
        return abort(500, f"Internal server error (Error (4001): {err} Please try again later or contact us")

    return response


def refresh_token():
    '''Function  to get access token. 
    It call to other function from app.jwt.jwt to create a access token.
    '''

    return jwt.refresh_token()


def logout():
    '''Function  to logout. 
    It call to other function from app.jwt.jwt to revoke the token passed by user.
    After this user won't be able to make petitions by same jwt(json web token).
    '''
    return jwt.revoke_token()
