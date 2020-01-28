import os
import glob
import argparse

from pymongo import MongoClient

CLIENT = MongoClient('localhost:27017')
DB = CLIENT["codiEsp"]
COL_DOCUMENTS = DB["documents"]

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
                    "format": folder["folder_name"],
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
                            "format": folder["folder_name"],
                            "name": link_name,
                            "path": os.path.join(content_folder, file),
                            "docClass": None,
                            "license": None,
                            "source": None,
                            "link": link
                        }
                        jsonObjList.append(obj)
    return jsonObjList


def saveToMong(jsonObjList):

    for i, obj in enumerate(jsonObjList):
        try:
            found = list(COL_DOCUMENTS.find(obj))
            print(i)
            if not found:
                result = COL_DOCUMENTS.insert(obj)
            else:
                print("\nAlready exist")
        except Exception as err:
            print("Error: "err)
            
    r = COL_DOCUMENTS.distinct("format")
    print(r)

def main(base_path):
    jsonObjList = getDocsList(base_path)
    saveToMong(jsonObjList)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog ='',usage='%(prog)s -b /example/folder')
    # parser.add_argument('-y','--year',metavar='', type=int,help ='All data will be greater then that year.\n')
    parser.add_argument('-b','--base_path',metavar='',type=str,required=True, help ="""Path of the base folder where it will search for other folder to collect data as pdf, text, html, etc.
                    The type of data will be same as it's folder name""")  
  
    
    args = parser.parse_args()
    base_path = args.base_path
    main(base_path)

