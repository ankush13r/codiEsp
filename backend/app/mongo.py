import os
import glob
import argparse
from typing import List

import constants
from pymongo import MongoClient

CLIENT = MongoClient('localhost:27017')
DB = CLIENT["codiEsp"]
COL_DOCUMENTS = DB["documents"]


def save_to_mong(json_objs_list):

    for  json_obj in json_objs_list:
        try:
            found = list(COL_DOCUMENTS.find(json_obj))
            if not found:
                COL_DOCUMENTS.insert(json_obj)
                
            else:
                print("\nAlready exist -> ", json_obj["path"])
        except Exception as err:
            print("Error: ", err)



def get_json(file:str, data_format:str) -> List[dict]:
    """ It recevies a file with abslout path and data format like [pdf, xml, html, etc].
        It creates a json object with file path , name , links ,ect and save into mongoDB.

        :param collection: Absolute path for file.
        :type collection: string
        :param collection: Format of file like ["xml","html","text",etc].
        :type collection: string  
        :return: List[Dict]      
    """
    
    folder_name = os.path.basename(os.path.dirname(file))
    json_objs_list = []

    # If the content format is link, so it read all link and run a loop to create a json object of each link
    if data_format == constants.TYPE_LINK:
        with open(file) as input_file:
            for link in input_file.readlines():
                link = link.strip()

                if link[-1] == "/":
                    link_name = link.split("/")[-2][0:20]
                else:
                    link_name = link.split("/")[-1][0:20]

                json_obj = {
                    "format": data_format,
                    "type": folder_name,
                    "name": link_name,
                    "path": file,
                    "docClass": None,
                    "license": None,
                    "source": None,
                    "link": link
                }
                
                json_objs_list.append(json_obj)
                
    # If the content format is not link, it will create a json object based on the file and save into mongo.
    else:
        name = os.path.basename(file)
        json_obj = {
            "format": data_format,
            "type": folder_name,
            "name": name,
            "path": file,
            "docClass": None,
            "license": None,
            "source": None,
            "link": None
        }
        
        json_objs_list = [json_obj]

    # Return list of json.
    return json_objs_list

def docs_list_to_mongo(input_file, data_format):

    files = glob.glob(input_file + '/*')

    for i, file in enumerate(files):
        if os.path.isdir(file):
            print("folder: ", i+1," ->",file)
            docs_list_to_mongo(file, data_format)
        else:
            print("file: ", i+1)
            json_objs_list = get_json(file, data_format)
            save_to_mong(json_objs_list)




def main(input_list, data_format):

    for input_file in input_list:
        docs_list_to_mongo(os.path.abspath(input_file), data_format)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog='', usage='%(prog)s -b /example/folder')
    parser.add_argument('-i', '--input', metavar='', nargs='+', type=str, required=True, help="""Input folder or file from where it will collect data recursively.
                    The type of data will be same as it's folder name""")
    parser.add_argument('-f', '--format', metavar=constants.formats, choices=constants.formats,type=str, required=True,
                        help='Format of data, it is necessary, because api  send response depending on each format.')

    arguments = parser.parse_args()
    input_list = arguments.input
    data_format = arguments.format

    main(input_list, data_format)


#########################################################################################

# def getDocsList(base_path,data_format):
#     jsonObjList = []
#     absPath = os.path.abspath(base_path)

#     folders = [{"folder_name": file, "folder_path": os.path.join(
#         absPath, file)} for file in os.listdir(absPath)]

#     for folder in folders:
#         content_folder = folder["folder_path"]
#         folder_name = folder["folder_name"]

#         if(folder_name != "link"):
#             for file in os.listdir(content_folder):
#                 obj = {
#                     "format": folder["folder_name"],
#                     "name": file,
#                     "path": os.path.join(content_folder, file),
#                     "docClass": None,
#                     "license": None,
#                     "source": None,
#                 }
#                 jsonObjList.append(obj)
#         else:
#             for file in os.listdir(content_folder):
#                 file_path = os.path.join(content_folder, file)
#                 with open(file_path) as f:
#                     for link in f.readlines():
#                         link = link.strip()
#                         link_name = ""
#                         if link[-1] == "/":
#                             link_name = link.split("/")[-2][0:20]
#                         else:
#                             link_name = link.split("/")[-1][0:20]

#                         obj = {
#                             "format":data_format,
#                             "type": folder["folder_name"],
#                             "name": link_name,
#                             "path": os.path.join(content_folder, file),
#                             "docClass": None,
#                             "license": None,
#                             "source": None,
#                             "link": link
#                         }
#                         jsonObjList.append(obj)
#     return jsonObjList
