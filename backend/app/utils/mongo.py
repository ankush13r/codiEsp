"""Python file to save mongo variable as global. Other methods can import it.

"""

from flask_pymongo import PyMongo

mongo = PyMongo()
