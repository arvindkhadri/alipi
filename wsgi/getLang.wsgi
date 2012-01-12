import MySQLdb
from cgi import parse_qs
import json

def application(environ, start_response):
	status = '200 OK'
	response_headers = [('Content-type', 'text/plain'),('Access-Control-Allow-Origin', '*')]
	start_response(status, response_headers)
	d = parse_qs(environ['QUERY_STRING'])
	sql_query = "select * from languages where language regexp '^{0}';".format(d['term'][0])
	db = MySQLdb.Connect("localhost","root","root","alipi")
	query_cursor = db.cursor()
	query_cursor.execute(sql_query)
	return json.dumps(query_cursor.fetchall())
