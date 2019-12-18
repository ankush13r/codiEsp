#!/usr/bin/env python
# encoding: utf-8

'''
Flask + MongoDB - User Registration and Login - Explainer Video
https://www.youtube.com/watch?v=3DMMPA3uxBo
'''

from datetime import datetime, timedelta
from bson.objectid import ObjectId

from flask import Flask, jsonify, request, send_file, session
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
from pymongo.errors import BulkWriteError, DuplicateKeyError
from apscheduler.schedulers.background import BackgroundScheduler

import Constants
from Utils import Documents


OBJ_DOCUMENTS = Documents()

app = Flask(__name__)

# Put mongo uri into the app. config
app.config['MONGO_URI'] = 'mongodb://mongo_admin:mongo_admin@84.88.52.79:27017/codiEsp'
app.config['SECRET_KEY'] = 'secretss'
mongo = PyMongo(app) # Creating mongo from PyMongo by app.
# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)
CORS(app)

@app.route('/docs/<type>', methods=['GET'])
def get_docs(type):
    print(OBJ_DOCUMENTS)

    return jsonify({"data":"aaa"})

@app.route('/doc', methods=['POST'])
def get_source():
    path =request.json.get("path")
    return send_file(path)


@app.before_request
def setSession():
    if not session.get('logged_in'):
        session['logged_in'] = True
        session.permanent = True
        app.permanent_session_lifetime = timedelta(seconds=1)

def getDocumentsObj():
    OBJ_DOCUMENTS = Documents()
    print(OBJ_DOCUMENTS.docs)

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=getDocumentsObj, trigger="interval", seconds=10)
    scheduler.start()
    app.run(host="127.0.0.1", port=4000, debug=True)
