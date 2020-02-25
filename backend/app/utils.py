import re
import os
import glob
import copy
import json

from flask import safe_join
from bson.objectid import ObjectId
from api import mongo
import geoip2.database
import constants

FILE_CONST = "./data/constants.json"



def get_valid_pagination_args(args: dict):

    try:
        page = args.get("pageIndex")
        per_page = args.get("pageSize")

        try:
            page = abs(int(page))
        except:
            page = 0

        try:
            per_page = abs(int(per_page))
        except:
            per_page = 10
    except AttributeError as err:
        print(err)  # Logging
        page = 1
        per_page = 10
    return page, per_page


def read_file(file_path):
    with open(file_path, "r") as iFile:
        content = iFile.read()
        return content


def modifyText(content):
    """Method to modify the text received as parameter and return it modified.
     It modifies the text by adding it some html style as highlights(background).
     It serves to show user that where start or end the important information in the text.
     All regex are saved in mongoDB.
    """

    color_occurrences_style = 'style="background:rgba(43, 218, 252, 1);  padding:0.3em; border-radius:0.3em;"'
    start_color_style = ' style="background:rgba(255, 6, 6, 0.5); padding:0.3em; border-radius:0.3em;"'
    end_color_style = 'style="background:rgba(43, 218, 252, 0.5); padding:0.3em; border-radius:0.3em; "'
    pre_line_style = """ style="line-height:1.6; text-align: justify;  white-space:pre-line; font-family: 'Open Sans';" """

    

    # Regex for find first occurrence (information starting) and modify it, giving html style class.
    if constants.START_CASE_TERMS:
        joined = "|".join(constants.START_CASE_TERMS)
        terms = f'({joined})'
        regex = re.compile(f'({terms})', flags=re.I | re.U | re.S)
        content = regex.sub(
            fr'<span {color_occurrences_style}>\1</span>', content, 1)

    # Regex for find end of the information in text and modify it, giving html style class.
    if constants.END_CASE_TERMS:
        joined = "|".join(constants.END_CASE_TERMS)
        terms = f'({joined})'
        regex = re.compile(f'({terms})', flags=re.I | re.U | re.S)
        content = regex.sub(
            fr'<span {start_color_style}>\1</span>', content, 1)

    # Regex for find all frequencies in the text and after give them html style class.
    if ["caso [0-9]"]:
        joined = "|".join(["caso [0-9]"])
        terms = f'({joined})'
        regex = re.compile(f'({terms})', flags=re.I | re.U | re.S)
        content = regex.sub(
            fr'<span {end_color_style}>\1</span>', content)

    # Html style to preserve break lines as they are, because normalky break lines are chopped in html (web).
    return f"<span {pre_line_style}>{content}</span>"


def get_case_id(source_id):
    """ Function to create new case id by source_id, because a source can have more than one clinical case.
        So first of all it will get ids of all clinical cases related to the source_id, received as parameter. 
        And after it will create a new id and return it.
    """
    new_case_id = 0
    # get all clinical cases related to the source_id received as parameter
    results = list(mongo.db.clinical_cases.find(
        {"source_id": source_id}, {"_id": 0, "case_id": 1}))

    try:
        # All clinical cases ids, it may empty if there is no result
        case_ids = [result.get("case_id") for result in results]

        # New id is maximum number + 1 from ids list, if the ids list is empty than new id is 0.
        maxNum = max(case_ids)
        new_case_id = maxNum + 1
    except:
        pass

    return new_case_id


def get_version_id(_id):
    """ Function to create new clinical case's version id by case, because a clinical case can have more than one version.
        So first of all it will get ids of all versions related to the _id of clinical case, received as parameter. 
        And after it will create a new id and return it.
    """
    new_v_id = 0

    # get all versions related to the case id received as parameter.
    results = mongo.db.clinical_cases.find_one(
        {"_id": _id}, {"_id": 0, "versions": 1})

    try:
        # All versions ids, it may empty if there is no result
        v_ids = [result["id"] for result in results["versions"]]

        # New id is maximum number + 1 from ids list, if the ids list is empty than new id is 0.
        maxNum = max(v_ids)
        new_v_id = maxNum + 1
    except:
        pass

    return new_v_id


def get_location(ip):
    """ Receives a ip address save into the mongo if it doesn't exist. It saves ip address and also other meta data as direction.
    If the the ip already exist it will find the mongo _id related to the ip address.
    In both case it returns mongo id related to the ip address.

    :param ip: ip address to save into mongo.
    :type ip: str
    :return: mongo db id, where the ip address is saved
    :rtype: str
    """
    _id = None
    try:
        # Ip the ip is not None or empty entre into the condition to get it's mongo id to return it.
        if ip:
            # Getting mongo object by ip address, if exist.
            mongoObj = mongo.db.locations.find_one({"ip": ip})

            # If the ip address doesn't exist, it creates a new document.
            if not mongoObj:
                reader = geoip2.database.Reader(constants.GeoipPath)
                response = reader.city(ip)
                jsonObj = {"isoCode": response.country.iso_code,
                           "country": response.country.name,
                           "postalCode": response.postal.code,
                           "subdivisions": response.subdivisions.most_specific.name,
                           "city": response.city.name,
                           "latitude": response.location.latitude,
                           "longitude": response.location.longitude,
                           "ip": ip
                           }
                result = mongo.db.locations.insert_one(jsonObj)
                _id = result.inserted_id
            else:
                # Get id from mongo object.
                _id = mongoObj["_id"]

    except Exception as err:
        pass

    return str(_id)


def valid_mongo_query(json):
    """It receives the json request sent by client and parse necessary data to save into mongo.
    Why need to parse data? Because client can sent more or less data then expected and it would be unsaved.
    So if he sends more data it will get just needed, otherwise if he send less then it will throw an exception.


    :param json: json request of client.
    :type json: dict
    :return: Returns a mongo id or None, and dict of query to save into mongo.
    :rtype: ObjectId|None, dict
    """

    _id = json.get("_id")
    source_id = ObjectId(json["source_id"])
    caseText = json["clinical_case"]
    time = int(json["time"])
    user_id = json["user_id"]
    hpoCodes = json["hpoCodes"]
    ip = json["ip"]

    # Getting location id from DB
    location_id = get_location(ip)

    # Case object to save into the DB.
    caseObj = {"clinical_case": caseText,
               "time": time,
               "user_id": user_id,
               "location_id": location_id,
               "hpoCodes": hpoCodes
               }

    yes_no = json.get("yes_no")
    # If json request contains yes_no key it updates the caseObj dict with it.
    if yes_no:
        caseObj.update({"yes_no": yes_no})

    # Cloning the object as version. deepcopy makes a copy of object, recursively.
    # "https://docs.python.org/2/library/copy.html"
    version = copy.deepcopy(caseObj)

    # If the _id exist it means the document already exist and it will create a query to update that document
    if _id:
        _id = ObjectId(_id)

        # create a new id for the version.
        v_id = get_version_id(_id)

        # update the version with it's new id.
        version.update({"id": v_id})

        # Uncomment to update source_id into the caseObj.
        # Even if it's not necessary because if case already exists, it means it must have id.
        # caseObj.update({"source_id": source_id})s

        print(_id, "--", source_id)
        # new mongo query to update the document by id. Version to add into the list of versions. 
        # And all other key with new values (caseObj).
        query = {
            "$addToSet": {"versions": version},
            "$set": caseObj,
        }

    # If the _id doesn't exist it means it a new document.
    # So it creates a mongo query to insert the document.
    else:
        # create a new id for the document by source_id. It is an alternative id.
        case_id = get_case_id(source_id)

        # update the version with it's new id as 0. If the document (clinical case) is new, means it hasn't any version yet.
        version.update({"id": 0})

        #Update the object with version as list. source_id (It's origen document's id, that is already in DB), and case_id.
        caseObj.update(
            {"versions": [version], "source_id": source_id, "case_id": case_id})
        query = caseObj

    #_id maybe none, if it was new document.
    return _id, query


def get_documents(file_type: str, page: int = 0, per_page: int = 10):
    """It return a dict with list of document. 
    Receives type of file as "xml, html,pdf, text,etc" (required), page number as page (defauld 0), page size as per_page (default 10).
    It collects documents  from Database, depending in argument and retrun them. 
    Ex: If the page is 3 and per page is 10 , it returns 30 to 39 including 30

    :param file_type: str ("xml, html,pdf, text,etc")
    :type file_type: str
    :param page: The number of page , defaults to 0
    :type page: int, optional
    :param per_page: The size of page, defaults to 10
    :type per_page: int, optional
    :return: Dict with documents, total records length, per page , page number, 
             and error key as None or with message, if there is any error occuress.
    :rtype: dict
    """
    start = int(page) * int(per_page)
    end = int(start) + int(per_page)

    # To debug if start and end of records works well in the loop for.
    # listTmp = [i for i in range(100)]
    # print(listTmp[start:end])

    mongo_documents = list(mongo.db.documents.find(
        {"dataType": file_type}).sort("name", 1))
    total_records = len(mongo_documents)
    error = None
    documents = mongo_documents[start:end]
    for document in documents:
        if document["format"] != "link":
            link = safe_join(constants.API_BASE_URI,
                             document["format"], str(document["_id"]))
        else:
            link = document["link"]

        clinical_cases = list(mongo.db.clinical_cases.find({"source_id":
                                                            document["_id"]}, {"location_id": 0}))

        for case in clinical_cases:
            case.update({"_id": str(case["_id"]),
                         "source_id": str(case["source_id"]),
                         })
            try:
                for version in case["versions"]:
                    version.pop('location_id', None)
            except:
                pass

        document.update({"_id": str(document["_id"]),
                         "link": link,
                         "clinical_cases": clinical_cases})

    data = {
        "documents": documents,
        "totalRecords": total_records,
        "currentPage": page,
        "perPage": per_page,
        "error": error,
    }

    return data
