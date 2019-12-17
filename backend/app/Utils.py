#!/usr/bin/env python
# encoding: utf-8

import glob
import os

import Constants


class Utils:
    @staticmethod
    def get_docs(type, args = None):
        files = [os.path.abspath(file) for file in glob.glob(Constants.PATH.get(type))]
        totalRecords = len(files)
        listObj =  Utils.getObjList(files[1:10], type)

        return {
            "totalRecords":totalRecords,
            "currentPage":1,
            "files":listObj
        }

    @staticmethod
    def getObjList(files,type):
        listObj = []

        for file in files:
            obj = {
            "name": file.split("/")[-1],
            "type": type,
            "path":file,
            "source":"string",
            "target":"string",
            "error":None
            }
            listObj.append(obj)
        return listObj


