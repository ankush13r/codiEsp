#!/usr/bin/env python
# encoding: utf-8

TYPE_ALL = "all"
TYPE_TEXT = "text"
TYPE_HTML = "html"
TYPE_LINK = "link"
TYPE_PDF = "pdf"

PATHS_TO_DIR = {
    TYPE_LINK: "../data/link/",
    TYPE_HTML: "../data/html/",
    TYPE_PDF: "../data/pdf/",
    TYPE_TEXT: "../data/text/",
}

API_BASE_URI = "http://127.0.0.1:5000/documents"
MONGO_URI = 'mongodb://codiesp:codiesp@84.88.52.79:27017/codiEsp'
secret_key = 'secret'