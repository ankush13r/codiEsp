import re
import os
import glob
import copy
import json

from flask import safe_join
from bson.objectid import ObjectId
from api import mongo

import constants

FILE_CONST = "./data/constants.json"


# def get_constants():
#     global get_content

#     jsonObj = {}
#     time = 0

#     def get_content():
#         with open(FILE_CONST) as inputF:
#             content = inputF.read()
#             jsonObj = json.loads(content)
#             return jsonObj

#     def retrun_content():
#         time1 = os.path.getatime(FILE_CONST)
#         if time1 == time:
#             print(time)
#         else:
#             return jsonObj

#     if time < os.path.getmtime():
#         get_content = get_content
#     else:
#         get_content = get_content

#     return get_content




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

    for term in constants.START_CASE_TERMS:
        found = re.search(term, content, flags=re.U | re.I)
        if found:
            content = re.sub(str(found.group(
            )), '<span style="background:rgba(6, 247, 255, 0.5); padding:5px;">'+str(found.group())+'</span>', content)
            break

    for term in constants.END_CASE_TERMS:
        found = re.search(term, content, flags=re.U | re.I)
        if found:
            content = re.sub(str(found.group(
            )), '<span style="background:rgba(255, 6, 6, 0.5); padding:5px;">'+str(found.group())+'</span>', content)
            break

    return content


def get_caseI_id(source_id):
    new_case_id = 0
    results = list(mongo.db.clinical_cases.find(
        {"source_id": source_id}, {"_id": 0, "case_id": 1}))
    case_ids = [result.get("case_id") for result in results]

    try:
        maxNum = max(case_ids)
        new_case_id = maxNum + 1
    except:
        pass

    return new_case_id


def get_version_id(_id):
    new_v_id = 0
    results = mongo.db.clinical_cases.find_one(
        {"_id": _id}, {"_id": 0, "versions": 1})
    v_ids = [result["id"] for result in results["versions"]]
    try:
        maxNum = max(v_ids)
        new_v_id = maxNum + 1
    except:
        pass

    return new_v_id


def valid_mongo_query(json):
    v_id = 0
    _id = json.get("_id")

    if _id:
        _id = ObjectId(_id)

    source_id = ObjectId(json["source_id"])
    caseText = json["clinical_case"]
    time = int(json["time"])
    user_id = json["user_id"]
    loc = json["location"]

    caseObj = {"clinical_case": caseText, "time": time,
               "user_id": user_id, "location": loc}

    yes_no = json.get("yes_no")
    if yes_no:
        caseObj.update({"yes_no": yes_no})

    if _id:
        v_id = get_version_id(_id)
        version = copy.deepcopy(caseObj)
        version.update({"id": v_id})

        caseObj.update({"source_id": source_id})
        query = {
            "$addToSet": {"versions": version},
            "$set": caseObj,
        }
    else:
        case_id = get_caseI_id(source_id)
        version = copy.deepcopy(caseObj)
        version.update({"id": 0})

        caseObj.update(
            {"versions": [version], "source_id": source_id, "case_id": case_id})
        query = caseObj

    return _id, query


def get_documents(file_type: str, page: int = 0, per_page: int = 10):
    start = int(page) * int(per_page)
    end = int(start) + int(per_page)

    # To debug if start and end of records works well in the loop for.
    # listTmp = [i for i in range(100)]
    # print(listTmp[start:end])

    mongo_documents = list(mongo.db.documents.find(
        {"type": file_type}).sort("name", 1))
    total_records = len(mongo_documents)
    error = None
    documents = mongo_documents[start:end]
    print(documents[1:10])
    for document in documents:
        if document["format"] != "link":
            link = safe_join(constants.API_BASE_URI,
                             document["format"], str(document["_id"]))
        else:
            link = document["link"]

        clinical_cases = list(mongo.db.clinical_cases.find({"source_id":
                                                            document["_id"]}))

        for case in clinical_cases:
            case.update({"_id": str(case["_id"]),
                         "source_id": str(case["source_id"]),
                         })

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
