#import json
#import os
#from pickle import *
#from bson.code import *
#from pymongo import *
#this file returns data.json, can be exploited later to return any file needed

#def application(environ, start_response):
#    #set the headers
#    status = '200 OK'
#    response_headers = [('Content-type', 'application/json'),('Access-Control-Allow-Origin', '*')]
#    start_response(status, response_headers)
#    
#    try:
#        #read the request
#        data = open(os.path.join(os.path.dirname(__file__),"state.json"), "r");
#        rValue = data.read();
#        data.close();
#    except KeyError:
#        print >> environ['wsgi.errors'], recieved
#        return recieved
#    
#    else:
#        return  json.dumps(json.loads(rValue))


import MySQLdb
from cgi import parse_qs
import json

def application(environ, start_response):
	status = '200 OK'
	response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
	start_response(status, response_headers)
	d = parse_qs(environ['QUERY_STRING'])
	sql_query = "select * from location where city regexp '^{0}';".format(d['term'][0])
	db = MySQLdb.Connect("localhost","root","root","alipi")
	query_cursor = db.cursor()
	query_cursor.execute(sql_query)
	return json.dumps(query_cursor.fetchall())
