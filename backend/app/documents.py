#!/usr/bin/env python
# encoding: utf-8

import glob
import os

from flask import safe_join

import constants
from api import mongo


def get_data_list(file_type: str, page: int = 0, per_page: int = 10):

    start = int(page) * int(per_page)
    end = int(start) + int(per_page)
    dir_path = constants.PATHS_TO_DIR.get(file_type)
    # files = [os.path.abspath(file) for file in glob.glob(dir_path)]

    if dir_path and os.path.isdir(dir_path):
        files = os.listdir(dir_path)
        error = None
    else:
        files = []
        error = {"message": "Error 404: Bad request, the dir_path is wrong"}
    dataList = []

    if file_type == constants.TYPE_LINK:
        for file in files:
            file_path = os.path.join(dir_path, file)
            with open(file_path) as f:
                dataList += [{"file_name": file, "link": link.strip()}
                             for link in f.readlines()]
    else:
        dataList = files

    data_obj_list = []

    # To debug if start and end of records works well in the loop for.
    # listTmp = [i for i in range(100)]
    # print(listTmp[start:end])

    for data in dataList[start:end]:
        mongo_obj = None
        data_obj = {}
        if file_type == constants.TYPE_LINK:
            file_name = data["file_name"]
            link = data["link"]
            if link[-1] == "/":
                link_name = link.split("/")[-2][0:22]
                data_obj.update({"link_name": link_name})
            else:
                link_name = link.split("/")[-1][0:22]
                data_obj.update({"link_name": link_name})

            source_path = safe_join(dir_path, file_name.strip())
            mongo_obj = mongo.db.clinical_cases.find_one(
                {"source_path": source_path, "link": link})
        else:
            file_name = data
            source_path = safe_join(dir_path, file_name.strip())
            # First of all it will check, if the document already had been inserted,
            mongo_obj = mongo.db.clinical_cases.find_one(
                {"source_path": source_path})
            link = safe_join(constants.API_BASE_URI, file_type, file_name)

        # mongo.db.clinical_case.find_one({"directory_path":path,"type":file_type})
        data_obj.update({
            "file_name": file_name,
            "link": link,
            "data_type": file_type,
            "clinical_cases": [
                {"mongo_id": "1111",
                 "case_id": 1,
                 "clinical_case": "aaaaaaa",
                 "yes_no": "si",
                 "versions": [
                     {"id": 1,
                      "clinical_case": "fsdfsdfsdfsd",
                      "yes_no": "si",
                      "time": 124884578},
                     {"id": 2,
                      "clinical_case": "adfdsfsdfs",
                      "yes_no": "si",
                      "time": 45121247}
                 ]},
                {"mongo_id": "2222",
                 "case_id": 2,
                 "yes_no": "no",
                 "clinical_case": "ddddddd",

                 "versions": [
                     {"id": 1,
                      "clinical_case": "sfsdfsfs",
                      "yes_no": "si",
                      "time": 10512124}
                 ]
                 }
            ]
        })

        if mongo_obj:
            data_obj.update({"id": str(mongo_obj["_id"]),
                             "clinical_case": [{"mongo_id": "1111",
                                                "case_id": 1,
                                                "clinical_case": mongo_obj["clinical_case"],
                                                "yes_no": mongo_obj.get("yes_no"),
                                                "versions": mongo_obj.get("versions"),
                                                },
                                               {"mongo_id": "2222",
                                                "case_id": 2,
                                                "clinical_case": "ssss",
                                                "yes_no": "no",
                                                }
                                               ]})

        data_obj_list.append(data_obj)

    total_records = len(dataList)
    data = {
        "documents": data_obj_list,
        "totalRecords": total_records,
        "currentPage": page,
        "perPage": per_page,
        "error": error,
    }

    return data


def getDocuments(file_type: str, page: int = 0, per_page: int = 10):
    start = int(page) * int(per_page)
    end = int(start) + int(per_page)

    # To debug if start and end of records works well in the loop for.
    # listTmp = [i for i in range(100)]
    # print(listTmp[start:end])

    mongo_documents = list(mongo.db.documents.find(
        {"format": file_type}).sort("name", 1))
    total_records = len(mongo_documents)

    error = None
    documents = mongo_documents[start:end]
    for document in documents:
        
        if document["format"] != "link":
            link = safe_join(constants.API_BASE_URI, document["format"], document["name"])
        else:
            link = document["link"]

        clinical_cases = list(mongo.db.clinical_cases.find({"source_id":
                                                            document["_id"]}))

        for case in clinical_cases:
            case.update({
                "_id": str(case["_id"]),
                "source_id": str(case["source_id"]),
                
            })

        document.update({"_id": str(document["_id"]),
        "link":link,
                         "clinical_cases": clinical_cases})

    data = {
        "documents": documents,
        "totalRecords": total_records,
        "currentPage": page,
        "perPage": per_page,
        "error": error,
    }

    return data
