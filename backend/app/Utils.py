#!/usr/bin/env python
# encoding: utf-8

import glob
import os

import Constants


class Documents:
    docs = dict()
    path = {
        Constants.TYPE_Link: "../data/link/*",
        Constants.TYPE_HTML: "../data/html/*",
        Constants.TYPE_PDF: "../data/pdf/*",
        Constants.TYPE_Text: "../data/text/*",
    }

    def __init__(self):
        self.docs[Constants.TYPE_Link] = self.get_docs(Constants.TYPE_Link)
        self.docs[Constants.TYPE_PDF] = self.get_docs(Constants.TYPE_PDF)
        self.docs[Constants.TYPE_HTML] = self.get_docs(Constants.TYPE_HTML)

    def get_docs(self, fileType):
        files = [os.path.abspath(file)
                 for file in glob.glob(self.path.get(fileType))]
        
        return list(set(files))

    def getFilesObj(self, fileType:str, page:int, per_page:int):

        start = (int(page)-1) * int(per_page)
        end =  int(start) + int(per_page)-1
        
        files = self.docs[fileType]
        dataList = []
        if fileType == Constants.TYPE_Link:
            for file in files:
                with open(file) as f:
                    tmpLinks = [{"path":file,"source":link.strip()} for link in f.readlines()]
                    dataList = dataList + tmpLinks
        else:
            dataList =  files
        

        file_objs = []
        for data in dataList[start:end]:
            
            if fileType == Constants.TYPE_Link:
                path = data["path"]
                fileSource = data["source"]
                if data["source"][-1] == "/":
                    name = data["source"].split("/")[-2]
            else:
                path = data
                fileSource = None
                name = data.split("/")[-1]

            obj = {
                "name": name,
                "file_type": fileType,
                "path": path,
                "source": fileSource,
                "target": "",
                "error": None
            }
            file_objs.append(obj)

        total_records = len(files)
        data = {
            "totalRecords" :total_records,
            "currentPage": page,
            "perPage": per_page,
            "data":file_objs
        }
        return data

