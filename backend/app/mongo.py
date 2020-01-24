from api import mongo



# try:
#         if not id:
#             data_to_save = dict({"data_type": data_type,
#                                  "file_name": file_name,
#                                  "source_path": source_path,
#                                  "versions": [
#                                      {
#                                          "time": time,
#                                          "clinical_case": clinical_case,
#                                          "meta_data": meta_data
#                                      }],
#                                  "clinical_case": clinical_case,
#                                  })

#             if data_type == constants.TYPE_LINK:
#                   link = request_data["link"].strip()
#                   data_to_save.update({"link": link})
                  
#             result = mongo.db.clinical_cases.insert_one(data_to_save)
#             request_data.update({"id": str(result.inserted_id)})
#             result_to_send 
#         else:
#             id = id.strip()
#             clinical_case_to_list = {"time": time,
#                                      "clinical_case": clinical_case,
#                                      "meta_data": meta_data
#                                      }

#             result = mongo.db.clinical_cases.update({"_id": ObjectId(id)},
#                                            {"$addToSet": {"versions": clinical_case_to_list},
#                                             "$set": {"clinical_case": clinical_case}}
#                                             )


#             if result:
#                 request_data.update({"id": str(result.get("n"))})
#             else:
#                 request_data.update({"id": str(id)})

#             request_data.update({"id": str(result.inserted_id)})

#     except Exception as err:
#         print(err)
#         mongo.db.errors.insert_one(
#             {"client_data": str(data_to_save), "error": str(err)})

#         result_to_send = request_data.update({"error":
#                                               {"message": str(err),
#                                                "type": "mongo_exception"}
#                                               })

