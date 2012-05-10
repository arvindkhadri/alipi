from urllib import unquote_plus
import sys, os
sys.path.insert(0,(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))+'/wsgi')
import alipiUtils
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
    rstr = alipiUtils.doScrape(url)
    return [rstr]
    
