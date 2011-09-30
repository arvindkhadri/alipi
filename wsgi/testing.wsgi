import lxml.html
def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'text/html'),( 'Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    root = lxml.html.parse("http://a11y.in/a11y_fs/").getroot()
    return [root]
