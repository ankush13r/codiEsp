#!/usr/bin/env python
# encoding: utf-8

import glob
import os

import constants
from api import mongo

def get_data_list(fileType: str, page: int = 1, per_page: int = 10):

    start = (int(page)-1) * int(per_page)
    end = int(start) + int(per_page)
    path = constants.PATHS_TO_DIR.get(fileType)
    # files = [os.path.abspath(file) for file in glob.glob(path)]
    
    if (path) and os.path.isdir(path):
        files = os.listdir(path)
        error = None
    else:
        files = []
        error = {"message":"Error 404: Bad request, the path is wrong"}
    dataList = []

    if fileType == constants.TYPE_LINK:
        for file in files:
            file_path = os.path.join(path, file)
            with open(file_path) as f:
                dataList += [{"fileName":file,"link":link.strip()} for link in f.readlines()]
    else:
        dataList = files

    file_obj_list = []
    
    #To debug if start and end of records works well in the loop for.
    # listTmp = [i for i in range(100)]
    # print(listTmp[start:end])

    for data in dataList[start:end]:

        if file_type == constants.TYPE_LINK:
            name = data["fileName"]
            link = data["link"]
        else:
            name = data 
            link = None

        # mongo.db.clinical_case.find_one({"directory_path":path,"type":file_type})
        obj = {
            "name": name,
            "link": link,
            "type": file_type,
            "path":path ,       
            "target": ""
        }
        file_obj_list.append(obj)

    total_records = len(dataList)
    data = {
        "documents": file_obj_list,
        "totalRecords": total_records,
        "currentPage": page,
        "perPage": per_page,
        "error": error,
    }
    return data


