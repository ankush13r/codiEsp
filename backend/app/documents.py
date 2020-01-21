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
            if link[-1]=="/":
                data_obj.update({"link_name":(link.split("/")[-2])})
            else:
                data_obj.update({"link_name":(link.split("/")[-1])})
                            
            
            
            source_path = safe_join(dir_path, file_name.strip())
            mongo_obj = mongo.db.clinical_cases.find_one({"source_path":source_path, "link":link})
        else:
            file_name = data
            source_path = safe_join(dir_path, file_name.strip())
            # First of all it will check, if the document already had been inserted, 
            mongo_obj = mongo.db.clinical_cases.find_one({"source_path":source_path})
            link = safe_join(constants.API_BASE_URI,file_type, file_name) 

        # mongo.db.clinical_case.find_one({"directory_path":path,"type":file_type})
        data_obj.update({
            "file_name": file_name,
            "link": link,
            "data_type": file_type,
            "clinical_case": ""
        })

        if mongo_obj:
            data_obj.update({"doc_id": str(mongo_obj["_id"]),
                             "clinical_case": mongo_obj["clinical_case"],
                             "old_versions" :mongo_obj.get("old_versions"),
                             "yes_no" :mongo_obj.get("yes_no")})

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

