"""Testing file for app
"""

from app.routes.clinical_data import controller
from app import create_app
from app.utils.mongo import mongo
import pytest
import json
import socket

from bson.objectid import ObjectId
from datetime import datetime
from app.utils import utils
from app import constants


APP = create_app()
APP.config['TESTING'] = True
CLIENT = APP.test_client()

def test_app():

    # App is running correctly if return 200 code by route "/api"
    assert CLIENT.get('/api').status_code == 200

    # test if SECRET_KEY exist
    assert type(APP.config['SECRET_KEY']) == str

    # test if mongo MONGO_URI exist
    assert type(APP.config['MONGO_URI']) == str

    # test debug mode is off
    assert APP.config['DEBUG'] == False


def test_clinical_data():

    rv = CLIENT.get('/api/clinical_cases')
    json_data = rv.get_json()

    # test clinical_cases route works well
    assert rv.status_code == 200

    # Clinical cases return documents as list
    assert type(json_data.get("documents")) == list

    # Clinical cases return total records variable as int
    assert type(json_data.get("totalRecords")) == int

    # Clinical cases return currentPage variable as int
    assert type(json_data.get("currentPage")) == int

    # Clinical cases return perPage variable as int
    assert type(json_data.get("perPage")) == int


def test_auth():

    assert CLIENT.post('/api/auth/login').status_code == 406

    res =  CLIENT.post('/api/auth/login', json=dict(
        email="admin@invalid.com",
        password="invali_password"
    ), follow_redirects=True)

    #It must return false, because password or email is invalid
    assert res.get_json()[0] == False

    #The second argument must be a string of error message.
    assert type(res.get_json()[1]) == str

    json_mongo = get_valid_user()

    assert json_mongo != None

    # Login with valid user email
    res = CLIENT.post('/api/auth/login', json=dict(
        email=json_mongo["email"],
        password=json_mongo["password"]
    ), follow_redirects=True).get_json()

    # check respons made by login is true, with a valid user
    assert res[0] == True
    access_token = res[1]["tokens"]["accessToken"]
    refresh_token = res[1]["tokens"]["refreshToken"]
    assert type(access_token) == str
    assert type(refresh_token) == str

    # To refresh code with passing  authorization token in headers. It must return new token and 200
    assert CLIENT.post(
        '/api/auth/refresh', headers={"Authorization": f"Bearer {refresh_token}"}).status_code == 200

    # Revoke the access token (when user wants to logout) it must be authorized by refresh code.
    assert CLIENT.get(
        '/api/auth/revoke_access_token', headers={"Authorization": f"Bearer {access_token}"}).status_code == 200

    # Revoke the  refresh token (when user wants to logout) it must be authorized by refresh code.
    assert CLIENT.get(
        '/api/auth/revoke_refresh_token', headers={"Authorization": f"Bearer {refresh_token}"}).status_code == 200

    # Now we revoked the refresh token it musth return 401 code as unauthorized
    assert CLIENT.post(
        '/api/auth/refresh', headers={"Authorization": f"Bearer {refresh_token}"}).status_code == 401


def test_check_authorization():
    # All these routes are protected, so client must pass Authorization Bearer token in header

    # To refresh code must be authorized. It must return 401 error
    assert CLIENT.post('/api/auth/refresh').status_code == 401

    # To revoke refresh code must be authorized
    assert CLIENT.get('/api/auth/revoke_refresh_token').status_code == 401

    # To revoke refresh code must be authorized
    assert CLIENT.get('/api/auth/revoke_access_token',).status_code == 401

    assert CLIENT.patch(
        '/api/clinical_cases/case_id/selected_version').status_code == 401

    assert CLIENT.delete('/api/clinical_cases/case_id').status_code == 401

    assert CLIENT.delete(
        '/api/clinical_cases/case_id/versions/4').status_code == 401

    assert CLIENT.patch(
        '/api/clinical_cases/case_id/versions/4').status_code == 401


def test_crud_clinical_case():
    data = {'clinicalCase': 'Clinical case abstract',
            'time': 1590454551864, 'sourceId': '5ebe8fb4fabe69b718867013', 'user_id': None, 'hpoCodes': [], 'ip': '89.129.227.94'}

    # Submit clinical case without data. It must retrun 400, error bad request
    assert CLIENT.post('/api/docs/add').status_code == 400

    # Submit clinical case valid data, without id. It must create new and return a object and 200.
    res = CLIENT.post('/api/docs/add', json=data, follow_redirects=True)
    res_json = res.get_json()

    _id = res_json["_id"]

    # Request is success  by code 200
    assert res.status_code == 200

    # Data contains a id success  by code 200
    assert type(ObjectId(_id)) == ObjectId

    # Id is valid
    assert type(ObjectId(res_json["sourceId"])) == ObjectId

    # Version length must be one, if send document without id, because it will treated as new clinical case if no id
    assert len(res_json["versions"]) == 1

    # Submit clinical case valid data and with id. It must create new and return a object and 200.
    data.update({"_id": _id})
    res_2 = CLIENT.post('/api/docs/add', json=data, follow_redirects=True)
    res_json_2 = res_2.get_json()
    _id_2 = res_json_2["_id"]

    # Request is success  by code 200
    assert res.status_code == 200

    # Compare first request id and second
    assert _id_2 == _id

    # Source id is same as first request
    assert res_json_2["sourceId"] == res_json["sourceId"]

    # Now version length is 2, because we pass an id, so it will update versions with one more.
    assert len(res_json_2["versions"]) == 2

    # Insert data with invalid id
    data.update({"_id": "gfdgdfgdfgdf"})
    res_3 = CLIENT.post('/api/docs/add', json=data, follow_redirects=True)

    # It will give you an error 400 bad request
    assert res_3.status_code == 400

    # Insert data with valid id, but not exist in mongo.
    gen_time = datetime(2000, 1, 1)
    dummy_id = str(ObjectId.from_datetime(gen_time))

    data.update({"_id": dummy_id})
    res_3 = CLIENT.post('/api/docs/add', json=data, follow_redirects=True)

    # This error is treated as an internal error if id is invalid
    assert res_3.status_code == 500

    delete_clinical_case(_id)


def test_get_location():
    """ Here we will check if the app return an exception if location of file locations DATA is wrong or not exist.  
    """

    data = {'clinicalCase': 'Clinical case abstract',
            'time': 1590454551864, 'sourceId': '5ebe8fb4fabe69b718867013', 'user_id': None, 'hpoCodes': [], 'ip': '89.129.227.94'}

    old_path_loc_db = constants.GeoipPath

    #Changing the path of location db file
    constants.GeoipPath = "invalid_path"

    # Submit clinical case wiht valid data and we changed path of file to look for locations.It must return 500 error.
    res = CLIENT.post('/api/docs/add', json=data, follow_redirects=True)
    assert res.status_code == 500

    #Reset the path of location db file
    constants.GeoipPath = old_path_loc_db


def delete_location(_id):
    mongo.db.locations.delete_one({"_id": ObjectId(_id)})

    assert mongo.db.locations.find_one({"_id": ObjectId(_id)}) == None


def delete_clinical_case(_id):
    mongo.db.clinicalCases.delete_one({"_id": ObjectId(_id)})

    assert mongo.db.clinicalCases.find_one({"_id": ObjectId(_id)}) == None


def get_valid_user():
    return mongo.db.users.find_one({})
