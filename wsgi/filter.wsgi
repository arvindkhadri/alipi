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
        lang = d['lang']
        filters = d['blog']
        #all re-narrations of the same xpath are grouped
        query = collection.group(
            key = Code('function(doc){return {"xpath" : doc.xpath, "about": doc.url}}'),
            condition={"about" : url, "lang" : lang,"elementtype":"text", "blog":{'$regex':'/'+filters+'.*/'}},
            initial={'narration': []},
            reduce=Code('function(doc,out){out.narration.push(doc);}') 
            )
        
        audio_query =collection.group(
            key = Code('function(doc){return {"xpath" : doc.xpath, "about": doc.url}}'),
            condition={"about" : url, "lang" : lang, 'elementtype':"audio/ogg", "blog":{'$regex':'/'+filters+'.*/'}},
            initial={'narration': []},
            reduce=Code('function(doc,out){out.narration.push(doc);}') 
            )

        image_query =collection.group(
            key = Code('function(doc){return {"xpath" : doc.xpath, "about": doc.url}}'),
            condition={"about" : url, "lang" : lang, 'elementtype':"image","blog":{'$regex':'/'+filters+'.*/'}},
            initial={'narration': []},
            reduce=Code('function(doc,out){out.narration.push(doc);}') 
            )

        try:
            for i in audio_query:
                query.append(i)
        except IndexError:
            pass
        try:
            for i in image_query:
                query.append(i)
        except IndexError:
            pass

        string=''
        if len(query)==0:
            print >> environ['wsgi.errors'], 'empty'
            connection.disconnect()
            return 'empty'
        else:
            for key in query:

                post = key['narration'][len(key['narration'])-1] #Fetching the last done re-narration
                
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
                                    connection.disconnect()
                                    print >> environ['wsgi.errors'], key
                            else:
                                try:
                                    string+="&"+str(key)+"::"+ str(post[key])
                                except TypeError:
                                    connection.disconnect()
                                    print >> environ['wsgi.errors'], key
                except UnicodeEncodeError:
                    connection.disconnect()
                    print >> environ['wsgi.errors'], key
                    print >> environ['wsgi.errors'], 'Error Encoding request string'
                    return 'empty'
        connection.disconnect()
        return string
    
