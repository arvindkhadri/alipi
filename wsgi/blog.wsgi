from cgi import parse_qs
from itertools import izip
import json
import os
import commands
from pymongo import *
from bson import *
from gdata import service
from urllib import unquote_plus 
import unicodedata
import json
def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    try:
        recieved = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
        
    except KeyError:
        recieved= 'empty'
        print >> environ['wsgi.errors'], recieved
        
    else:
        #connect to the DB
        connection = Connection('localhost',27017)
        db = connection['dev_alipi']
        collection = db['post']
        
        d={}
        parameter_pairs = recieved.split('&') 
        for parameter_pair in parameter_pairs:        
            parameter_pair = parameter_pair.split('=',1) 
            d[unquote_plus(parameter_pair[0])]  = unquote_plus(parameter_pair[1])
           
        url = d['url']
                #all re-narrations of the same xpath are grouped
        query = collection.group(
            key = None,
            condition={"about" : url},
            initial={'narration': []},
            reduce=Code('function(doc,out){out.narration.push(doc["blog"]);}') 
            )
        
        string=''
        if len(query)==0:
            print >> environ['wsgi.errors'], 'empty'
            connection.disconnect()
            return 'empty'
        else:
            mylist = list(set(query[0]['narration']))
            for i in range(0,len(mylist)):
                mylist[i] = mylist[i].rsplit('/',3)[0]
                mylist[i] = mylist[i].split("http://")[1]
            mylist = list(set(mylist))
            print >>environ['wsgi.errors'], mylist
            connection.disconnect()
            return json.dumps(mylist)
    
