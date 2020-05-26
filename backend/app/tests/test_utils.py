
from app.utils import utils
from app import create_app
import uuid 

def test_get_valid_pagination_args():
    """ Testing function for get_valid_pagination_args with different possible arguments 
    """

    # Normal case for page 0 and per page 10
    assert utils.get_valid_pagination_args(
        {"pageIndex": 0, "pageSize": 10}) == (0, 10, 0, 10)

    # Normal case for page 5 and per page 15
    assert utils.get_valid_pagination_args(
        {"pageIndex": 5, "pageSize": 15}) == (5, 15, 75, 90)

    # Negative numbers must be treated as absolute
    assert utils.get_valid_pagination_args(
        {"pageIndex": -5, "pageSize": -15}) == (5, 15, 75, 90)

    # Case with no arguments. It must return 0, 10 by default
    assert utils.get_valid_pagination_args() == (0, 10, 0, 10)


def test_get_next_sequence():
    """ Testing function for get_next_sequence. 
    """
    app = create_app()
    seq = utils.get_next_sequence("test_name123")
    unique_string = uuid.uuid4().hex[:6].upper()

    #Check if the next sequence a valid sequence. 

    # It must start with number 0.
    assert utils.get_next_sequence(unique_string) == 0

    # It must return allways next sequence.
    assert utils.get_next_sequence("test_name123") == seq + 1


