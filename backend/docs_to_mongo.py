import os
import glob
import argparse
from pymongo import MongoClient

CLIENT = MongoClient('localhost:27017')
DB = CLIENT["codiEsp"]
COL_DOCUMENTS = DB["documents"]
FORMATS = ["xml", "pdf", "text", "link", "html"]


def save_to_mongo(json_obj):
    try:
        found = list(COL_DOCUMENTS.find(json_obj))
        if not found:
            COL_DOCUMENTS.insert_one(json_obj)
        else:
            print("\nAlready exist")
    except Exception as err:
        print("Error: ", err)


def get_links_json(file_path, data_format):
    dir_name = os.path.basename(os.path.dirname(file_path))

    json_obj_list = []
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
            json_obj_list.append(obj)
    return json_obj_list


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
        # If the file is a directory 
        # then it will call self function recursively.
        if os.path.isdir(file):
            new_files = glob.glob(os.path.abspath(file+"/*"))
            get_data(new_files, data_format)

        # If it's a file then create a json object and save into mongoDb
        else:
            # If the format is link, then create get 
            # json list of all links from each file and save into mongoDB
            print("\t\tSaving file", file)
            if data_format == "link":
                json_objs = get_links_json(file, data_format)
                for json_obj in json_objs:
                    save_to_mongo(json_obj)
            else:
                # If the format is not link, 
                # then it create json object of each file and save into mongoDB
                json_obj = get_file_json(file, data_format)
                save_to_mongo(json_obj)


def main(files, data_format):

    get_data(files, data_format)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog='docs_to_mongo', usage=f'%(prog)s -i [/example/folder | folder/* ] -f {FORMATS}')
    parser.add_argument('-i', '--input', metavar='', nargs='+', type=str, required=True,
                        help="[N] folders of files or just files. If it receives folder/s it will get all files recursively.")
    parser.add_argument('-f', '--format', type=str,
                        metavar=FORMATS, choices=FORMATS, required=True, help="fromat for files")

    ARGS = parser.parse_args()
    FILES = ARGS.input
    DATA_FORMAT = ARGS.format

    main(FILES, DATA_FORMAT)

