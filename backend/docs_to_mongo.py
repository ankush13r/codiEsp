import os
import glob
import argparse
from pymongo import MongoClient

CLIENT = MongoClient('localhost:27017')
DB = CLIENT["codiEsp"]
COL_DOCUMENTS = DB["documents"]
FORMATS= ["xml","pdf","text","link","html"]



def save_to_mongo(jsonObj):
    try:
        found = list(COL_DOCUMENTS.find(jsonObj))
        if not found:
           COL_DOCUMENTS.insert_one(jsonObj)
        else:
            print("\nAlready exist")
    except Exception as err:
        print("Error: ", err)


def get_links_json(file_path, data_format):
    dir_name = os.path.basename(os.path.dirname(file_path))

    jsonObjList = []
    with open(file_path) as f:
        for link in f.readlines():
            link = link.strip()
            name = ""
            if link[-1] == "/":
                name = link.split("/")[-2][0:20]
            else:
                name = link.split("/")[-1][0:20]

            obj = {
                "format": "link",
                "dataType": dir_name,
                "name": name,
                "path": file_path,
                "docClass": None,
                "license": None,
                "source": None,
                "link": link
            }
            jsonObjList.append(obj)
    return jsonObjList


def get_file_json(file_path, data_format):
    dir_name = os.path.basename(os.path.dirname(file_path))
    file_name = os.path.basename(file_path)
    obj = {
        "format": data_format,
        "dataType": dir_name,
        "name": file_name,
        "path": file_path,
        "docClass": None,
        "license": None,
        "source": None,
    }

    return obj


def get_data(files, data_format):
    print("Folder", files)
    print("\tGetting files....")

    for file in files:
        # If the file is a directory then it will call self function recursively.
        if os.path.isdir(file):
            newFiles = glob.glob(os.path.abspath(file+"/*"))
            get_data(newFiles, data_format)

        # If it's a file then create a json object and save into mongoDb
        else:
            # If the format is link, then create get json list of all links from each file and save into mongoDB
            print("\t\tSaving file", file)
            if data_format == "link":
                jsonObjs = get_links_json(file, data_format)
                for jsonObj in jsonObjs:
                    save_to_mongo(jsonObj)
            else:
                # If the format is not link, then it create json object of each file and save into mongoDB
                jsonObj = get_file_json(file, data_format)
                save_to_mongo(jsonObj)


def main(files, data_format):

    get_data(files, data_format)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog='docs_to_mongo', usage='%(prog)s -i [/example/folder | folder/* ] -f [link, text, html , xml]')
    parser.add_argument('-i', '--input', metavar='', nargs='+', type=str, required=True,
                        help="[N] folders of files or just files. If it receives folder/s it will get all files recursively.")
    parser.add_argument('-f', '--format', type=str,
                        metavar=FORMATS, choices=FORMATS, required=True, help="fromat for files")

    args = parser.parse_args()
    files = args.input
    data_format = args.format

    main(files, data_format)






"""
def getDocsList(base_path):
    jsonObjList = []
    absPath = os.path.abspath(base_path)

    folders = [{"folder_name": file, "folder_path": os.path.join(
        absPath, file)} for file in os.listdir(absPath)]

    for folder in folders:
        content_folder = folder["folder_path"]
        folder_name = folder["folder_name"]

        if(folder_name != "link"):
            for file in os.listdir(content_folder):
                obj = {
                    "format": _format,
                    "dataType": folder["folder_name"],
                    "name": file,
                    "path": os.path.join(content_folder, file),
                    "docClass": None,
                    "license": None,
                    "source": None,
                }
                jsonObjList.append(obj)
        else:
            for file in os.listdir(content_folder):
                file_path = os.path.join(content_folder, file)
                with open(file_path) as f:
                    for link in f.readlines():
                        link = link.strip()
                        link_name = ""
                        if link[-1] == "/":
                            link_name = link.split("/")[-2][0:20]
                        else:
                            link_name = link.split("/")[-1][0:20]

                        obj = {
                            "format": "link",
                            "dataType":  folder["folder_name"],
                            "name": link_name,
                            "path": os.path.join(content_folder, file),
                            "docClass": None,
                            "license": None,
                            "source": None,
                            "link": link
                        }
                        jsonObjList.append(obj)
    return jsonObjList


"""
