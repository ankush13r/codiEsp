import re
import os
import glob
import copy
import json

from flask import safe_join
from bson.objectid import ObjectId

import geoip2.database
from app import constants
from app.mongo import mongo
from app.shared import utils as shared_utils

FILE_CONST = "./data/constants.json"


def read_file(file_path):
    """ Function to read file passed by argument. Returns the content of file.
        If it can't read file than return None.
    """
    try:
        with open(file_path, "r") as iFile:
            content = iFile.read()
            return content
    except:
        return None


def modifyText(content):
    """Method to modify the text received as parameter and return it modified.
     It modifies the text by adding it some html style as highlights(background).
     It serves to show user that where start or end the important information in the text.
     All regex are saved in mongoDB.
    """

    # Html style to preserve break lines as they are, because normalky break lines are chopped in html (web).
    pre_line_style = """ style="line-height:1.6em; text-align: justify;  white-space:pre-line; font-family: 'Open Sans';" """
    regex_type_list = list(mongo.db["regexType"].find())

    content = re.sub(r"</?(span|mark|q|b).*?>", "", content)
    content = re.sub(r"</?.*?>", "\n", content, flags=re.M)

    content = re.sub(r"(\r?\n(\s|\r|\n|&#13;)+)+", "\n\n", content)
    content = re.sub(r"^\s*", "", content)

    found_list = []
    for r_type in regex_type_list:
        regex_list = list(mongo.db["regex"].find(
            {"type_id": r_type["_id"]}).sort("order", 1))

        found = False
        for regex_obj in regex_list:
            if regex_obj["ignoreCase"]:
                regex = re.compile(
                    f'({regex_obj["value"]})', flags=re.IGNORECASE | re.UNICODE | re.S)
            else:
                regex = re.compile(
                    fr'({regex_obj["value"]})',  re.UNICODE | re.S)

            regex_found_list = list(regex.finditer(content)) or []
            for regex_found in regex_found_list[:r_type["count"]]:
                found = True
                found_list.append({
                    "start": regex_found.span()[0],
                    "end": regex_found.span()[1],
                    "text": regex_found.group(),
                    "style": r_type["style"]
                })

            if found and r_type["_id"] == "1.0":
                break

    found_list_shorted = sorted(found_list, key=lambda k: k['start'])
    old_length = len(content)
    last_end = -1

    for found in found_list_shorted:
        print(found)
        text = found["text"]
        style = found["style"]

        plus = len(content) - old_length

        start = found["start"]
        end = found["end"]

        to_start = start + plus
        to_end = end + plus

        if start > last_end:
            content = f'{content[:to_start]}<span {style}>{text}</span>{content[to_end:]}'

        last_end = end


#  content_tuple = regex.subn(
        # fr'<span {r_type["style"]}>\1</span>', content, r_type["code"]

    return f"<span {pre_line_style}>{content}</span>"


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
        print(err)
        pass

    return _id


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
    sourceId = ObjectId(json["sourceId"])
    caseText = json["clinicalCase"]
    time = int(json["time"])
    user_id = json["user_id"]
    hpoCodes = json["hpoCodes"]
    ip = json["ip"]
    # Getting location id from DB
    locationId = get_location(ip)
    # Case object to save into the DB.
    caseVersion = {"clinicalCase": caseText,
                   "hpoCodes": hpoCodes
                   }

    yes_no = json.get("yes_no")
    # If json request contains yes_no key it updates the caseObj dict with it.
    if yes_no:
        caseVersion.update({"yes_no": yes_no})

    # Cloning the object as version. deepcopy makes a copy of object, recursively.
    # "https://docs.python.org/2/library/copy.html"
    # version = copy.deepcopy(caseObj)

    caseVersion.update({"time": time,
                        "user_id": user_id,
                        "locationId": locationId})

    caseObj = {}

    # If the _id exist it means the document already exist and it will create a query to update that document
    if _id:
        _id = ObjectId(_id)
        # create a new id for the version.
        v_id = shared_utils.get_next_sequence("case_version_"+str(_id), 1)

        # update the version with it's new id.
        caseVersion.update({"id": v_id})
        if not mongo.db.clinicalCases.find_one({"_id": ObjectId(_id)}, {"selectedVersionId": 1, "_id": 0}):
            caseObj = {
                "clinicalCase": caseText,
                "hpoCodes": hpoCodes
            }

        # Uncomment to update sourceId into the caseObj.
        # Even if it's not necessary because if case already exists, it means it must have id.
        # caseObj.update({"sourceId": sourceId})

        # new mongo query to update the document by id. Version to add into the list of versions.
        # And all other key with new values (caseObj).
        query = {
            "$addToSet": {"versions": caseVersion},

        }
        query.update({"$set": caseObj})
    # If the _id doesn't exist it means it a new document.
    # So it creates a mongo query to insert the document.
    else:

        # create a new id for the document by sourceId. It is an alternative id.
        case_id = shared_utils.get_next_sequence("case_id_"+str(sourceId))

        # update the version with it's new id as 0. If the document (clinical case) is new, means it hasn't any version yet.
        caseVersion.update({"id": 0})

        # Update the object with version as list. sourceId (It's origen document's id, that is already in DB), and case_id.
        caseObj.update(
            {"versions": [caseVersion],
             "sourceId": sourceId,
             "case_id": case_id,
             "clinicalCase": caseText,
             "hpoCodes": hpoCodes})
        query = caseObj

    # _id maybe none, if it was new document.
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
        link = None
        if document["format"] == "link":

            link = document["link"]

        clinicalCases = list(mongo.db.clinicalCases.find(
            {"sourceId": document["_id"]}, {"locationId": 0}
        ))

        for case in clinicalCases:
            case.update({"_id": str(case["_id"]),
                         "sourceId": str(case["sourceId"]),
                         })
            try:
                for version in case["versions"]:
                    version.pop('locationId', None)
            except:
                pass

        document.update({"_id": str(document["_id"]),
                         "link": link,
                         "clinicalCases": clinicalCases})

    data = {
        "documents": documents,
        "totalRecords": total_records,
        "currentPage": page,
        "perPage": per_page,
        "error": error,
    }

    return data


# def get_version_id(_id):
#     """ Function to create new clinical case's version id by case, because a clinical case can have more than one version.
#         So first of all it will get ids of all versions related to the _id of clinical case, received as parameter.
#         And after it will create a new id and return it.
#     """
#     new_v_id = 0

#     # get all versions related to the case id received as parameter.
#     results = mongo.db.clinicalCases.find_one(
#         {"_id": _id}, {"_id": 0, "versions": 1})

#     try:
#         # All versions ids, it may empty if there is no result
#         v_ids = [result["id"] for result in results["versions"]]

#         # New id is maximum number + 1 from ids list, if the ids list is empty than new id is 0.
#         maxNum = max(v_ids)
#         new_v_id = maxNum + 1
#     except:
#         pass

#     return new_v_id


# def get_case_id(sourceId):
#     """ Function to create new case id by sourceId, because a source can have more than one clinical case.
#         So first of all it will get ids of all clinical cases related to the sourceId, received as parameter.
#         And after it will create a new id and return it.
#     """
#     new_case_id = 0
#     # get all clinical cases related to the sourceId received as parameter
#     results = list(mongo.db.clinicalCases.find(
#         {"sourceId": sourceId}, {"_id": 0, "case_id": 1}))

#     try:
#         # All clinical cases ids, it may empty if there is no result
#         case_ids = [result.get("case_id") for result in results]

#         # New id is maximum number + 1 from ids list, if the ids list is empty than new id is 0.
#         maxNum = max(case_ids)
#         new_case_id = maxNum + 1
#     except:
#         pass

#     return new_case_id
