import gdata
import atom
from gdata import service
import json
from pymongo import *
from bson.code import *
from urllib import unquote_plus
import random

def application(environ, start_response):
    #set the headers
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain'),( 'Access-Control-Allow-Origin', '*')]
    start_response(status, response_headers)
    
    try:
        recieved = environ['wsgi.input'].read(int(environ['CONTENT_LENGTH']))
        
    except KeyError:
        recieved= 'empty'
        print >> environ['wsgi.errors'], recieved
        return 'empty'
    else:
        print >> environ['wsgi.errors'], recieved
        #connect to DB
        MONGODB_SERVER = 'localhost'
        MONGODB_PORT = 27017
        MONGODB_DB = 'dev_alipi'
        MONGODB_COLLECTION = 'post'
        #MONGODB_UNIQ_KEY = 'url'
        
        connection = Connection(MONGODB_SERVER, MONGODB_PORT)
        db = connection[MONGODB_DB]
        collection = db[MONGODB_COLLECTION]
        collection.create_index("url")
        ren_id = random.random()  #all elements from the same ren have the same id
        
        #parse recieved data and save in a dict()
        string = ''
        lang = ''
        target = ''
        about = ''
        author = ''
        title = ''
        commands = recieved.split('###') #for every elementary re-narration (e.g a paragraph)
        dicts = []
        i = 0
        for command in commands:
            d = {}
            parameter_pairs = command.split('&');
            for parameter_pair in parameter_pairs:        
                parameter_pair = parameter_pair.split('=',1)
                d[unquote_plus(parameter_pair[0])] = unquote_plus(parameter_pair[1])
            
            d['ren_id']= ren_id
            alipius = "lang:{0},location:{1},elementtype:{2},style:{3},author:{4}".format(d['lang'],d['location'],d['elementtype'],d['style'],d['author'])
            if d['elementtype'] == 'text':
                string +='<p about="{0}" xpath="{1}" alipius="{2}">{3}</p>'.format(d['about'],d['xpath'],alipius,d['data'])
            elif d['elementtype'] == 'audio/ogg':
                string+='<audio about="{0}" xpath="{1}" controls="controls" alipius="{2}" src="{3}"></audio>'.format(d['about'],d['xpath'],alipius,d['data'])
            else:
                src = d['data'].split(',')[1]
                width = d['data'].split(',')[0].split('x')[0]
                height = d['data'].split(',')[0].split('x')[1]
                string+='<img about="{0}" xpath="{1}" alipius="{2}" src="{3}" width={4} height={5}></img>'.format(d['about'],d['xpath'],alipius,src,width,height)

            lang = d['lang']
            target = d['location']
            about = d['about']
            author = d['author']
            title = d['title']
            d.pop('title')
            dicts.append(d)
            i+=1
        blogEntry= ''
        blogger_service = service.GDataService("allipi123@gmail.com", "allipi3354")
        blogger_service.source = 'Servelots-alipi-1.0'
        blogger_service.service = 'blogger'
        blogger_service.account_type = 'GOOGLE'
        blogger_service.server = 'www.blogger.com'
        blogger_service.ProgrammaticLogin()
        query = service.Query()
        query.feed = '/feeds/default/blogs'
        feed = blogger_service.Get(query.ToUri())
        blog_id = " "
        if title == '':
            title = "Re-narration"
        for entry in feed.entry:
            if "http://testalipi.blogspot.com/" == entry.GetHtmlLink().href:
                blog_id = entry.GetSelfLink().href.split("/")[-1]
                blogEntry = CreatePublicPost(blogger_service, blog_id, title=title, content=string + "<blockquote><p>Re-narration by "+author+' in '+lang+' targeting '+target+' for this web <a href="'+about+'">page</a></p></blockquote>')

        j=0
        while j< len(dicts):
            dicts[j]["blog"] = str(blogEntry.GetHtmlLink().href)
            collection.insert(dicts[j])
            j+=1
            
        #commands.getoutput(cmd)
        connection.disconnect()
        return 'ok'
        #return ["Blog successfuly posted!!"]

def CreatePublicPost(blogger_service, blog_id, title, content):
    entry = gdata.GDataEntry()
    entry.title = atom.Title('xhtml', title)
    entry.content = atom.Content(content_type='html', text=content)
    return blogger_service.Post(entry, '/feeds/%s/posts/default' % blog_id)



