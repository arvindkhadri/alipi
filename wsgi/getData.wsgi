import json
import os
#from pickle import *
#from bson.code import *
#from pymongo import *
#this file returns data.json, can be exploited later to return any file needed
def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'application/json'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    
    try:
        #read the request
        data = open(os.path.join(os.path.dirname(__file__),"state.json"), "r");
        rValue = data.read();
        data.close();
    except KeyError:
        print >> environ['wsgi.errors'], recieved
        return recieved
    
    else:
        return  json.dumps(json.loads(rValue))
