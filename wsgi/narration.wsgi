from lxml.html import *
from cgi import parse_qs
from itertools import izip
import json
import os
import commands
from pymongo import *
from bson import *
from gdata import service
from urllib import unquote_plus 

def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),( 'Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    try:
        recieved = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
        
    except KeyError:
        recieved= 'empty'
        #print >> environ['wsgi.errors'], recieved
        
    else:
        #connect to the DB
        connection = Connection('localhost',27017)
        db = connection['alipi']
        collection = db['post']
        
        d={}
        parameter_pairs = recieved.split('&') 
        for parameter_pair in parameter_pairs:        
            parameter_pair = parameter_pair.split('=',1) 
            d[unquote_plus(parameter_pair[0])]  = unquote_plus(parameter_pair[1])
           
        url = d['url']
        xpath = d['xpath']
                
        #get the ren languages for the received url
        query = collection.group(
            key = Code('function(doc){return {"ren_id" : doc.ren_id}}'),
            condition={"about" : url, "xpath" : xpath},
            initial={'narration': []},
            reduce=Code('function(doc,out){out.narration.push(doc);}') 
            )
        print >> environ['wsgi.errors'], query
        string=''
        i = 0
        
        if len(query) == 0:
            #print >> environ['wsgi.errors'], 'empty'
            return ''
        
        else:
            while i< len(query):
                post = query[i]['narration'][0]
                try:
                    string+="###"
                    
                    for key in post:
                        if type(post[key]) is not float:
                            if key != '_id':
                                try:
                                    if type(post[key]) is unicode:
                                        string+="&"+str(key)+"::"+ post[key].encode('utf-8')
                                    else:
                                        string+="&"+str(key)+"::"+ post[key]
                                except TypeError:
                                    print >> environ['wsgi.errors'], key
                        else:
                            try:
                                string+="&"+str(key)+"::"+ str(post[key])
                            except TypeError:
                                print >> environ['wsgi.errors'], key
                except UnicodeEncodeError:
                    print >> environ['wsgi.errors'], 'Error Encoding request string'
                    return 'empty'
                else:
                    i+=1
            return string
            
