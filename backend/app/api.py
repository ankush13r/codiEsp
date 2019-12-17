#!/usr/bin/env python
# encoding: utf-8

'''
Flask + MongoDB - User Registration and Login - Explainer Video
https://www.youtube.com/watch?v=3DMMPA3uxBo
'''

from datetime import datetime
from bson.objectid import ObjectId

from flask import Flask, jsonify, request, send_file
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
from pymongo.errors import BulkWriteError, DuplicateKeyError

import Constants
from Utils import Utils

app = Flask(__name__)

# Put mongo uri into the app. config
app.config['MONGO_URI'] = 'mongodb://mongo_admin:mongo_admin@84.88.52.79:27017/codiEsp'
# app.config['JWT_SECRET_KEY'] = 'secret'

mongo = PyMongo(app) # Creating mongo from PyMongo by app.
# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)
CORS(app)

@app.route('/docs/<type>', methods=['GET'])
def get_docs(type):
    data = Utils.get_docs(type,None)
    return jsonify({"data":data})

@app.route('/doc', methods=['GET'])
def get_source():
    path =request.args.get("path")
    return send_file(path)


@app.route('/', methods=['GET'])
def getProva():
    return "hola"


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=4000, debug=True)
