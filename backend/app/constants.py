#!/usr/bin/env python
# encoding: utf-8

TYPE_ALL = "all"
TYPE_TEXT = "text"
TYPE_HTML = "html"
TYPE_LINK = "link"
TYPE_PDF = "pdf"
TYPE_TEXT ="text"
PATHS_TO_DIR = {
    TYPE_LINK: "../data/link/",
    TYPE_HTML: "../data/html/",
    TYPE_PDF: "../data/pdf/",
    TYPE_TEXT: "../data/text/",
}

FORMATS = ["link","text","html","xml"]


API_BASE_URI = "http://127.0.0.1:5000/documents"
MONGO_URI = 'mongodb://localhost:27017/codiEsp'

# MONGO_URI = 'mongodb://codiesp:codiesp@84.88.52.79:27017/codiEsp'
START_CASE_TERMS = ["caso [0-9]",
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
secret_key = 'secret'
