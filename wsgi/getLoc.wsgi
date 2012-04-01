import pymongo
from cgi import parse_qs
import json
from bson import Code
def application(environ, start_response):
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    d = parse_qs(environ['QUERY_STRING'])
    connection = pymongo.Connection()
    db = connection['dev_alipi']
    collection = db['alipi_loc']
    term = '^{0}'.format(d['term'][0])
    query = collection.group(
            key = Code('function(doc){return {"name" : doc.name}}'),
            condition={"name":{'$regex':term, '$options':'i'}},
            initial={'na': []},
            reduce=Code('function(doc,out){out.na.push(doc);}') 
            )
    string = {'name':[]}
    if len(query) != 0:
        for i in query:
            for x in i['na']:
                if x != '_id':
                    string['name'].append((x['name']))
    connection.disconnect()
    return json.dumps(string)
                                  

                                 
