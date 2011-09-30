import json
from pymongo import *
from bson.code import *
def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    
    try:
        #read the request
        recieved = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
        #print >> environ['wsgi.errors'], recieved
    except KeyError:
        #print >> environ['wsgi.errors'], recieved
        return 'empty'
    
    else:
        #connect to the DB
        connection = Connection('localhost',27017)
        db = connection['alipi']
        collection = db['post']
        #get the ren languages for the received url
        langForUrl = collection.group(
            key = Code('function(doc){return {"url" : doc.url}}'),
            condition={"url" : recieved},
            initial={'lang': []},
            reduce=Code('function(doc, out){if (out.lang.indexOf(doc.lang) == -1) out.lang.push(doc.lang)}') #here xpath for test
            )
        
        #send the response
        if (langForUrl):
            return json.dumps(langForUrl[0]['lang'])
        else:
            return "empty"
       
        