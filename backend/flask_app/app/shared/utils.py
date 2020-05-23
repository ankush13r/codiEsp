from app.mongo import mongo


def get_valid_pagination_args(args: dict):
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
    return page, per_page


def get_next_sequence(sequence_name: str, start_sequence: int = 0):


    #Trying to find and modify the counters collection. If does not exist it return None, other wise the document modified.
    sequence_document = mongo.db.counters.find_and_modify(
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

        #Insert new document with sequence number start_sequence received in parameters or 0, if start_sequence is not valid.
        sequence_document = mongo.db.counters.insert_one(
            {"_id": str(sequence_name), "sequence_value": sequence_number})

    return sequence_number
