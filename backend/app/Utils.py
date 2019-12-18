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
        Constants.TYPE_Text: "../data/pdf/*",
    }

    def __init__(self):
        self.docs[Constants.TYPE_Link] = list(self.get_docs(Constants.TYPE_Link))
        self.docs[Constants.TYPE_PDF] = list(self.get_docs(Constants.TYPE_PDF))
        self.docs[Constants.TYPE_HTML] = list(self.get_docs(Constants.TYPE_HTML))

    def get_docs(self, fileType):
        files = [os.path.abspath(file)
                 for file in glob.glob(self.path.get(fileType))]

        listData = []
        if fileType == Constants.TYPE_Link:
            for file in files:
                with open(file) as f:
                    tmpLinks = [link.strip() for link in f.readlines()]
                    listData = listData + tmpLinks
        else:
            listData = files
        return set(listData)

    def getFilesObj(self, fileType:str, page:int, per_page:int):

        start = (int(page)-1) * int(per_page)
        end =  int(start) + int(per_page)-1

        files = self.docs[fileType]
        fileObjs = []
        for file in files[start:end]:
            fileSource = None
            name = file.split("/")[-1]
            
            if fileType == Constants.TYPE_Link:
                fileSource = file
                if file[-1] == "/":
                    name = file.split("/")[-2]

            obj = {
                "name": name,
                "file_type": fileType,
                "path": file,
                "source": fileSource,
                "target": "",
                "error": None
            }
            fileObjs.append(obj)

        total_records = len(files)
        data = {
            "total_records" :total_records,

        }
        return fileObjs

