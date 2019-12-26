
import api
import Constants
import Documents


def test_get_valid_pagination_args():
    # Possible cases that it can receive in arguments

     # case with page 0, it must return page as 1
    assert api.get_valid_pagination_args({"page": 0, "perPage": 10}) == (1, 10)

    # normal case page 1 and per page 10
    assert api.get_valid_pagination_args({"page": 1, "perPage": 10}) == (1, 10)

    # normal case page 5 and per page 15
    assert api.get_valid_pagination_args({"page": 5, "perPage": 15}) == (5, 15)

    # negative number change into absolute
    assert api.get_valid_pagination_args(
        {"page": -2, "perPage": -11}) == (2, 11)

    # pass nothing to the in dict object
    assert api.get_valid_pagination_args({}) == (1, 10)

    # pass wrong type argument
    assert api.get_valid_pagination_args(1) == (1, 10)


def test_check_data_type():
    # check data type if valid , passing a valid argument
    assert api.check_data_type(Constants.TYPE_PDF) ==  True
 
    # check data type if not valid , passing a invalid argument
    assert api.check_data_type("err") ==  False
    
        
