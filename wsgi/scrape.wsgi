import lxml.html
import pymongo
from urllib import unquote_plus

def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    recieved = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
    d={}
    parameter_pairs = recieved.split('&') 
    for parameter_pair in parameter_pairs:        
        parameter_pair = parameter_pair.split('=',1) 
        d[unquote_plus(parameter_pair[0])]  = unquote_plus(parameter_pair[1])
    url = d['url']
    connection = pymongo.Connection('localhost', 27017)
    db = connection['alipi']
    collection = db['post']
    root = lxml.html.parse(url).getroot()
    elements = root.xpath('//@alipius/..')
    store_list = []
    ren_id = random.random()
    for element in elements:
        temp = {}
        store = {}
        for i in element.attrib['alipius'].split(','):
            temp[i.split(':')[0]] = i.split(':')[1]
        if temp.elementtype == 'audio/ogg':
            temp['about'] = element.about
            temp['xpath'] = element.xpath
            temp['data'] = element.src
            temp['blog'] = url
            temp['ren_id'] = ren_id
            store_list.append(temp)
        elif temp.elementtype.find('image'):
            temp['about'] = element.about
            temp['xpath'] = element.xpath
            temp['data'] = element.width+'x'+element.height+','element.src
            temp['blog'] = url
            temp['ren_id'] = ren_id
            store_list.append(temp)
        else:
            temp['about'] = element.about
            temp['xpath'] = element.xpath
            temp['data'] = element.text
            temp['blog'] = url
            temp['ren_id'] = ren_id
            store_list.append(temp)
    for i in store_list:
        collection.insert(i)
