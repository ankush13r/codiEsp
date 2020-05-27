"""Controller file for clinical_data.py. All request of clinical_data.py will be controll in this file.
"""

from app import constants
from app.utils.mongo import mongo
from bson.objectid import ObjectId
from pymongo.errors import InvalidId
from pymongo import DESCENDING, ASCENDING
from operator import itemgetter
from flask import abort

from app.utils import utils


def get_data(args):
    """This method serve to return document those as clinical cases. 
    These document will include it's clinical cases.
    If it throw any exception than it will return exception with code 500.
    """
    try:
        #Getting valid pagination valid argument by calling a function from app.utils.utils
        page, per_page, start, end = utils.get_valid_pagination_args(args)
        sort_column = args.get("sort_column", "--")

        # If mongo object is None, it gets a empty list [].
        mongo_data_list = list(
            mongo.db.clinicalCases.find().sort(sort_column, 1) or [])
        total_records = len(mongo_data_list)
        data_list = mongo_data_list[start:end]

        docs_id_list = [doc["sourceId"] for doc in mongo.db.clinicalCases.find(
            {}, {"_id": 0, "sourceId": 1})]

        # Changing mongo's object _id and sourceId into string of all objects.
        mongo_documents = list(mongo.db.documents.find(
            {"_id": {"$in": docs_id_list}}))

        total_records = len(mongo_documents)
        error = None
        documents = mongo_documents[start:end]

        # Add clinical cases to the documents finding from mongoDB.
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
        }
    except Exception as err:
        return abort(500, str(err))

    return data


def delete_case(case_id):
    """This function is to delete a clinical case by it's id received as parameter.
        If all correct then it will return [true], otherwis a [false].
        But if it throw any exception than it will return exception with code 500.
    """

    response = [False]

    try:
        source_id = mongo.db.clinicalCases.find_one(
            {"_id": ObjectId(case_id)}).get("sourceId")
        result = mongo.db.clinicalCases.delete_one({"_id": ObjectId(case_id)})
        response = [result.deleted_count == 1]

        if source_id:
            records = mongo.db.clinicalCases.find(
                {"sourceId": source_id}).count()
            if records == 0:
                mongo.db.documents.update(
                    {"_id": source_id},
                    {"$unset": {"state": ""}}
                )
            doc = mongo.db.clinicalCases.find_one({"_id": source_id})

    except Exception as err:
        return abort(500, str(err))

    return response


def modify_selected_version(case_id, obj):
    """This function is to modify a clinical case version by case id and version id received as parameter.
        It will modify the version depending on data and  it must receve a json data with valid keys.
        If all correct then it will return [true], otherwis a [false].
        But if it throw any exception than it will return exception with code 500.
    """

    selected_version_id = obj.get("selectedVersionId", None)

    response = [True]
    try:
        res = mongo.db.clinicalCases.update_one({"_id": ObjectId(case_id)}, {
                                                "$set": {"selectedVersionId": selected_version_id}})
    except Exception as err:
        return abort(500, str(err))

    return response


def delete_version(case_id, version_id):
    """This function is to delete a clinical case version by case id and version id received as parameter.
        If all correct then it will return [true], otherwis a [false].
        But if it throw any exception than it will return exception with code 500.
    """
    response = [False]

    # Delete a version from clinical_case by id received as paramenters.
    try:
        result = mongo.db.clinicalCases.update_one(
            {
                "_id": ObjectId(case_id)
            },
            {
                "$pull":
                {
                    "versions": {"id": version_id}
                }
            })

        response = [result.modified_count == 1]
    except Exception as err:
        return abort(500, str(err))

    try:
        #If response it, it means if the version is deleted than, 
        # it will process this algorithm
        if response[0]:
            obj = mongo.db.clinicalCases.find_one(
                {"_id": ObjectId(case_id)})

            versions = sorted(obj.get("versions") or [],
                              key=itemgetter('time'))
            if len(versions) == 0:
                res = delete_case(case_id)
                if not res[0]:
                    response.append(str(err))

            elif len(versions) > 0 and obj.get("selectedVersionId") and obj.get("selectedVersionId") == version_id:
                newSelectedVersionId = versions[-1]["id"]
                selectedVersionCase = versions[-1]["clinicalCase"]
                selectedVersionHPO = versions[-1]["hpoCodes"]

                result = mongo.db.clinicalCases.update_one(
                    {"_id": ObjectId(case_id)},
                    {
                        "$unset": {"selectedVersionId": ""},
                        "$set": {
                            "hpoCodes": selectedVersionHPO,
                            "clinicalCase": selectedVersionCase}
                    }
                )
    except Exception as err:
        return abort(500, str(err))

    return response


def patchVersion(case_id, version_id, obj):
    """This function is modify a clinical case version by case id and version id received as parameter.
    It must receve a json data with valid keys.
    If all correct then it will return [true], otherwis a [false].
    But if it throw any exception than it will return exception with code 500.
    """
    setObj = {}

    if obj.get("clinicalCase"):
        setObj.update({"versions.$.clinicalCase": obj["clinicalCase"]})

    if obj.get("hpoCodes"):
        setObj.update({"versions.$.hpoCodes": obj["hpoCodes"]})

    if obj.get("time"):
        setObj.update({"versions.$.time": obj["time"]})

    response = [False]
    try:
        result = mongo.db.clinicalCases.update_one(
            {
                "_id": ObjectId(case_id), "versions.id": version_id
            },
            {
                "$set": setObj
            })

        response = [result.modified_count == 1]
    except Exception as err:
        return abort(500, str(err))

    return response

 