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




app = Flask(__name__)

# Put mongo uri into the app. config
app.config['MONGO_URI'] = Constants.MONGO_URI
app.config['SECRET_KEY'] = 'secretss'
mongo = PyMongo(app)  # Creating mongo from PyMongo by app.
# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)
CORS(app)

OBJ_DOCUMENTS = Documents()
def getDocumentsObj():
    OBJ_DOCUMENTS = Documents()


def validPaginationArgs(args):
    page = args.get("page")
    per_page = args.get("perPage")

    try:
        page = abs(int(page))
    except:
        page = 1
    
    try:
        per_page = abs(int(per_page))
    except:
        per_page = 10
    
    return page,per_page
        

@app.route('/docs/<type>', methods=['GET'])
def get_docs(type):
    page,per_page = validPaginationArgs(request.args)

    data = OBJ_DOCUMENTS.getFilesObj(type,page,per_page)
    return jsonify(data)


@app.route('/doc', methods=['POST'])
def get_source():
    path = request.json.get("path")
    if path and path in Documents:
        pass
    return send_file(path)

@app.before_request
def setSession():
    if not session.get('logged_in'):
        session['logged_in'] = True
        session.permanent = True
        app.permanent_session_lifetime = timedelta(seconds=1)


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=getDocumentsObj, trigger="interval", days=10)
    scheduler.start()
    app.run(host="127.0.0.1", port=5000, debug=True)


