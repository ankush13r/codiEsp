from app import constants
from app.mongo import mongo
from bson.objectid import ObjectId
from pymongo.errors import InvalidId
from pymongo import DESCENDING, ASCENDING
from operator import itemgetter


def get_data(page: int = 0, per_page: int = 10, sort_column: str = "--"):

    start = int(page) * int(per_page)
    end = int(start) + int(per_page)

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

    return data


def delete_case(case_id):
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
        response = [False, str(err)]

    return response


def modify_selected_version(case_id, obj):
    selected_version_id = obj.get("selectedVersionId", None)

    try:
        obj = mongo.db.clinicalCases.find_one({"_id": ObjectId(case_id)})
        setObj = {}

        if selected_version_id:
            version_obj = [version for version in obj["versions"]
                           if version["id"] == selected_version_id][0]
        else:
            version_obj = sorted(obj.get("versions"),
                                 key=itemgetter('time'))[-1]

        setObj.update(
            {
                "clinicalCase": version_obj["clinicalCase"],
                "hpoCodes": version_obj["hpoCodes"],
                "selectedVersionId": selected_version_id
            })

        result = mongo.db.clinicalCases.update_one(
            {"_id": ObjectId(case_id)},
            {"$set": setObj}

        )

        response = [result.modified_count == 1]
    except Exception as err:
        response = [False, str(err)]

    print(response)
    return response

def delete_version(case_id, version_id):
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
        response = [False, str(err)]

    try:
        if response[0]:
            obj = mongo.db.clinicalCases.find_one(
                {"_id": ObjectId(case_id)})

            versions = sorted(obj.get("versions") or [],
                              key=itemgetter('time'))
            if len(versions) == 0:
                res = delete_case(case_id)
                if not res[0]:
                    response.append(str(err))

            elif len(versions) > 0 and obj.get("selectedVersionId") == version_id:
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
        response.append(str(err))

    return response


def patchVersion(case_id, version_id, obj):
    setObj = {}

    if obj.get("clinicalCase"):
        setObj.update({"versions.$.clinicalCase": obj["clinicalCase"]})

    if obj.get("hpoCodes"):
        setObj.update({"versions.$.hpoCodes": obj["hpoCodes"]})

    if obj.get("time"):
        setObj.update({"versions.$.time": obj["time"]})

    print(setObj)
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
        response.append(str(err))

    return response
