#!/usr/bin/env python
# encoding: utf-8
import os

THIS_DIR = os.path.dirname(os.path.abspath(__file__))

TYPE_ALL = "all"
TYPE_TEXT = "text"
TYPE_HTML = "html"
TYPE_LINK = "link"
TYPE_PDF = "pdf"
TYPE_TEXT = "text"

FORMATS = ["xml", "pdf", "text", "link", "html"]
GeoipPath = os.path.join(
    THIS_DIR,  'data/GeoLite2-City_20200211/GeoLite2-City.mmdb')

# os.pardir parent dir
