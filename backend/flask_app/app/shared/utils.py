from app.mongo import mongo

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
