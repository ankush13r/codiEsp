from app.utils.mongo import mongo
import geoip2.database
import os

from app import constants 


def get_valid_pagination_args(args: dict ={}):
    """Function get arguments, passed by user, to check page number and pae size values are valid.
    If arguments are invalid, it will return page number as 0 and page size as 10.

    :param args: Receives argument passed by client int url.
    :type args: dict
    :return: Page index and page size
    :rtype: Tuple(int,int)
    """
    try:
        page = args.get("pageIndex")
        per_page = args.get("pageSize")

        try:
            page = abs(int(page))
        except:
            page = 0

        try:
            per_page = abs(int(per_page))
        except:
            per_page = 10
    except AttributeError as err:
        page = 1
        per_page = 10

    start = int(page) * int(per_page)
    end = int(start) + int(per_page)

    return page,per_page, start, end


def get_next_sequence(sequence_name: str, start_sequence: int = 0):
    # Trying to find and modify the counters collection. If does not exist it return None, other wise the document modified.
    sequence_document = mongo.db.counters.find_one_and_update(
        {"_id": str(sequence_name)},
        {"$inc": {"sequence_value": 1}
         },
        new=True
    )
    # if query return a valid sequence document, it means the documents exist and has been modified. Otherwise insert document as new.
    if sequence_document:
        sequence_number = sequence_document["sequence_value"]

    else:
        # Initialize sequence_number as start_sequence it it's a valid int. Otherwise it is 0
        try:
            sequence_number = int(start_sequence)
        except:
            sequence_number = 0

        # Insert new document with sequence number start_sequence received in parameters or 0, if start_sequence is not valid.
        sequence_document = mongo.db.counters.insert_one(
            {"_id": str(sequence_name), "sequence_value": sequence_number})

    return sequence_number


def get_location(ip):
    """ Receives a ip address save into the mongo if it doesn't exist. It saves ip address and also other meta data as direction.
    If the the ip already exist it will find the mongo _id related to the ip address.
    In both case it returns mongo id related to the ip address.

    :param ip: ip address to save into mongo.
    :type ip: str
    :return: mongo db id, where the ip address is saved
    :rtype: str
    """
    _id = None
    try:
        # Getting mongo object by ip address, if exist.

        # If the ip address doesn't exist, it creates a new document.
        reader = geoip2.database.Reader(constants.GeoipPath)
        response = reader.city(ip)
        jsonObj = {"isoCode": response.country.iso_code,
                   "country": response.country.name,
                   "postalCode": response.postal.code,
                   "subdivisions": response.subdivisions.most_specific.name,
                   "city": response.city.name,
                   "latitude": response.location.latitude,
                   "longitude": response.location.longitude,
                   "ip": ip
                   }

        mongoObj = mongo.db.locations.find_one(
            {"ip": ip, "latitude": jsonObj["latitude"], "longitude": jsonObj["longitude"]})

        if not mongoObj:
            result = mongo.db.locations.insert_one(jsonObj)
            _id = result.inserted_id
        else:
            # Get id from mongo object.
            _id = mongoObj["_id"]

    except ValueError as err:
        return None, str(err)



    return _id, None