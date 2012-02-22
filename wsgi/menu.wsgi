import json
from pymongo import *
from bson.code import *
from urllib import unquote_plus 
def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    
    try:
        #read the request
        recieved = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
        d={}
        parameter_pairs = recieved.split('&') 
        for parameter_pair in parameter_pairs:        
            parameter_pair = parameter_pair.split('=',1) 
            d[unquote_plus(parameter_pair[0])]  = unquote_plus(parameter_pair[1])

    except KeyError:
        #print >> environ['wsgi.errors'], recieved
        return 'empty'
    
    else:
        #connect to the DB
        if d.has_key('option') == False:
            connection = Connection('localhost',27017)
            db = connection['dev_alipi']
            collection = db['post']
        #get the ren languages for the received url
            langForUrl = collection.group(
                key = Code('function(doc){return {"about" : doc.about}}'),
                condition={"about" : d['url']},
                initial={'lang': []},
                reduce=Code('function(doc, out){if (out.lang.indexOf(doc.lang) == -1) out.lang.push(doc.lang)}') #here xpath for test
            )
        
        #send the response
            if (langForUrl):
                # print >> environ['wsgi.errors'], d['url']
                # print >> environ['wsgi.errors'], json.dumps(langForUrl[0]['lang'])
                return json.dumps(langForUrl[0]['lang'])
            else:
                return "empty"
        else:
            connection = Connection('localhost',27017)
            db = connection['dev_alipi']
            collection = db['post']
        #get the ren languages for the received url
            langForUrl = collection.group(
                key = Code('function(doc){return {"about" : doc.about}}'),
                condition={"about" : d['url'],"blog":{'$regex':'/'+d['option']+'.*/'}},
                initial={'lang': []},
                reduce=Code('function(doc, out){if (out.lang.indexOf(doc.lang) == -1) out.lang.push(doc.lang)}') #here xpath for test
            )
        
        #send the response
            if (langForUrl):
                connection.disconnect()
                return json.dumps(langForUrl[0]['lang'])
            
            else:
                connection.disconnect()
                return "empty"

