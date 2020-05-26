import re
import os
import glob
import copy
import json

from flask import safe_join, abort, jsonify, send_file
from bson.objectid import ObjectId

from app import constants
from app.utils.mongo import mongo
from app.utils import utils

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
    locationId = utils.get_location(ip)
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

    query = {}

    # If the _id exist it means the document already exist and it will create a query to update that document
    if _id:
        _id = ObjectId(_id)
        # create a new id for the version.
        v_id = utils.get_next_sequence("case_version_"+str(_id), 1)

        # update the version with it's new id.
        caseVersion.update({"id": v_id})
        if not mongo.db.clinicalCases.find_one({"_id": ObjectId(_id)}, {"selectedVersionId": 1, "_id": 0}):
            query.update({"$set": {
                "clinicalCase": caseText,
                "hpoCodes": hpoCodes
            }})

        # Uncomment to update sourceId into the caseObj.
        # Even if it's not necessary because if case already exists, it means it must have id.
        # caseObj.update({"sourceId": sourceId})

        # new mongo query to update the document by id. Version to add into the list of versions.
        # And all other key with new values (caseObj).
        query.update({
            "$addToSet": {"versions": caseVersion},
        })
    # If the _id doesn't exist it means it is a new document.
    # So it creates a mongo query to insert the document.
    else:

        # create a new id for the document by sourceId. It is an alternative id.
        case_id = utils.get_next_sequence("case_id_"+str(sourceId))

        # update the version with it's new id as 0. If the document (clinical case) is new, means it hasn't any version yet.
        caseVersion.update({"id": 0})

        # Update the object with version as list. sourceId (It's origen document's id, that is already in DB), and case_id.
        query.update(
            {"versions": [caseVersion],
             "sourceId": sourceId,
             "case_id": case_id,
             "clinicalCase": caseText,
             "hpoCodes": hpoCodes})

    # _id maybe none, if it was new document.
    return _id, query


def save_data(json):
    print(json)
    """ A request must be similar to the next example,
        those keys contain a interrogate symbole (?) are not required.
    """

    try:
        if json.get("_id"):
            ObjectId(json.get("_id"))

        json["clinicalCase"]
        json["user_id"]
        json["hpoCodes"]
        json["ip"]
    except:
        abort(400, "Missing data.")

    try:
        int(json["time"])
    except:
        abort(406, "Missing time as type integer.")

    try:
        isNew = False

        _id, query = valid_mongo_query(json)
        if _id:
            result = mongo.db.clinicalCases.update_one({"_id": _id}, query)
        else:
            inserted_result = mongo.db.clinicalCases.insert_one(query)
            _id = inserted_result.inserted_id
            isNew = True

        if isNew or result.modified_count > 0:
            mongoObj = mongo.db.clinicalCases.find_one({"_id": _id})

            mongo.db.documents.update_one({"_id": mongoObj["sourceId"]}, {
                "$set": {"state": 0}})

            mongoObj.update({"_id": str(mongoObj["_id"]),
                             "sourceId": str(mongoObj["sourceId"])
                             })

            try:
                for version in mongoObj["versions"]:
                    version.update(
                        {"locationId": str(version["locationId"])})
            except:
                pass

            result_to_send = mongoObj
        else:
            return abort(400, "Couldn't update, may the mongo _id is invalid.")

    except Exception as err:
        return abort(500, f"Internal server error: {err} Please try again or contact us")

    return result_to_send


def get_documents(file_type: str, args):
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

    # To debug if start and end of records works well in the loop for.
    # listTmp = [i for i in range(100)]
    # print(listTmp[start:end])

    # Getting valid page number and page length , by calling a function form utils.
    page, per_page, start, end = utils.get_valid_pagination_args(args)

    file_type = file_type.strip()

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


def get_document(data_type, _id):

    data_type = data_type.strip()
    file_path = mongo.db.documents.find_one({"_id": ObjectId(_id)}).get("path")

    # If document format is link, then send a error
    if data_type == constants.TYPE_LINK or not file_path:
        abort(404)

    # If document format is text of html, then it will give css style to text and send as string.
    elif data_type == constants.TYPE_HTML or data_type == constants.TYPE_TEXT:
        content = read_file(file_path)
        if content:
            modified_content = modifyText(content)
            return str(modified_content)
        else:
            abort(404)
    # Otherwise sent file. It maybe like pdf, etc.
    else:
        return send_file(file_path)


def finish_document(json):
    _id = ObjectId(json["_id"])

    try:
        result = mongo.db.documents.update({"_id": _id, },
                                           {"$set": {"state": 1}})

        return jsonify({"data": result["nModified"]})

    except Exception as err:
        abort(500, str(err))


def get_types():
    """Return a list of documents types.

    :return: A list of all types of documents available in mongoDB.
    :rtype: List
    """
    try:
        return list(mongo.db.documents.distinct("dataType"))
    except:
        abort(500)
