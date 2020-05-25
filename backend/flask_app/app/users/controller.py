from flask import current_app, request
from app import jwt

from app.mongo import mongo


def login(user):
    '''Check if the given email and password match the ones for that user in database.'''
    response = [False, 'Invalid user and/or password']

    try:
        user_mail = user['email']
        found_user = mongo.db.users.find_one(
            {
                'email': {"$regex": user_mail, "$options": 'i'},
                'password': user['password']
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
        response = [
            False, "Internal server error (Code: 4001). Please try again later or contact us"]

    return response


def refresh_token():
    return jwt.refresh_token()


def logout():
    return jwt.revoke_token()
