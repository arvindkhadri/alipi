import MySQLdb
from cgi import parse_qs

def application(environ, start_response):
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    d = parse_qs(environ['QUERY_STRING'])
    sql_query = "select * from location where regexp ^{0}".format(d['term'])
    db = MySQLdb.Connect("localhost","root","sql123","alipi")
    query_cursor = db.cursor()
    response = query_cursor.execute(sql_query)
    return reponse.fetchall()
    
    
    
    
