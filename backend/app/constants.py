#!/usr/bin/env python
# encoding: utf-8

TYPE_ALL = "all"
TYPE_TEXT = "text"
TYPE_HTML = "html"
TYPE_LINK = "link"
TYPE_PDF = "pdf"
TYPE_TEXT = "text"

FORMATS = ["xml", "pdf", "text", "link", "html"]
GeoipPath = "../GeoLite2-City_20200211/GeoLite2-City.mmdb"

API_BASE_URI = "http://127.0.0.1:5000/documents"
MONGO_URI = 'mongodb://localhost:27017/codiEsp'


REGEXTYPES = [
    {
        "style": ' style="background:rgba(255, 6, 6, 0.5); padding:0.3em; border-radius:0.3em;" ',
        "name": "find start",
    },
    {
        "style": ' style="background:rgba(255, 6, 6, 0.5); padding:0.3em; border-radius:0.3em;" ',
        "name": "global",
    },
    {
        "style": ' style="background:rgba(43, 218, 252, 0.5); padding:0.3em; border-radius:0.3em; " ',
        "name": "find end",
    },
]

# MONGO_URI = 'mongodb://codiesp:codiesp@84.88.52.79:27017/codiEsp'
START_CASE_TERMS = [
    "Describimos el caso",
    "Presentamos el caso",
    "Se presenta el caso",
    "caso clínico",
    "caso clínicos",
    "caso clinico",
    "casos clinicos",
    "caso cl&#.{1,4};nico",
    "casos cl&#.{1,4};nicos",
    "un paciente de",
    "una paciente de",
    "mujer de",
    "hombre de",
    "var&#.{1,4};n de",
    "paciente de",
]
END_CASE_TERMS = []
